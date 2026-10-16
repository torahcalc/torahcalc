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
		}
		return app.fetch(request, env, context);
	},
};
