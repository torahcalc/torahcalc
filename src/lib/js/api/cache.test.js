import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getApiCacheTtl, handleApiCache } from './cache.js';

const fixedDate = '/api/dateconverter/gregtoheb?year=2026&month=10&day=16&afterSunset=false';

/** @param {string} path */
function url(path) {
	return new URL(path, 'https://www.torahcalc.com');
}

describe('API cache expiry', () => {
	const now = new Date(2026, 9, 16, 23, 59, 30);

	it.each(Object.keys(import.meta.glob('/src/routes/api/**/+server.js')).map((path) => path.replace('/src/routes', '').replace('/+server.js', '')))(
		'registers a cache policy for API endpoint %s',
		(path) => {
			expect(getApiCacheTtl(url(path), now)).not.toBeNull();
		}
	);

	it('keeps fully specified dates and non-calendar calculations for seven days', () => {
		expect(getApiCacheTtl(url(fixedDate), now)).toBe(604800);
		expect(getApiCacheTtl(url('/api/gematria?text=test'), now)).toBe(604800);
		expect(getApiCacheTtl(url('/api/holidays/hebrewyear?hebrewYear=5787'), now)).toBe(604800);
	});

	it.each(['/api/gematria?type=coins', '/api/gematriamatch?type=coins', '/api/gematriasearch?type=coins', '/api/unitconverter?type=length', '/api/unitcharts?type=length'])(
		'keeps non-coin calculations long-lived: %s',
		(path) => {
			expect(getApiCacheTtl(url(path), now)).toBe(604800);
		}
	);

	it.each([
		'/api/dateconverter/gregtoheb',
		'/api/dateconverter/gregtoheb?year=2026',
		'/api/dateconverter/gregtoheb?year=2026&month=10&day=',
		'/api/dailylearning',
		'/api/holidays/startdate',
		'/api/molad?year=5787',
	])('expires implicit or partial dates at midnight: %s', (path) => {
		expect(getApiCacheTtl(url(path), now)).toBe(30);
	});

	it('caps free-text and coin-value caches and leaves unknown routes alone', () => {
		expect(getApiCacheTtl(url('/api/input?query=today'), now)).toBe(30);
		expect(getApiCacheTtl(url('/api/input?query=today'), new Date(2026, 9, 16, 12))).toBe(60);
		expect(getApiCacheTtl(url('/api/unitconverter?type=coins'), new Date(2026, 9, 16, 12))).toBe(3600);
		expect(getApiCacheTtl(url('/api/unitcharts?type=coins'), new Date(2026, 9, 16, 12))).toBe(3600);
		expect(getApiCacheTtl(url('/api/unknown'), now)).toBeNull();
		expect(getApiCacheTtl(url('/api'), now)).toBeNull();
	});

	it('uses UTC midnight for the Zmanim endpoint UTC date default', () => {
		expect(getApiCacheTtl(url('/api/zmanim'), new Date('2026-10-16T23:59:30Z'))).toBe(30);
	});
});

describe('API cache hook', () => {
	let resolve = vi.fn(async () => new Response(JSON.stringify({ success: true, data: 'result' })));

	/** @param {string} [path] @param {RequestInit} [init] */
	function run(path = fixedDate, init = {}) {
		const requestUrl = url(path);
		const event = /** @type {import('@sveltejs/kit').RequestEvent} */ ({ url: requestUrl, request: new Request(requestUrl, init) });
		return handleApiCache({ event, resolve });
	}

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2026, 9, 16, 12));
		resolve = vi.fn(async () => new Response(JSON.stringify({ success: true, data: 'result' })));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('supplies cache headers for the adapter without changing the response body', async () => {
		const response = await run();
		expect(response.headers.get('Cache-Control')).toBe('public, max-age=604800');
		expect(response.headers.get('Expires')).toBe(new Date(2026, 9, 23, 12).toUTCString());
		expect(await response.json()).toEqual({ success: true, data: 'result' });
	});

	it('recomputes implicit dates after midnight', async () => {
		vi.setSystemTime(new Date(2026, 9, 16, 23, 59, 30));
		const first = await run('/api/dailylearning');
		expect(first.headers.get('Cache-Control')).toBe('public, max-age=30');
		vi.advanceTimersByTime(31000);
		await run('/api/dailylearning');
		expect(resolve).toHaveBeenCalledTimes(2);
	});

	it('does not store a response that finishes after its date expires', async () => {
		vi.setSystemTime(new Date(2026, 9, 16, 23, 59, 59));
		resolve.mockImplementationOnce(async () => {
			vi.advanceTimersByTime(2000);
			return new Response('yesterday');
		});
		expect((await run('/api/dailylearning')).headers.get('Cache-Control')).toBe('no-store');
	});

	it('subtracts endpoint computation time from the cache lifetime', async () => {
		resolve.mockImplementationOnce(async () => {
			vi.advanceTimersByTime(2000);
			return new Response('result');
		});
		expect((await run()).headers.get('Cache-Control')).toBe('public, max-age=604798');
	});

	it.each(
		/** @type {RequestInit[]} */ ([
			{ method: 'POST' },
			{ headers: { authorization: 'Bearer test' } },
			{ headers: { cookie: 'session=test' } },
			{ headers: { range: 'bytes=0-10' } },
			{ headers: { 'cache-control': 'no-store' } },
		])
	)('does not cache requests that are not public GETs: %j', async (init) => {
		expect((await run(fixedDate, init)).headers.get('Cache-Control')).toBe('no-store');
	});

	it('does not store errors or private responses', async () => {
		resolve.mockResolvedValueOnce(new Response('error', { status: 400 }));
		expect((await run()).headers.get('Cache-Control')).toBe('no-store');
		resolve.mockResolvedValueOnce(new Response('private', { headers: { 'set-cookie': 'session=test' } }));
		expect((await run()).headers.get('Cache-Control')).toBe('no-store');
	});

	it.each(/** @type {Record<string, string>[]} */ ([{ 'Cache-Control': 'private' }, { 'Cache-Control': 'no-store' }, { Vary: 'Accept' }]))(
		'does not cache responses with restrictive headers: %j',
		async (headers) => {
			resolve.mockResolvedValueOnce(new Response('result', { headers }));
			expect((await run()).headers.get('Cache-Control')).toBe('no-store');
		}
	);

	it('leaves non-API pages and unregistered routes unchanged', async () => {
		expect((await run('/api')).headers.get('Cache-Control')).toBeNull();
		expect((await run('/tools/date-converter')).headers.get('Cache-Control')).toBeNull();
	});
});
