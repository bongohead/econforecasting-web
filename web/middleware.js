// @ts-nocheck
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import crypto from 'crypto';
import fs from 'fs';

	
// App-level middleware (above are router-level)
export const rate_limiter = rateLimit({
	windowMs: 1 * 10 * 60 * 1000, // 10 mins in milliseconds
	max: 1000,
	message: 'max 1000 requests per 10 minutes!',
	standardHeaders: true,
	legacyHeaders: false
});

export const cookie_setter = function(req, res, next) {

	const payload = {username: 'prodsite', auth_level: 'prodsite'};

	const iv_bytes = crypto.randomBytes(16);
	const pk_bytes = Buffer.from(process.env.ENCRYPT_SECRET, 'base64');

	const cipher = crypto.createCipheriv('aes-256-cbc', pk_bytes, iv_bytes);
	const encrypted_data_b64 = Buffer.concat([cipher.update(Buffer.from(JSON.stringify(payload), 'utf8')), cipher.final()]).toString('base64');

	const jwt_payload = {iv: iv_bytes.toString('base64'), data: encrypted_data_b64};

	// Set cookies
	const token = jwt.sign(jwt_payload, process.env.TOKEN_SECRET, {expiresIn: '2h'});

	res.cookie(process.env.COOKIE_NAME, token, {
		domain: process.env.DOMAIN, 
		secure: true,
		sameSite: 'lax',
		expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
	});
	
	next()
};

export const concat_js = function(filename, files) {
	
	return function(req, res, next) {

		if (process.env.NODE_ENV !== 'development' || Array.isArray(files) == false || files.length === 0) {

			next()

		} else {

			// Note: this will cause pm2 watch to crash
			const output = files.map((f) => {
				return fs.readFileSync('./../js/' + f + '.js').toString();
			}).join('\n');
			fs.writeFileSync('./cache/' + filename, output, 'utf8');
			
			next()
		}
	}
};

export const error_handler = (err, req, res, next) => {
	const errStatus = err.statusCode || 500;
	const errMsg = err.message || 'Something went wrong';
	res.status(errStatus).json({
		success: false,
		status: errStatus,
		message: errMsg,
		stack: process.env.NODE_ENV === 'development' ? err.stack : {}
	});
};