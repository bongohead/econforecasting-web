# econforecasting-web (`dev.econforecasting.com` / `dev.macropredictions.com`) — Design Notes

This repo is the web front-end for the Econforecasting/Macropredictions sites. On this host it is run as two PM2 apps:
- `dev.econforecasting.com` (port `3011`)
- `dev.macropredictions.com` (port `3012`)

Both apps share the same Node/Express code in `web/` and differ via environment variables (`SITE`, `DOMAIN`, `TITLE_SITE`, etc).

## Repo layout (high level)
- `web/`: Node/Express server (ESM; `"type": "module"` in `web/package.json`)
  - `web/app.js`: main Express app
  - `web/middleware.js`: rate limiting, cookie/JWT setter, dev-only JS concatenation, error handler
  - `web/routes/*.js`: page/blog/forecast/robots/error routers
  - `web/static/`: served static assets (JS/CSS/images)
  - `web/cache/`: dev-only output for concatenated JS
- `views/`: Twig templates used for server-rendered pages
- `js/`: client-side JS sources (some concatenated into `web/cache/*.js` in development)
- `scss/`: Tailwind/Sass build artifacts and scripts
- `web/ecosystem.config.cjs`: PM2 config defining both dev sites

## How it runs (PM2)
`web/ecosystem.config.cjs` defines two apps that both run `web/app.js` but with different env:
- `PORT` (3011 vs 3012)
- `DOMAIN`, `SITE`, `TITLE_SITE`

The process working directory is `web/` (per PM2), and `web/app.js` loads env from `../.env`.

## Data/API dependency
Client pages fetch data from the central API server using `fetch()` from the browser. For dev it targets:
- `https://dev-api.macropredictions.com/external/<endpoint>`

For non-dev it targets:
- `https://api.macropredictions.com/external/<endpoint>`

The client-side helper is `js/helpers.js` (note it currently hardcodes the cookie name it reads).

## Existing auth model (what’s implemented today)

### Purpose
The sites call `/external/*` API endpoints from the browser, but want to deter scraping/bots and restrict access by “auth level”.

### Token format (browser → API)
On each page request, the web server sets a cookie containing a Bearer JWT:
- JWT payload: `{ iv, data }`
  - `iv`: base64 IV (16 bytes)
  - `data`: base64 AES-256-CBC encrypted JSON payload
- Encrypted JSON payload: `{ username, auth_level }` (currently hardcoded to `prodsite`)
- Cookie is set by `web/middleware.js` `cookie_setter`

The browser then calls the API with:
- `Authorization: Bearer <cookie-value>`

### API verification (server-side)
The API server (dev/prod) verifies:
1. JWT signature + expiry using `TOKEN_SECRET` (HS256)
2. Decrypts `{iv,data}` using `ENCRYPT_SECRET`
3. Checks decrypted payload has `username` + `auth_level`
4. Enforces permissions per-route

This means the web apps and the API must share the same `TOKEN_SECRET` + `ENCRYPT_SECRET` pair for the relevant environment.

## Do we need the same ESM + library changes as `logging` / `dev-api`?

### ESM
No: `web/` is already ESM (e.g. `import ...` in `web/app.js` and `"type":"module"` in `web/package.json`).

### `jsonwebtoken` → `jose`
Yes (implemented 2026-01-04):
- `web/middleware.js` now signs JWTs with `jose` (`SignJWT`, HS256) and preserves the existing `{iv,data}` payload format.
- Removed `jsonwebtoken` and its transitive `buffer-equal-constant-time` dependency (no more Node 25 `SlowBuffer` patching).
- Deleted `web/scripts/patch-buffer-equal-constant-time.cjs` and removed the `postinstall` hook from `web/package.json`.

## Recommendations (future work)

### Auth / security
- Make `auth_level` configurable (e.g. `AUTH_LEVEL` env var) instead of hardcoded `prodsite`.
- Client JS hardcodes the cookie name (`js/helpers.js` reads `1gasdog`); consider injecting `COOKIE_NAME` via templates so `COOKIE_NAME` can vary per environment/site without editing JS.
- Replace `window.location.href.includes('dev')` switching with an explicit config value rendered into the page (more robust and testable).

### Runtime stability
- Pin Node to an LTS release (20/22) per service to avoid future runtime breakage from non-LTS upgrades.

### Express / config robustness
- `web/app.js` uses relative paths for `views` (`../views`) and `.env` (`../.env`). Consider resolving these via `__dirname` consistently so the app is not sensitive to process working directory.
- `helmet` CSP currently includes `connect-src` with `'*'` which weakens the policy; tighten if possible.

### Observability
- Add basic request logging (method/path/status/duration) and rate-limit events so issues can be triaged faster.
