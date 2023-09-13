import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { isHebrewLeapYear } from '$lib/js/leapyears.js';
import { HDate } from '@hebcal/core';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function GET({ url }) {
	const year = Number(url.searchParams.get('year') || new HDate().getFullYear());

	try {
		return createResponse(isHebrewLeapYear({ year }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
