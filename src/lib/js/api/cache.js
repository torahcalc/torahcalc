import { building } from '$app/environment';
import { shouldBypassCache } from './cache-request.js';

const LONG_TTL = 7 * 24 * 60 * 60; // 7 days for long-lived cache
const SHORT_TTL = 60 * 60; // 1 hour for short-lived cache (e.g., coin conversions)
const INPUT_TTL = 60; // 1 minute for free-text input caching which may include relative times

/**
 * @typedef {object} CachePolicy
 * @property {string[]} [dateParameters] Parameters that must all be supplied for long-lived calendar caching.
 * @property {boolean} [utcMidnight] Whether implicit dates expire at UTC rather than server midnight.
 * @property {number} [maxAge] Short-lived TTL in seconds, capped at midnight.
 * @property {number} [coinMaxAge] TTL in seconds for type=coins, capped at midnight.
 */

/** @type {CachePolicy} */
const STATIC_POLICY = {};

/** @type {CachePolicy} */
const UNIT_CONVERSION_POLICY = { coinMaxAge: SHORT_TTL };

/** @type {Record<string, CachePolicy>} */
const CACHE_POLICIES = {
	'/api/dailylearning': { dateParameters: ['date'] },
	'/api/dateconverter/gregtoheb': { dateParameters: ['year', 'month', 'day'] },
	'/api/dateconverter/hebtogreg': { dateParameters: ['year', 'month', 'day'] },
	'/api/gematria': STATIC_POLICY,
	'/api/gematriamatch': STATIC_POLICY,
	'/api/gematriasearch': STATIC_POLICY,
	'/api/hachama': { dateParameters: ['year'] },
	'/api/holidays/gregorianyear': { dateParameters: ['gregorianYear'] },
	'/api/holidays/hebrewyear': { dateParameters: ['hebrewYear'] },
	'/api/holidays/startdate': { dateParameters: ['hebrewYear', 'hebrewMonth', 'hebrewDay'] },
	'/api/input': { maxAge: INPUT_TTL },
	'/api/leapyears/gregorian': { dateParameters: ['year'] },
	'/api/leapyears/hebrew': { dateParameters: ['year'] },
	'/api/molad': { dateParameters: ['year', 'month'] },
	'/api/omer/gregorian': { dateParameters: ['date'] },
	'/api/omer/hebrew': { dateParameters: ['year', 'month', 'day'] },
	'/api/omer/year': { dateParameters: ['year'] },
	'/api/parsha': { dateParameters: ['date'] },
	'/api/shmita/check': { dateParameters: ['year'] },
	'/api/shmita/next': { dateParameters: ['year'] },
	'/api/shmita/previous': { dateParameters: ['year'] },
	'/api/unitcharts': UNIT_CONVERSION_POLICY,
	'/api/unitconverter': UNIT_CONVERSION_POLICY,
	'/api/zmanim': { dateParameters: ['date'], utcMidnight: true },
	'/api/zmanimchart': { dateParameters: ['year'] },
	'/api/zodiac': { dateParameters: ['date'] },
};

/**
 * @param {URL} url
 * @param {Date} [now]
 * @returns {number | null}
 */
export function getApiCacheTtl(url, now = new Date()) {
	const policy = CACHE_POLICIES[url.pathname];
	if (!policy) return null;
	const midnight = new Date(now);
	// Calculate the next midnight based on the policy (UTC or local)
	if (policy.utcMidnight) {
		midnight.setUTCHours(24, 0, 0, 0);
	} else {
		midnight.setHours(24, 0, 0, 0);
	}
	// Calculate the TTL in seconds until the next midnight
	const dailyTtl = Math.max(1, Math.floor((midnight.getTime() - now.getTime()) / 1000));
	// Apply coin-specific max age if applicable
	if (policy.coinMaxAge !== undefined && url.searchParams.get('type') === 'coins') {
		return Math.min(policy.coinMaxAge, dailyTtl);
	}
	// Apply general max age if applicable
	if (policy.maxAge !== undefined) {
		return Math.min(policy.maxAge, dailyTtl);
	}
	// If it is a date-based endpoint, use the daily TTL for incomplete date parameters, otherwise use the long TTL
	return policy.dateParameters?.some((parameter) => !url.searchParams.get(parameter)?.trim()) ? dailyTtl : LONG_TTL;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handleApiCache({ event, resolve }) {
	if (building) return resolve(event);
	const ttl = getApiCacheTtl(event.url);
	if (ttl === null) return resolve(event);
	const expiresAt = Date.now() + (ttl ?? 0) * 1000;
	const request = event.request;
	const resolved = await resolve(event);
	const maxAge = Math.floor((expiresAt - Date.now()) / 1000);
	if (
		maxAge <= 0 ||
		shouldBypassCache(request) ||
		resolved.status !== 200 ||
		resolved.headers.has('set-cookie') ||
		resolved.headers.has('vary') ||
		/\b(private|no-store|no-cache)\b/i.test(resolved.headers.get('cache-control') || '')
	) {
		const response = new Response(resolved.body, resolved);
		response.headers.set('Cache-Control', 'no-store');
		return response;
	}

	const response = new Response(resolved.body, resolved);
	response.headers.set('Cache-Control', `public, max-age=${maxAge}`);
	response.headers.set('Expires', new Date(expiresAt).toUTCString());
	return response;
}
