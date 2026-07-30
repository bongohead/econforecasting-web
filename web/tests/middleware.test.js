import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

process.env.NODE_ENV = 'test';
process.env.COOKIE_NAME = 'test_site_token';
process.env.DOMAIN = '';
process.env.SITE = 'econforecasting';
process.env.TITLE_SITE = 'Econforecasting';
process.env.SITE_TOKEN_SECRET = 'test-only-signing-secret-with-adequate-length';
process.env.SITE_ENCRYPT_SECRET = Buffer.alloc(32, 7).toString('base64');

const { default: app } = await import('../app.js');

let server;
let baseUrl;

before(async () => {
	await new Promise((resolve) => {
		server = app.listen(0, '127.0.0.1', resolve);
	});
	baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
	await new Promise((resolve, reject) => {
		server.close((error) => error ? reject(error) : resolve());
	});
});

test('static assets do not mint the site bearer cookie', async () => {
	const response = await fetch(`${baseUrl}/static/css/style.css`);

	assert.equal(response.status, 200);
	assert.equal(response.headers.get('set-cookie'), null);
});

test('page cookie is reused until it expires', async () => {
	const first = await fetch(`${baseUrl}/robots.txt`);
	const setCookie = first.headers.get('set-cookie');

	assert.equal(first.status, 200);
	assert.match(setCookie, /^test_site_token=/);
	assert.match(setCookie, /Max-Age=7200/);
	assert.match(setCookie, /Secure/);
	assert.match(setCookie, /SameSite=Lax/);

	const cookie = setCookie.split(';', 1)[0];
	const second = await fetch(`${baseUrl}/robots.txt`, {
		headers: { Cookie: cookie },
	});
	assert.equal(second.status, 200);
	assert.equal(second.headers.get('set-cookie'), null);
});

test('unknown pages, forecasts, and blog posts return a real 404', async () => {
	for (const pathname of ['/does-not-exist', '/forecast/not-a-series', '/blog/not-a-post']) {
		const response = await fetch(`${baseUrl}${pathname}`, {
			redirect: 'manual',
		});
		const body = await response.text();

		assert.equal(response.status, 404, pathname);
		assert.equal(response.headers.get('location'), null, pathname);
		assert.match(body, /<meta name="robots" content="noindex, follow"/, pathname);
	}
});

test('navigation and contact markup use the corrected links', async () => {
	const home = await fetch(`${baseUrl}/`);
	const homeBody = await home.text();

	assert.equal(home.status, 200);
	assert.match(homeBody, /href="\/forecast\/estr">Euro Short-Term Rate<\/a>/);
	assert.doesNotMatch(homeBody, /href="\/forecast\/estr">SONIA Rate<\/a>/);
	assert.match(homeBody, /aria-controls="navbar-collapse"/);
	assert.match(homeBody, /<label class="visually-hidden" for="autoComplete">Search forecasts<\/label>/);
	assert.match(homeBody, /rel="preconnect" href="https:\/\/api\.econforecasting\.com"/);
	assert.doesNotMatch(homeBody, /api\.macropredictions\.com/);
	assert.match(homeBody, /id="forecast-snapshot-title"[^>]*>Selected forecasts<\/h2>/);
	assert.match(homeBody, /href="\/forecast\/t10y" data-home-series="t10y"/);
	assert.match(homeBody, /href="\/forecast\/ffr" data-home-series="ffr"/);
	assert.match(homeBody, /href="\/forecast\/sofr" data-home-series="sofr"/);
	assert.match(homeBody, /href="\/forecast\/cpi" data-home-series="cpi"/);
	assert.match(homeBody, />10-year Treasury yield<\/h3>/);
	assert.match(homeBody, />Secured Overnight Financing Rate \(SOFR\)<\/h3>/);
	assert.match(homeBody, />Inflation \(YoY, % change in CPI\)<\/h3>/);

	const contact = await fetch(`${baseUrl}/contact`);
	const contactBody = await contact.text();

	assert.equal(contact.status, 200);
	assert.match(contactBody, /mailto:charles@econforecasting\.com/);
	assert.match(contactBody, />Email us<\/a>/);
	assert.doesNotMatch(contactBody, /<form\b/);
	assert.doesNotMatch(contactBody, /recaptcha/i);
});

test('content security policy has an explicit connection allowlist', async () => {
	const response = await fetch(`${baseUrl}/robots.txt`);
	const policy = response.headers.get('content-security-policy');
	const connectSources = /connect-src ([^;]+)/.exec(policy)?.[1] ?? '';

	assert.match(connectSources, /https:\/\/\*\.econforecasting\.com/);
	assert.match(connectSources, /https:\/\/plausible\.io/);
	assert.doesNotMatch(connectSources, /(?:^|\s)\*(?:\s|$)/);
});
