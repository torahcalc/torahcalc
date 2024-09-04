import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { calculateQuery } from '$lib/js/input';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const query = url.searchParams.get('query');
	const disambiguation = url.searchParams.get('disambiguation') || undefined;
	const format = url.searchParams.get('format') || undefined;

	if (!query) {
		return createErrorResponse('No query provided');
	}

	try {
		return createResponse(await calculateQuery(query, { disambiguation, format }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
