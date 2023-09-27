import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { calculateOmerDate } from '$lib/js/omer';
import dayjs from 'dayjs';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const date = url.searchParams.get('date') ?? dayjs().format('YYYY-MM-DD');

	try {
		return createResponse(calculateOmerDate(date));
	} catch (error) {
		return createErrorResponse(error);
	}
}
