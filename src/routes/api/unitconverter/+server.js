import { createErrorResponse, createResponse } from '$lib/js/api/response.js';
import { convertUnits } from '$lib/js/unitconverter.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const type = url.searchParams.get('type');
	const unitFromId = url.searchParams.get('from');
	const unitToId = url.searchParams.get('to');
	const amount = Number(url.searchParams.get('amount') || 1);
	const opinionId = url.searchParams.get('opinion') || undefined;
	const unitOpinionIds = url.searchParams.getAll('unitOpinion') || [];

	try {
		if (type === null) throw new Error("Missing 'type' parameter");
		if (unitFromId === null) throw new Error("Missing 'from' parameter");
		if (unitToId === null) throw new Error("Missing 'to' parameter");
		if (isNaN(amount)) throw new Error("Invalid 'amount' parameter");
		return createResponse(await convertUnits({ type, unitFromId, unitToId, amount, opinionId, unitOpinionIds }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
