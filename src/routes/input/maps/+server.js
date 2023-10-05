import * as env from '$env/static/private';
import { createErrorResponse } from '$lib/js/api/response.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const location = url.searchParams.get('location');

    if (!location) {
        return createErrorResponse(new Error('Missing location parameter'));
    }

	const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=13&size=400x200&maptype=roadmap&markers=${location}&key=${env.GOOGLE_MAPS_API_KEY}`;
	const blob = await fetch(mapUrl).then((r) => r.blob());

	try {
		const headers = new Headers();
		headers.set('content-type', 'image/png');
		headers.set('cache-control', 'public, max-age=31536000, s-maxage=31536000');
		headers.set('content-length', blob.size.toString());
		// return image/png response
		return new Response(blob, {
			headers,
		});
	} catch (error) {
		return createErrorResponse(error);
	}
}
