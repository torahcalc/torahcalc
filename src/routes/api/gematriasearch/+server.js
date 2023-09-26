import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { searchGematria } from '$lib/js/gematria.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const text = url.searchParams.get('text');
	const value = url.searchParams.get('value');

	try {
		return createResponse(
			searchGematria({
				text: text || undefined,
				value: value ? Number(value) : undefined,
			})
		);
	} catch (error) {
		return createErrorResponse(error);
	}
}
