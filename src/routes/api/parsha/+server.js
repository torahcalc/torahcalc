import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { calculateParsha } from '$lib/js/parsha';
import dayjs from 'dayjs';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const date = url.searchParams.get('date') || dayjs().format('YYYY-MM-DD');
	const ilParam = (url.searchParams.get('il') || '').toLowerCase();
	const location = (url.searchParams.get('location') || '').toLowerCase();
	const il = ilParam === 'true' || ilParam === '1' || location === 'israel' || location === 'il';

	try {
		return createResponse(calculateParsha(date, il));
	} catch (error) {
		return createErrorResponse(error);
	}
}
