import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { calculateOmerHebrew } from '$lib/js/omer';
import { HDate } from '@hebcal/core';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const hDateToday = new HDate();
	const year = Number(url.searchParams.get('year') ?? hDateToday.getFullYear());
	const month = Number(url.searchParams.get('month') ?? hDateToday.getMonth());
	const day = Number(url.searchParams.get('day') ?? hDateToday.getDate());

	try {
		if (isNaN(year)) {
			throw new Error('Invalid Hebrew year');
		} else if (isNaN(month) || month < 1 || month > 13) {
			throw new Error('Invalid Hebrew month');
		} else if (isNaN(day) || day < 1 || day > 30) {
			throw new Error('Invalid Hebrew day');
		}
		return createResponse(calculateOmerHebrew(year, month, day));
	} catch (error) {
		return createErrorResponse(error);
	}
}
