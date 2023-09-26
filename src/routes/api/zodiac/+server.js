import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { calculateZodiac } from '$lib/js/zodiac';
import dayjs from 'dayjs';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const date = url.searchParams.get('date') || dayjs().format('YYYY-MM-DD');

	try {
		return createResponse(calculateZodiac(date));
	} catch (error) {
		return createErrorResponse(error);
	}
}
