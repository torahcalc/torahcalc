import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { isShmitaYear } from '$lib/js/shmita';
import { HDate } from '@hebcal/core';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function GET({ url }) {
	const year = Number(url.searchParams.get('year') || new HDate().getFullYear());

	try {
		return createResponse({ isShmitaYear: isShmitaYear(year) });
	} catch (error) {
		return createErrorResponse(error);
	}
}
