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
			data,
		},
		{
			status,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Content-Type': 'application/json',
			},
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
			error: error instanceof Error ? error.message : String(error),
		},
		status
	);
}

/**
 * Format a response as HTML.
 * @param {string} html - The HTML content to return in the response.
 * @param {number} [status=200] - The HTTP status code.
 * @returns {Response}
 */
export function createHtmlResponse(html, status = 200) {
	return new Response(html, {
		status,
		headers: {
			'Content-Type': 'text/html',
		},
	});
}

/**
 * Format an error response as HTML.
 * @param {string} error
 * @param {number} [status=400]
 * @returns {Response}
 */
export function createHtmlErrorResponse(error, status = 400) {
	return createHtmlResponse(
		`<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<title>Error</title>
			</head>
			<body>
				<h1>Error</h1>
				<p>${error}</p>
			</body>
			</html>`,
		status
	);
}
