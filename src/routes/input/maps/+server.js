import * as env from '$env/static/private';
import { createErrorResponse } from '$lib/js/api/response.js';
import { geocodeAddress } from '$lib/js/utils.js';

/**
 * @param {string} location
 * @returns {Promise<Response | null>}
 */
async function getGoogleMapImage(location) {
	// Try Google Maps first
	try {
		const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=13&size=400x200&maptype=roadmap&markers=${location}&key=${env.GOOGLE_MAPS_API_KEY}`;
		const response = await fetch(mapUrl);

		if (response.ok) {
			const blob = await response.blob();
			const headers = new Headers();
			headers.set('content-type', 'image/png');
			headers.set('cache-control', 'public, max-age=31536000, s-maxage=31536000');
			headers.set('content-length', blob.size.toString());
			return new Response(blob, { headers });
		}
		// eslint-disable-next-line no-unused-vars
	} catch (error) {
		// Fall through to error
	}
	return null;
}

/**
 * @param {string} location
 * @returns {Promise<Response | null>}
 */
async function getMapboxImage(location) {
	if (!env.MAPBOX_ACCESS_TOKEN) return null;

	try {
		// Geocode the location to get coordinates if needed
		let lat, lng;
		// Check if location is already in lat,lng format
		const coordRegex = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
		const coordMatch = coordRegex.exec(location);
		if (coordMatch) {
			lat = coordMatch[1];
			lng = coordMatch[2];
		} else {
			// Geocode the address
			const geocoded = await geocodeAddress(location, env.GOOGLE_MAPS_API_KEY);
			lat = geocoded.lat;
			lng = geocoded.lng;
		}

		// Build Mapbox Static Images API URL with marker
		const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+000(${lng},${lat})/${lng},${lat},13/400x200?access_token=${env.MAPBOX_ACCESS_TOKEN}`;
		const response = await fetch(mapboxUrl);

		if (response.ok) {
			const blob = await response.blob();
			const headers = new Headers();
			headers.set('content-type', 'image/png');
			headers.set('cache-control', 'public, max-age=31536000, s-maxage=31536000');
			headers.set('content-length', blob.size.toString());
			return new Response(blob, { headers });
		}
		// eslint-disable-next-line no-unused-vars
	} catch (error) {
		// Fall through to error
	}
	return null;
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const location = url.searchParams.get('location');

	if (!location) {
		return createErrorResponse(new Error('Missing location parameter'));
	}

	const mapBoxResponse = await getMapboxImage(location);
	if (mapBoxResponse) return mapBoxResponse;

	const googleMapResponse = await getGoogleMapImage(location);
	if (googleMapResponse) return googleMapResponse;

	return createErrorResponse(new Error('Could not generate map image from available providers'));
}
