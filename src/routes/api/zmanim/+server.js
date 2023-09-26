import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { calculateZmanim } from '$lib/js/zmanim';
import dayjs from 'dayjs';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const date = url.searchParams.get('date') || dayjs().format('YYYY-MM-DD');
	const latitude = Number(url.searchParams.get('latitude') || NaN);
	const longitude = Number(url.searchParams.get('longitude') || NaN);
	const timezoneName = url.searchParams.get('timezone') || undefined;

	try {
		if (isNaN(latitude)) throw new Error("Missing or invalid 'latitude' parameter");
		if (isNaN(longitude)) throw new Error("Missing or invalid 'longitude' parameter");
		return createResponse(await calculateZmanim({ date, latitude, longitude, timezoneName }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
