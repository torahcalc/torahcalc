import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { calculateMolad } from '$lib/js/molad';
import { HDate } from '@hebcal/core';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const hDateToday = new HDate();
	const year = Number(url.searchParams.get('year') || hDateToday.getFullYear());
	const month = Number(url.searchParams.get('month') || hDateToday.getMonth());

	try {
		return createResponse(calculateMolad(year, month));
	} catch (error) {
		return createErrorResponse(error);
	}
}
