const CONSTANTS = require('dotenv').config().parsed;

const router = require('express').Router();
const Pool = require('pg').Pool; // Use Pool for non-transactional queries
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authenticateToken = require('./../middleware').authenticateToken;

const pool = new Pool({
	user: CONSTANTS['DB_USER'],
	host: CONSTANTS['DB_HOST'],
	database: CONSTANTS['DB_DATABASE'],
	password: CONSTANTS['DB_PASSWORD'],
	port: CONSTANTS['DB_PORT']
});


/*** Default routes ***/
router.get('/', function(req, res) {
	res.json({success: 0, error: "invalid request (wrong request type)"});
});

router.post('/', function(req, res) {
	res.json({success: 0, error: "invalid request (empty)"});
});


/*** Add a new user (from superadmin only) ***/
router.post('/add_user', function(req, res) {
	
	const admin_key = req.body.admin_key;
	const username = req.body.username;
	const auth_key = req.body.auth_key;

	if (username == null || username === '' || auth_key == null || auth_key === '' || admin_key == null || admin_key === '') {
		res.statusMessage = 'invalid parameters';
		res.status(400).end();
		return;
	}
	if (admin_key != process.env.ADMIN_KEY) {
		res.status(200).json('invalid admin key');
		return;
	}
	
	// s1cl6CJCVBnO
	bcrypt.genSalt(10)
		.then(salt => {
			return bcrypt.hash(auth_key, salt)
		}).then(hash => {
			
			const query = {
				text: 'INSERT INTO api_credentials (username, auth_key) VALUES ($1, $2) RETURNING *',
				values: [username, hash]
			};
						
			pool.query(query)
				.then(db_result => {
					res.status(200).json({success: 1, result: db_result.rows});
				})
				.catch(err => {
					res.status(200).json({success: 0, result: err});
				});
		});
});

/*** Get token ***/
router.post('/get_token', function(req, res) {
	
	const username = req.body.username;
	const auth_key = req.body.auth_key;

	if (username == null || username === '' || auth_key == null || auth_key === '') {
		res.statusMessage = 'invalid parameters';
		res.status(400).end();
		return;
	}
	
	pool
		.query({
			text: 'SELECT username, auth_key FROM api_credentials WHERE username = $1::text LIMIT 1',
			values: [username]
			})
		.then(db_result => {
			
			if (db_result.rows.length !== 1) {
				res.status(200).json({success: 0, error_message: 'invalid username or auth_key'});
				return;
			}
			
			bcrypt.compare(auth_key, db_result.rows[0].auth_key, function(e, is_valid) {
				if (is_valid == false) {
					res.status(200).json({success: 0, error_message: 'invalid username or auth_key'});
					return;
				}
				
				const token = jwt.sign({username: username}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
				res.status(200).json(token);
			});			
		})
		.catch(err => {
			res.status(200).json({success: 0, error_message: 'unknown error'});
		});

});

/*** Get obs ****/
/***
Note that anything that passes through authenticateToken will have access to the req.user key 
***/
router.post('/get_obs_all_vintages', authenticateToken, function(req, res) {
		
	const varname = req.query.varname;
	const freq = req.query.freq;
	const min_vdate = req.query.min_vdate || '2000-01-01';

	if (varname == null || varname === '' || freq == null || !['m', 'q'].includes(freq) || min_vdate.match(/^\d{4}-\d{2}-\d{2}$/) === null) {
		res.statusMessage = 'invalid parameters';
		res.status(400).end();
		return;
	}
	
	query_text =
		`SELECT
			f.shortname,
			TO_CHAR(vdate, 'yyyy-mm-dd') AS vdate,
			TO_CHAR(date, 'yyyy-mm-dd') AS date,
			value
		FROM forecast_values v
		LEFT JOIN forecasts f ON v.forecast = f.id
		WHERE 
			varname = $1::text
			AND form = 'd1'
			AND freq = $2::text
			AND f.external = FALSE 
			AND forecast != 'now'
			AND vdate >= $3::date
		ORDER BY forecast, vdate, date
		LIMIT 20000`
		
	pool
		.query({
			text: query_text,
			values: [varname, freq, min_vdate]
			})
		.then(db_result => {
			const data = db_result.rows.map(function(x) {
				return {
					forecast: x.shortname,
					vdate: x.vdate,
					date: x.date,
					value: Number(x.value)
				}
			});
			
			res.status(200).json({success: 1, user: req.user, freq: freq, varname: varname, count: data.length, result: data});

		})
		.catch(err => {
			res.status(200).json({success: 0, user: req.user, freq: freq, varname: varname, result: err});
		});
});


/*** Get obs for a varname for last vintage ***/
router.post('/get_obs_last_vintage', authenticateToken, function(req, res) {
		
	const varname = req.query.varname;
	const freq = req.query.freq;
	
	if (varname == null || varname === '' || freq == null || !['m', 'q'].includes(freq)) {
		res.statusMessage = 'invalid parameters';
		res.status(400).end();
		return;
	}
	query_text =
		`SELECT
			f.shortname,
			TO_CHAR(vdate, 'yyyy-mm-dd') AS vdate,
			TO_CHAR(date, 'yyyy-mm-dd') AS date,
			value
		FROM 
		(
			SELECT forecast, freq, varname, vdate, date, value, MAX(vdate) OVER (partition by forecast, freq, varname) AS max_vdate
			FROM
			(
				SELECT 
					forecast, freq, date, varname, MAX(vdate) as vdate, last(value, vdate) as VALUE
				FROM forecast_values
				WHERE 
					varname = $1::text
					AND form = 'd1'
					AND freq = $2::text
					AND forecast != 'now'
				GROUP BY forecast, varname, freq, date
				ORDER BY forecast, varname, freq, date
			) a
		) b
		LEFT JOIN forecasts f ON b.forecast = f.id
		WHERE max_vdate = vdate AND f.external = FALSE 
		ORDER BY vdate, date`;
		
	pool
		.query({
			text: query_text,
			values: [varname, freq]
			})
		.then(db_result => {
			
			const data = db_result.rows.map(function(x) {
				return {
					forecast: x.shortname,
					vdate: x.vdate,
					date: x.date,
					value: Number(x.value)
				}
			});
			
			res.status(200).json({success: 1, user: req.user, freq: freq, varname: varname, count: data.length, result: data});
		})
		.catch(err => {
			res.status(200).json({success: 0, user: req.user, freq: freq, varname: varname, result: err});
		});
});




module.exports = router;