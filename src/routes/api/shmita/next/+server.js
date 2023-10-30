import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { nextShmita } from '$lib/js/shmita.js';
import { HDate } from '@hebcal/core';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const year = Number(url.searchParams.get('year') || new HDate().getFullYear());

	if (isNaN(year)) {
		return createErrorResponse('Invalid year.');
	}

	try {
		return createResponse({ hebrewYear: nextShmita(year, false) });
	} catch (error) {
		return createErrorResponse(error);
	}
}
