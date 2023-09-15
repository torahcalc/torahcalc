import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { convertUnits } from '$lib/js/unitconverter.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const type = url.searchParams.get('type');
	const unitFromId = url.searchParams.get('from');
	const unitToId = url.searchParams.get('to');
	const amount = Number(url.searchParams.get('amount'));
	const opinionId = url.searchParams.get('opinion') || undefined;

	try {
		if (type === null) throw new Error("Missing 'type' parameter");
		if (unitFromId === null) throw new Error("Missing 'from' parameter");
		if (unitToId === null) throw new Error("Missing 'to' parameter");
		if (amount === null) throw new Error("Missing 'amount' parameter");
		if (isNaN(amount)) throw new Error("Invalid 'amount' parameter");
		return createResponse(await convertUnits({ type, unitFromId, unitToId, amount, opinionId }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
