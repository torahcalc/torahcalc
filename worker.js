import app from './.svelte-kit/cloudflare/_worker.js';
import { shouldBypassCache } from './src/lib/js/api/cache-request.js';

/** @type {typeof app} */
export default {
	...app,
	async fetch(request, env, context) {
		if (shouldBypassCache(request)) {
			const headers = new Headers(request.headers);
			headers.append('Cache-Control', 'no-cache, no-store');
			request = new Request(request, { headers });
			return app.fetch(request, env, context);
		}

		const cached = await caches.default.match(request);
		if (cached) {
			const response = new Response(cached.body, cached);
			response.headers.set('CF-Cache-Status', 'HIT');
			return response;
		}

		const response = await app.fetch(request, env, context);
		const cacheControl = response.headers.get('Cache-Control') || '';
		if (response.status === 200 && cacheControl && !response.headers.has('Set-Cookie') && !response.headers.has('Vary') && !/(private|no-cache|no-store)/i.test(cacheControl)) {
			context.waitUntil(caches.default.put(request, response.clone()));
		}
		return response;
	},
};
