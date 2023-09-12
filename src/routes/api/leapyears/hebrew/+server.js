import { isHebrewLeapYear } from '$lib/js/leapyears.js';
import { createResponse, createErrorResponse } from '$lib/middleware/json';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function GET({ url }) {
	// TODO: Calculate the actual Hebrew year with a date converter
	const year = Number(url.searchParams.get('year') || new Date().getFullYear() + 3760);

	try {
		return createResponse(isHebrewLeapYear({ year }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
