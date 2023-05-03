const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit').rateLimit;
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

module.exports = {
	
	// App-level middleware (above are router-level)
	rateLimiter: rateLimit({
		windowMs: 1 * 10 * 60 * 1000, // 10 mins in milliseconds
		max: 1000,
		message: 'max 1000 requests per 10 minutes!',
		standardHeaders: true,
		legacyHeaders: false
	}),

	cookieSetter: function(req, res, next) {

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
	},

	concatJs: function(filename, files) {
		
		return function(req, res, next) {

			if (process.env.NODE_ENV !== 'development' || Array.isArray(files) == false || files.length === 0) {

				next()

			} else {

				// Note: this will cause pm2 watch to crash
				const output = files.map((f) => {
					return fs.readFileSync(path.join(__dirname, '/../js/' + f + '.js')).toString();
				}).join('\n');
				fs.writeFileSync(path.join(__dirname, '/cache/' + filename), output, 'utf8');
				
				next()
			}
		}
	}



};
