/** @param {Request} request */
export function shouldBypassCache(request) {
	return (
		request.method !== 'GET' ||
		request.headers.has('authorization') ||
		request.headers.has('cookie') ||
		request.headers.has('range') ||
		/\bno-store\b/i.test(request.headers.get('cache-control') || '')
	);
}
