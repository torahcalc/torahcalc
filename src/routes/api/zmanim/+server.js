import * as env from '$env/static/private';
import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { geocodeAddress, getTimezone } from '$lib/js/utils';
import { calculateZmanim } from '$lib/js/zmanim';
import dayjs from 'dayjs';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const date = url.searchParams.get('date') || dayjs().format('YYYY-MM-DD');
	let latitude = Number(url.searchParams.get('latitude') || NaN);
	let longitude = Number(url.searchParams.get('longitude') || NaN);
	let timezone = url.searchParams.get('timezone') || undefined;
	let location = url.searchParams.get('location') || '';

	try {
		if (isNaN(latitude) || (isNaN(longitude) && location !== '')) {
			const geocoded = await geocodeAddress(location, env.GOOGLE_MAPS_API_KEY);
			latitude = geocoded.lat;
			longitude = geocoded.lng;
			location = geocoded.formattedAddress;
		}
		if (isNaN(latitude)) throw new Error("Missing or invalid 'latitude' parameter");
		if (isNaN(longitude)) throw new Error("Missing or invalid 'longitude' parameter");
		if (!timezone) {
			timezone = await getTimezone(latitude, longitude, env.GOOGLE_MAPS_API_KEY);
		}
		return createResponse(await calculateZmanim({ date, latitude, longitude, timezone, location }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
