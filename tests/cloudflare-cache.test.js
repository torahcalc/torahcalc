import assert from 'node:assert/strict';
import { test } from 'node:test';
import { unstable_dev } from 'wrangler';

test('Cloudflare cache bypasses restricted requests before adapter lookup', async (context) => {
	const worker = await unstable_dev('worker.js', {
		config: 'wrangler.toml',
		local: true,
		persist: false,
		experimental: { disableExperimentalWarning: true },
	});
	context.after(() => worker.stop());

	/** @type {Record<string, string>[]} */
	const restrictedHeaders = [{ 'Cache-Control': 'no-cache' }, { 'Cache-Control': 'no-store' }, { Authorization: 'Bearer integration-test' }, { Cookie: 'session=integration-test' }, { Range: 'bytes=0-10' }];
	for (const headers of restrictedHeaders) {
		await context.test(`bypasses a primed cache for ${Object.keys(headers)[0]}`, async () => {
			const url = 'http://localhost/api/dateconverter/gregtoheb?year=2026&month=10&day=16&afterSunset=false';
			const prime = await worker.fetch(url);
			assert.equal(prime.status, 200);
			const expected = await prime.text();
			const hit = await worker.fetch(url);
			assert.equal(hit.headers.get('CF-Cache-Status'), 'HIT');
			assert.equal(await hit.text(), expected);

			const restricted = await worker.fetch(url, { headers });
			assert.equal(restricted.status, 200);
			assert.notEqual(restricted.headers.get('CF-Cache-Status'), 'HIT');
			assert.equal(restricted.headers.get('Cache-Control'), 'no-store');
			assert.equal(await restricted.text(), expected);

			const stillCached = await worker.fetch(url);
			assert.equal(stillCached.headers.get('CF-Cache-Status'), 'HIT');
			assert.equal(await stillCached.text(), expected);
		});
	}
});
