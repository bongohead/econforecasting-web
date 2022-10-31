const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit').rateLimit;

module.exports = {
	
	authenticateToken: function(req, res, next) {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (token == null) return res.sendStatus(401);

		jwt.verify(token, String(process.env.TOKEN_SECRET), (err, decoded_token) => {
			if (err) return res.sendStatus(403)
			req.user = decoded_token['username']
			next()
		});
	},
	
	
	rateLimiter: rateLimit({
		windowMs: 1 * 15 * 60 * 1000, // 1 hrs in milliseconds
		max: 100,
		message: 'max 100 requests per 15 minutes!', 
		standardHeaders: true,
		legacyHeaders: false,
	})

};