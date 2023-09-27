import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { getHolidays } from '$lib/js/holidays';
import { readTypes } from '../utils';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const gregorianYear = Number(url.searchParams.get('gregorianYear') || new Date().getFullYear());
	const types = readTypes(url);

	try {
		return createResponse(getHolidays({ gregorianYear, types }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
