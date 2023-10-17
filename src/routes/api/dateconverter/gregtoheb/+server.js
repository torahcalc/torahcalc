import { isTrue } from '$lib/js/api/helper';
import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { gregorianToHebrew } from '$lib/js/dateconverter';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function GET({ url }) {
	const today = new Date();
	const year = Number(url.searchParams.get('year') || today.getFullYear());
	const month = Number(url.searchParams.get('month') || today.getMonth() + 1);
	const day = Number(url.searchParams.get('day') || today.getDate());
	const afterSunset = isTrue(url.searchParams.get('afterSunset'));

	try {
		return createResponse(gregorianToHebrew({ year, month, day, afterSunset }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
