const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit').rateLimit;
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
		// Set cookies
		const token = jwt.sign(
			{username: 'admin', auth_level: 'admin'},
			process.env.TOKEN_SECRET,
			{expiresIn: '1h'}
		);

		res.cookie(process.env.COOKIE_NAME, token, {
			domain: '.econscale.com', 
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
				}).join(';');

				/*/
				const uglify = require("uglify-js");

				const output_dict = files.reduce((accum, f) => {
					accum[f] = fs.readFileSync(path.join(__dirname, '/../js/' + f + '.js'), 'utf8');
					return accum;
				}, {})
				
				const output = uglify.minify(
					output_dict,
					options = {
						compress: false
					}
				).code;
				*/

				fs.writeFileSync(path.join(__dirname, '/cache/' + filename), output, 'utf8');
				next()
			}
		}
	}



};
