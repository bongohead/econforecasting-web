RESET_TABLE = F
DIR = '/var/www/internal.econscale.com'

library(tidyverse)
library(httr)
library(DBI)
library(RPostgres)
library(dotenv)

dotenv::load_dot_env(file.path(DIR, '.env'))

db = dbConnect(
	RPostgres::Postgres(),
	dbname = Sys.getenv('DB_DATABASE'), host = Sys.getenv('DB_HOST'), port = Sys.getenv('DB_PORT'),
	user = Sys.getenv('DB_USER'), password = Sys.getenv('DB_PASSWORD')
)

if (RESET_TABLE) {
	dbExecute(db, 'DROP TABLE IF EXISTS api_v1_credentials')
	dbExecute(
		db,
		"
		CREATE TABLE api_v1_credentials (
			id SERIAL NOT NULL,
			username VARCHAR(50) NOT NULL,
			auth_key VARCHAR(255) NOT NULL,
			auth_level VARCHAR(50) NOT NULL,
			is_active BOOLEAN NOT NULL DEFAULT 1::BOOLEAN,
			created_at_utc TIMESTAMP NOT NULL DEFAULT (NOW() at TIME ZONE 'UTC'),
			CONSTRAINT api_v1_credentials_pk PRIMARY KEY (id),
			CONSTRAINT api_v1_username_uk UNIQUE(username),
			-- WWW is for nginx use only
			-- Business + ent are third party API contacts
			-- Admin is for setup use
			CONSTRAINT api_v1_auth_level_constraint CHECK (
				auth_level IN ('admin', 'www', 'business', 'enterprise')
			)
		);
		"
	)
}

dbGetQuery(db, 'SELECT * FROM api_v1_credentials')
hasher = function(pk) {
	content(httr::POST(
		'https://internal.econscale.com/api/get_hash',
		body = list(auth_key = pk),
		encode = 'form'
	))$result
}

# Correct only if referring to the process of inserting/retrieving values.
# But readers should understand that both data types, timestamp with time zone and timestamp without time zone,
# in Postgres do *not actually store time zone information. You can confirm this with a glance at the data type doc
# page: Both types takes up the same number of octets and have the save range of values, thus no room for storing
# time zone info. The text of the page confirms this. Something of a misnomer: "without tz" means
# "ignore offset when inserting data" and "with tz" means "use offset to adjust to UTC".
# dbExecute(db, 'DROP TABLE api_v1_credentials')
dbExecute(db, str_glue("
	INSERT INTO api_v1_credentials (username, auth_key, auth_level, is_active)
	VALUES ('{un}', '{pk}', 'admin', 1::BOOL)
	", un = Sys.getenv('ADMIN_USER'), pk = hasher(Sys.getenv('ADMIN_KEY'))))

dbExecute(db, str_glue("
	INSERT INTO api_v1_credentials (username, auth_key, auth_level, is_active)
	VALUES ('{un}', '{pk}', 'business', 1::BOOL)
	", un = Sys.getenv('BUSINESS_USER'), pk = hasher(Sys.getenv('BUSINESS_KEY')) ))

dbExecute(db, str_glue("
	INSERT INTO api_v1_credentials (username, auth_key, auth_level, is_active)
	VALUES ('{un}', '{pk}', 'www', 1::BOOL)
	", un = Sys.getenv('WEB_USER'), pk = hasher(Sys.getenv('WEB_KEY'))))

as_tibble(dbGetQuery(db, "SELECT * FROM api_v1_credentials")) %>%
	mutate(., created_at_utc = with_tz(created_at_utc, 'US/Eastern'))


## Oauth Test 1 - Second should result in permisisons error
token_www = content(POST(
	'https://internal.econscale.com/api/get_token',
	body = list(username = Sys.getenv('WEB_USER'), auth_key = Sys.getenv('WEB_KEY')),
	encode = 'form'
	))$result

token_admin = content(POST(
	'https://internal.econscale.com/api/get_token',
	body = list(username = Sys.getenv('ADMIN_USER'), auth_key = Sys.getenv('ADMIN_KEY')),
	encode = 'form'
	))$result

GET(
	'https://internal.econscale.com/api/get_test?varname=dog',
	add_headers(authorization = paste0('Bearer ', token_www)),
	encode = 'form'
	) %>% content(.)

GET(
	'https://internal.econscale.com/api/get_test?varname=dog',
	add_headers(authorization = paste0('Bearer ', token_admin)),
	encode = 'form'
	) %>% content(.)




# Test adding user
# POST(
# 	'https://internal.econscale.com/api/add_user',
# 	add_headers(
# 		authorization = paste0('Bearer ', token)
# 		),
# 	body = list(
# 		username = 'charles4'
# 		),
# 	encode = 'form'
# ) %>% content(.)
