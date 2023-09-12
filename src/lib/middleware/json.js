import { json } from '@sveltejs/kit';

/**
 * Format a response as JSON.
 * @param {object} data - The data to return in the response.
 * @param {number} [status=200] - The HTTP status code.
 * @returns {Response}
 */
export function createResponse(data, status = 200) {
	return json(
		{
			success: status >= 200 && status < 300,
			data
		},
		{
			status
		}
	);
}

/**
 * Format an error response as JSON.
 * @param {any} error
 * @param {number} [status=400]
 * @returns {Response}
 */
export function createErrorResponse(error, status = 400) {
	return createResponse(
		{
			error: error instanceof Error ? error.message : String(error)
		},
		status
	);
}
