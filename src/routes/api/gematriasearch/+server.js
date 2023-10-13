import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { calculateGematria, searchGematria } from '$lib/js/gematria.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const text = url.searchParams.get('text');
	let value = Number(url.searchParams.get('value') || 0);

	try {
		if (text !== null) {
			if (value !== null) {
				throw new Error("Unexpected 'text' and 'value' parameters. Only one of these parameters should be provided.");
			}
			value = calculateGematria({ text }).standard;
		}
		return createResponse(searchGematria(Number(value)));
	} catch (error) {
		return createErrorResponse(error);
	}
}
