import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { getListOfGematriasInCommon } from '$lib/js/gematria.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const word1 = url.searchParams.get('word1');
	const word2 = url.searchParams.get('word2');

	try {
		if (!word1) throw new Error("Missing 'word1' query parameter");
		if (!word2) throw new Error("Missing 'word2' query parameter");
		return createResponse(getListOfGematriasInCommon(word1, word2));
	} catch (error) {
		return createErrorResponse(error);
	}
}
