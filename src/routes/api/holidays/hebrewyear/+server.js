import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { getHolidays } from '$lib/js/holidays';
import { HDate } from '@hebcal/core';
import { readTypes } from '../utils';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const hDateToday = new HDate();
	const hebrewYear = Number(url.searchParams.get('hebrewYear') || hDateToday.getFullYear());
	const types = readTypes(url);

	try {
		return createResponse(getHolidays({ hebrewYear, types }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
