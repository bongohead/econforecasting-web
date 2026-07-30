// @ts-nocheck
import { rateLimit } from 'express-rate-limit';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jwtVerify, SignJWT } from 'jose';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.join(currentDirectory, '..', 'js');
const cacheDirectory = path.join(currentDirectory, 'cache');
const builtJsBundles = new Set();

	
// App-level middleware (above are router-level)
export const rate_limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 1000,
	message: 'Maximum 1000 page requests per 10 minutes.',
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});

function getCookie(req, name) {
	const cookie = (req.get('cookie') ?? '')
		.split(';')
		.map((part) => part.trim())
		.find((part) => part.startsWith(`${name}=`));
	if (!cookie) return null;

	try {
		return decodeURIComponent(cookie.slice(name.length + 1));
	} catch {
		return null;
	}
}

async function hasValidSiteToken(req, cookieName, tokenSecretBytes) {
	const token = getCookie(req, cookieName);
	if (!token) return false;

	try {
		const { payload } = await jwtVerify(token, tokenSecretBytes, {
			algorithms: ['HS256'],
		});
		return typeof payload.iv === 'string' && typeof payload.data === 'string';
	} catch {
		return false;
	}
}

export const cookie_setter = async function (req, res, next) {
	try {
		const cookieName = String(process.env.COOKIE_NAME ?? '');
		const tokenSecret = String(
			process.env.SITE_TOKEN_SECRET ?? process.env.TOKEN_SECRET ?? '',
		);
		const encryptionSecret = String(
			process.env.SITE_ENCRYPT_SECRET ?? process.env.ENCRYPT_SECRET ?? '',
		);
		const tokenSecretBytes = new TextEncoder().encode(tokenSecret);
		const pk_bytes = Buffer.from(encryptionSecret, 'base64');

		if (!cookieName || tokenSecretBytes.length === 0 || pk_bytes.length !== 32) {
			throw new Error('Site authentication configuration is incomplete');
		}
		if (await hasValidSiteToken(req, cookieName, tokenSecretBytes)) return next();

		const payload = { username: 'prodsite', auth_level: 'prodsite' };

		const iv_bytes = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv('aes-256-cbc', pk_bytes, iv_bytes);
		const encrypted_data_b64 = Buffer.concat([
			cipher.update(Buffer.from(JSON.stringify(payload), 'utf8')),
			cipher.final(),
		]).toString('base64');

		const jwt_payload = { iv: iv_bytes.toString('base64'), data: encrypted_data_b64 };

		const token = await new SignJWT(jwt_payload)
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('2h')
			.sign(tokenSecretBytes);

		res.cookie(cookieName, token, {
			...(process.env.DOMAIN ? { domain: process.env.DOMAIN } : {}),
			secure: true,
			sameSite: 'lax',
			maxAge: 2 * 60 * 60 * 1000,
		});

		return next();
	} catch (err) {
		return next(err);
	}
};

const buildJsBundle = function(filename, files) {
	const output = files
		.map((file) => fs.readFileSync(path.join(sourceDirectory, `${file}.js`), 'utf8'))
		.join('\n');
	const outputPath = path.join(cacheDirectory, filename);
	const temporaryPath = `${outputPath}.${process.pid}.tmp`;

	fs.mkdirSync(cacheDirectory, { recursive: true });
	fs.writeFileSync(temporaryPath, output, 'utf8');
	fs.renameSync(temporaryPath, outputPath);
	builtJsBundles.add(filename);
};

export const pruneJsBundles = function() {
	for (const entry of fs.readdirSync(cacheDirectory, { withFileTypes: true })) {
		if (entry.isFile() && entry.name.endsWith('.js') && !builtJsBundles.has(entry.name)) {
			fs.unlinkSync(path.join(cacheDirectory, entry.name));
		}
	}
};

export const concat_js = function(filename, files) {
	if (typeof filename !== 'string' || !Array.isArray(files) || files.length === 0) {
		return (req, res, next) => next();
	}

	// Build once when the application starts. Development requests rebuild the
	// bundle so source edits remain visible without restarting the process.
	buildJsBundle(filename, files);

	return function(req, res, next) {
		try {
			if (process.env.NODE_ENV === 'development') buildJsBundle(filename, files);
			return next();
		} catch (error) {
			return next(error);
		}
	};
};

export const error_handler = (err, req, res, next) => {
	if (res.headersSent) return next(err);

	const errStatus = Number.isInteger(err.statusCode) ? err.statusCode : 500;
	console.error(err);
	res.status(errStatus).json({
		success: false,
		status: errStatus,
		message: errStatus >= 500 ? 'The request could not be completed.' : 'The request is invalid.',
	});
};
