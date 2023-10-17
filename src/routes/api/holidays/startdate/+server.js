import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { getHolidays } from '$lib/js/holidays';
import { HDate } from '@hebcal/core';
import { readTypes } from '../utils';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const hDateToday = new HDate();
	const hebrewYear = Number(url.searchParams.get('hebrewYear') || hDateToday.getFullYear());
	const hebrewMonth = Number(url.searchParams.get('hebrewMonth') || hDateToday.getMonth());
	const hebrewDay = Number(url.searchParams.get('hebrewDay') || hDateToday.getDate());
	const types = readTypes(url);

	try {
		const startDate = new HDate(hebrewDay, hebrewMonth, hebrewYear);
		return createResponse(getHolidays({ startDate, types }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
