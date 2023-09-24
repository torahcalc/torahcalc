import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { calculateGematria, LETTER_KEYS } from '$lib/js/gematria.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const text = url.searchParams.get('text');
	if (!text) {
		return createErrorResponse('Missing text query parameter');
	}

	/** @type {{ [key: string]: number }} */
	const miluiInput = {};
	for (const key in Object.keys(LETTER_KEYS)) {
		const value = url.searchParams.get(key);
		if (value && !isNaN(Number(value))) {
			miluiInput[key] = Number(value);
		}
	}

	try {
		return createResponse(await calculateGematria({ text, miluiInput }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
