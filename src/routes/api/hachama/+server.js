import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { nextBirkasHachama } from '$lib/js/hachama.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const year = Number(url.searchParams.get('year') || new Date().getFullYear());

	if (isNaN(year)) {
		return createErrorResponse('Invalid year.');
	}

	try {
		return createResponse(nextBirkasHachama(year));
	} catch (error) {
		return createErrorResponse(error);
	}
}
