import { isTrue } from '$lib/js/api/helper';
import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { hebrewToGregorian } from '$lib/js/dateconverter';
import { HDate } from '@hebcal/core';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function GET({ url }) {
	const hDateToday = new HDate();
	const year = Number(url.searchParams.get('year') || hDateToday.getFullYear());
	const month = Number(url.searchParams.get('month') || hDateToday.getMonth());
	const day = Number(url.searchParams.get('day') || hDateToday.getDate());
	const afterSunset = isTrue(url.searchParams.get('afterSunset'));

	try {
		return createResponse(hebrewToGregorian({ year, month, day, afterSunset }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
