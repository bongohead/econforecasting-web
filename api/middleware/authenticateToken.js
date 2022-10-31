module.exports = {
	
	authenticateToken: function(req, res, next) {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (token == null) return res.sendStatus(401);

		jwt.verify(token, String(process.env.TOKEN_SECRET), (err, user) => {
			if (err) return res.sendStatus(403)
			req.user = user
			next()
		});
	}

};