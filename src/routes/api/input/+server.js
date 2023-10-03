import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { calculateQuery } from '$lib/js/input';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const query = url.searchParams.get('query');

	if (!query) {
		return createErrorResponse('No query provided');
	}

	try {
		return createResponse(await calculateQuery(query));
	} catch (error) {
		return createErrorResponse(error);
	}
}
