import dayjs from 'dayjs';
import { gregorianToHebrew } from './dateconverter';
import { HDate } from '@hebcal/core';
import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

/**
 * Format a date as Mon, January 11, 2023. This method is modified to work with 2-digit years and years before year 1.
 *
 * @param {number} year - The year to format.
 * @param {number} month - The month to format (1-12).
 * @param {number} day - The day to format (1-31).
 * @returns {string} The formatted date.
 */
export const formatDate = (year, month, day) => {
	const dateToFormat = new Date(year, month - 1, day);
	dateToFormat.setFullYear(year > 0 ? year : year + 1); // fix for 2-digit years and years before year 1
	let formatted = dayjs(dateToFormat).format('ddd, MMMM D, YYYY');
	if (year === 0) {
		throw new Error('Gregorian year 0 does not exist.');
	}
	if (isNaN(Math.abs(year))) {
		throw new Error('Invalid Gregorian date.');
	}
	// pad year with zeros to 4 digits and replace year with the actual year
	const formattedYear = (year < 0 ? '-' : '') + Math.abs(year).toString().padStart(4, '0');
	formatted = formatted.replace(/[\d-]+$/, formattedYear);
	return formatted;
};

/**
 * Override for formatDate that takes a Date object instead of year, month, and day.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date.
 */
export const formatDateObject = (date) => {
	return formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

/**
 * Convert a JavaScript Date object to an HDate object.
 * @param {Date} date - The date to convert.
 * @returns {HDate} The Hebrew date.
 */
export const dateToHDate = (date) => {
	const hebrewDate = gregorianToHebrew({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
	const hDate = new HDate(hebrewDate.day, hebrewDate.month, hebrewDate.year);
	return hDate;
};

/**
 * Returns true if daylight saving time is in effect for a given date
 * @param {Date} date - The date to check
 * @returns {boolean} True if daylight saving time is in effect for the given date
 */
export function isDST(date) {
	const jan = new Date(date.getFullYear(), 0, 1);
	const jul = new Date(date.getFullYear(), 6, 1);
	return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) == date.getTimezoneOffset();
}

/**
 * Try to call a given function with the given arguments, and return the result. If the function throws an error, return the default value.
 *
 * @template ReturnType, DefaultType
 * @param {() => ReturnType} func - The function to call.
 * @param {DefaultType} defaultValue - The default value to return if the function throws an error.
 * @returns {ReturnType|DefaultType} The result of the function call or the default value.
 *
 * @example
 * const result = tryOrDefault(() => JSON.parse('invalid json'), {});
 * // result = {}
 */
export function tryOrDefault(func, defaultValue) {
	try {
		return func();
	} catch (error) {
		return defaultValue;
	}
}

/**
 * Get the last Saturday before the given date.
 * @param {Date} date - The date to get the last Saturday before.
 * @returns {Date} The last Saturday before the given date.
 */
export function getLastSaturday(date) {
	const resultDate = new Date(date);
	resultDate.setDate(date.getDate() - date.getDay() - 1);
	return resultDate;
}

/**
 * Format a number as a string with thin spaces for commas, maximum precision, and no trailing zeros.
 *
 * @param {number} number - The number to format.
 * @param {number} [precision=8] - The maximum number of digits after the decimal point.
 * @returns {string} The formatted number.
 */
export function formatNumber(number, precision = 8) {
	// set precision and add commas
	let localeNum = number.toLocaleString(undefined, { maximumFractionDigits: precision });
	// remove trailing zeros if there is a decimal point
	localeNum = localeNum.includes('.') ? localeNum.replace(/\.?0+$/, '') : localeNum;
	// replace commas with thin spaces
	localeNum = localeNum.replace(/,/g, '\u2009');
	// return the formatted number
	return localeNum;
}

/**
 * Format number and place it in a span with the class 'number'.
 *
 * @param {number} number - The number to format.
 * @param {number} [precision=8] - The maximum number of digits after the decimal point.
 * @returns {string} The formatted number.
 */
export function formatNumberHTML(number, precision = 8) {
	return `<span class="number">${formatNumber(number, precision)}</span>`;
}

/**
 * Transform a string to Proper Case
 * @param {string} str - the string to transform
 */
export function properCase(str) {
	return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

/** @type {Object<string, { lat: number, lng: number, formattedAddress: string }>} */
const CACHED_ADDRESS_LOCATIONS = {
	'new york': { lat: 40.7127753, lng: -74.0059728, formattedAddress: 'New York, NY, USA' }, // New York for testing
};

/**
 * Geocode a location using the Google Maps Geocoding API.
 *
 * @param {string} address - The address to geocode.
 * @returns {Promise<{ lat: number, lng: number, formattedAddress: string }>} The geocoded location.
 * @throws {Error} If the address is not found.
 */
export async function geocodeAddress(address) {
	if (address in CACHED_ADDRESS_LOCATIONS) {
		return CACHED_ADDRESS_LOCATIONS[address];
	}
	const apiKey = typeof process !== 'undefined' ? process.env.PUBLIC_GOOGLE_MAPS_API_KEY : PUBLIC_GOOGLE_MAPS_API_KEY;
	const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
	const json = await response.json();
	if (json.status !== 'OK') {
		throw new Error(`Could not geocode address: ${json.status}`);
	}
	const result = json.results[0];
	return {
		lat: result.geometry.location.lat,
		lng: result.geometry.location.lng,
		formattedAddress: result.formatted_address,
	};
}

/** @type {Object<string, string>} */
const CACHED_TIMEZONE_NAMES = {
	'40.7127753,-74.0059728': 'America/New_York', // New York for testing
};

/**
 * Return the timezone name for a given latitude and longitude
 *
 * @param {number} latitude - The latitude of the location
 * @param {number} longitude - The longitude of the location
 * @returns {Promise<string>} - The timezone name
 */
export async function getTimezone(latitude, longitude) {
	const location = `${latitude},${longitude}`;
	if (location in CACHED_TIMEZONE_NAMES) {
		return CACHED_TIMEZONE_NAMES[location];
	}
	const apiKey = typeof process !== 'undefined' ? process.env.PUBLIC_GOOGLE_MAPS_API_KEY : PUBLIC_GOOGLE_MAPS_API_KEY;
	const response = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=1458000000&key=${apiKey}`);
	const json = await response.json();
	CACHED_TIMEZONE_NAMES[location] = json.timeZoneId;
	if (json.status !== 'OK') {
		throw new Error('Could not get timezone for the provided location.');
	}
	return json.timeZoneId;
}
