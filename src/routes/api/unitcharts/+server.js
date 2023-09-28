import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { convertUnitsMulti } from '$lib/js/unitconverter.js';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const type = url.searchParams.get('type');
	const unitFromId = url.searchParams.get('from');
	const amount = Number(url.searchParams.get('amount') || 1);
	const opinionId = url.searchParams.get('opinion') || undefined;
	const unitOpinionIds = url.searchParams.getAll('unitOpinion') || [];

	try {
		if (type === null) throw new Error("Missing 'type' parameter");
		if (unitFromId === null) throw new Error("Missing 'from' parameter");
		if (isNaN(amount)) throw new Error("Invalid 'amount' parameter");
		return createResponse(await convertUnitsMulti({ type, unitFromId, amount, opinionId, unitOpinionIds }));
	} catch (error) {
		return createErrorResponse(error);
	}
}
