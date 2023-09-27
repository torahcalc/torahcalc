import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { calculateOmerYear } from '$lib/js/omer';
import dayjs from 'dayjs';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const year = Number(url.searchParams.get('year') || dayjs().year());

	if (isNaN(year) || year === 0) {
		throw new Error('Invalid Gregorian year');
	}

	try {
		return createResponse(calculateOmerYear(year));
	} catch (error) {
		return createErrorResponse(error);
	}
}
