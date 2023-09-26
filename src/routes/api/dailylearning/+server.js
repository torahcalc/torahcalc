import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { calculateDailyLearning } from '$lib/js/dailylearning';
import dayjs from 'dayjs';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const date = url.searchParams.get('date') || dayjs().format('YYYY-MM-DD');

	try {
		return createResponse(calculateDailyLearning(date));
	} catch (error) {
		return createErrorResponse(error);
	}
}
