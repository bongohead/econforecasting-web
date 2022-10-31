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
		windowMs: 1 * 60 * 60 * 1000, // 1 hrs in milliseconds
		max: 10,
		message: 'You have exceeded the 100 requests in 24 hrs limit!', 
		standardHeaders: true,
		legacyHeaders: false,
	})

};