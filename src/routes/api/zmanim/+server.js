import * as env from '$env/static/private';
import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { geocodeAddress, getTimezone } from '$lib/js/utils';
import { calculateZmanim } from '$lib/js/zmanim';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
	let latitude = Number(url.searchParams.get('latitude') || Number.NaN);
	let longitude = Number(url.searchParams.get('longitude') || Number.NaN);
	let timezone = url.searchParams.get('timezone') || undefined;
	let location = url.searchParams.get('location') || '';
	const candleLightingMins = Number(url.searchParams.get('candleLightingMinutes') || 0);

	try {
		if ((Number.isNaN(latitude) || Number.isNaN(longitude)) && location !== '') {
			const geocoded = await geocodeAddress(location, env.GOOGLE_MAPS_API_KEY);
			latitude = geocoded.lat;
			longitude = geocoded.lng;
			location = geocoded.formattedAddress;
		}
		if (Number.isNaN(latitude)) throw new Error("Missing or invalid 'latitude' parameter");
		if (Number.isNaN(longitude)) throw new Error("Missing or invalid 'longitude' parameter");
		if (!timezone) {
			timezone = await getTimezone(latitude, longitude, env.GOOGLE_MAPS_API_KEY, env.GEONAMES_USERNAME);
		}
		return createResponse(await calculateZmanim({ date, latitude, longitude, timezone, location, candleLightingMins }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
