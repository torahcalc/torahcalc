import { HDate } from '@hebcal/core';
import dayjs from 'dayjs';
import xss from 'xss';
import { gregorianToHebrew } from './dateconverter';

/**
 * Format a date as Mon, January 11, 2023. This method is modified to work with 2-digit years and years before year 1.
 *
 * @param {number} year - The year to format.
 * @param {number} month - The month to format (1-12).
 * @param {number} day - The day to format (1-31).
 * @param {string} [format='ddd, MMMM D, YYYY'] - The format string (default is 'ddd, MMMM D, YYYY').
 * @returns {string} The formatted date.
 */
export const formatDate = (year, month, day, format = 'ddd, MMMM D, YYYY') => {
	const dateToFormat = new Date(year, month - 1, day);
	dateToFormat.setFullYear(year > 0 ? year : year + 1); // fix for 2-digit years and years before year 1
	let formatted = dayjs(dateToFormat).format(format);
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
 * Returns the next Hebrew month
 * @param {HDate} [hDate] - The Hebrew date to get the next month from or today if not provided
 * @returns {{month: number, year: number}}
 */
export function getNextHebrewMonth(hDate) {
	hDate = hDate === undefined ? new HDate() : hDate;
	// Month 1 = Nissan, 7 = Tishrei, 12 = Adar I, 13 = Adar II (leap year)
	let nextHebrewMonth = hDate.getMonth() + 1;
	// reset to Nissan if at the end of the year, skip Adar II if it's not a leap year
	if (nextHebrewMonth === 14 || (nextHebrewMonth === 13 && !hDate.isLeapYear())) {
		nextHebrewMonth = 1;
	}
	return {
		month: nextHebrewMonth,
		year: nextHebrewMonth === 7 ? hDate.getFullYear() + 1 : hDate.getFullYear(),
	};
}

/**
 * Returns the previous Hebrew month
 * @param {HDate} [hDate] - The Hebrew date to get the previous month from or today if not provided
 * @returns {{month: number, year: number}}
 */
export function getPrevHebrewMonth(hDate) {
	hDate = hDate === undefined ? new HDate() : hDate;
	// Month 1 = Nissan, 7 = Tishrei, 12 = Adar I, 13 = Adar II (leap year)
	let prevHebrewMonth = hDate.getMonth() - 1;
	// reset to Adar if at the beginning of the year, Adar II if it's a leap year
	if (prevHebrewMonth === 0) {
		prevHebrewMonth = hDate.isLeapYear() ? 13 : 12;
	}
	return {
		month: prevHebrewMonth,
		year: prevHebrewMonth === 6 ? hDate.getFullYear() - 1 : hDate.getFullYear(),
	};
}

/**
 * Returns the current Hebrew month
 * @returns {{month: number, year: number}}
 */
export function getCurrentHebrewMonth() {
	const today = new HDate();
	return {
		month: today.getMonth(),
		year: today.getFullYear(),
	};
}

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
 * @param {number} [precision=4] - The maximum number of digits after the decimal point.
 * @param {boolean} [makeNonZero=true] - Whether to increase precision until the number is non-zero.
 * @param {string} [comma='\u2009'] - The character to use for commas (defaults to a thin space).
 * @returns {string} The formatted number.
 */
export function formatNumber(number, precision = 4, makeNonZero = true, comma = '\u2009') {
	// set precision and add commas
	let localeNum = number.toLocaleString('fullwide', { maximumFractionDigits: precision });
	// increase precision until the number is non-zero
	if (number !== 0 && makeNonZero) {
		for (let i = precision; i < 20; i++) {
			if (localeNum !== '0') {
				break;
			}
			localeNum = number.toLocaleString('fullwide', { maximumFractionDigits: i });
		}
	}
	// remove trailing zeros if there is a decimal point
	localeNum = localeNum.includes('.') ? localeNum.replace(/\.?0+$/, '') : localeNum;
	// replace commas with thin spaces
	localeNum = localeNum.replace(/,/g, comma);
	// return the formatted number
	return localeNum;
}

/**
 * Format text or a number and place it in a span with the class 'number'.
 *
 * @param {number|string} text - The text or number to format.
 * @param {number} [precision=4] - The maximum number of digits after the decimal point, use -1 to disable formatting as a number.
 * @param {boolean} [makeNonZero=true] - Whether to increase precision until the number is non-zero.
 * @returns {string} The formatted number.
 */
export function formatNumberHTML(text, precision = 4, makeNonZero = true) {
	if (!isNaN(Number(text)) && precision >= 0) {
		text = formatNumber(Number(text), precision, makeNonZero);
	}
	return `<span class="number">${sanitize(text.toString())}</span>`;
}

/**
 * Sanitize a string for use in HTML.
 *
 * @param {string} string - The string to sanitize.
 * @returns {string} The sanitized string.
 */
export function sanitize(string) {
	const options = {
		whiteList: {
			a: ['href', 'target', 'rel'],
			br: [],
			span: ['class'],
			b: ['class'],
			div: ['class'],
			img: ['src', 'alt', 'class'],
			svg: ['xmlns', 'viewBox', 'fill', 'stroke', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'class', 'height', 'width'],
			path: ['d'],
		},
	};
	return xss(string, options);
}

/**
 * Transform a string to Proper Case
 * @param {string} str - the string to transform
 */
export function properCase(str) {
	// list of words that should not be modified
	const WHITELIST = ['US'];
	return str.replace(/(\w)(\S*)/g, function (txt, first, rest) {
		if (WHITELIST.includes(txt)) {
			return txt;
		}
		return first.toUpperCase() + rest.toLowerCase();
	});
}

/** @type {Object<string, { lat: number, lng: number, formattedAddress: string }>} */
const CACHED_ADDRESS_LOCATIONS = {
	'new york': { lat: 40.7127753, lng: -74.0059728, formattedAddress: 'New York, NY, USA' }, // New York for testing
	denver: { lat: 39.7392358, lng: -104.990251, formattedAddress: 'Denver, CO, USA' }, // Denver for testing
	'los angeles': { lat: 34.0549076, lng: -118.242643, formattedAddress: 'Los Angeles, CA, USA' }, // Los Angeles for testing
	jerusalem: { lat: 31.768319, lng: 35.21371, formattedAddress: 'Jerusalem, Israel' }, // Jerusalem for testing
};

/**
 * Geocode a location using the Google Maps Geocoding API.
 *
 * @param {string} address - The address to geocode.
 * @param {string} apiKey - The Google Maps API key.
 * @returns {Promise<{ lat: number, lng: number, formattedAddress: string }>} The geocoded location.
 * @throws {Error} If the address is not found.
 */
export async function geocodeAddress(address, apiKey) {
	if (address in CACHED_ADDRESS_LOCATIONS) {
		return CACHED_ADDRESS_LOCATIONS[address];
	}
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
	'40.7127753,-74.0059728': 'America/New_York', // New York example for testing
	'39.7392358,-104.990251': 'America/Denver', // Denver example
	'34.0549076,-118.242643': 'America/Los_Angeles', // Los Angeles example
	'31.776,35.23': 'Asia/Jerusalem', // Jerusalem example lat/lon
	'31.768319,35.21371': 'Asia/Jerusalem', // Jerusalem example
};

/**
 * Return the timezone name for a given latitude and longitude
 *
 * @param {number} latitude - The latitude of the location
 * @param {number} longitude - The longitude of the location
 * @param {string} apiKey - The Google Maps API key
 * @returns {Promise<string>} - The timezone name
 */
export async function getTimezone(latitude, longitude, apiKey) {
	const location = `${latitude},${longitude}`;
	if (location in CACHED_TIMEZONE_NAMES) {
		return CACHED_TIMEZONE_NAMES[location];
	}
	const response = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=1458000000&key=${apiKey}`);
	const json = await response.json();
	CACHED_TIMEZONE_NAMES[location] = json.timeZoneId;
	if (json.status !== 'OK' || !json.timeZoneId) {
		throw new Error('Could not get timezone for the provided location.');
	}
	return json.timeZoneId;
}

/**
 * @typedef {Object} TableBuilderOptions
 * @property {Array<{ key: string, display: string }|string>} [headers] - The headers for the table (e.g. [{ key: 'name', display: 'Name' }, { key: 'age', display: 'Age' }] or ['Name', 'Age']).
 * @property {string} [id] - The ID of the table.
 * @property {string} [class] - The class of the table.
 * @property {Object} [attributes] - Additional attributes to add to the table.
 * @property {string} [caption] - The caption for the table.
 * @property {Array<string|undefined>} [thStyles] - The styles for the table headers.
 * @property {boolean} [html=false] - Whether to treat values as HTML instead of sanitizing them.
 */

/**
 * Convert a list of objects to an HTML table.
 *
 * @param {{ [key: string]: any }[]} data - The data to convert to a table (e.g. [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]).
 * @param {TableBuilderOptions} options - Options for the table.
 */
export function dataToHtmlTable(data, options) {
	let table = '<div class="table-responsive"><table';
	if (options.id) {
		table += ` id="${options.id}"`;
	}
	if (options.class) {
		table += ` class="${options.class}"`;
	}
	if (options.attributes) {
		for (const [key, value] of Object.entries(options.attributes)) {
			table += ` ${key}="${value}"`;
		}
	}
	table += '>';
	if (options.caption) {
		table += `<caption>${options.caption}</caption>`;
	}
	if (!options.headers) {
		options.headers = Object.keys(data[0] ?? {});
	}
	// map all string headers to objects with key and display properties
	const headers = options.headers.map((header) => (typeof header === 'string' ? { key: header, display: header } : header));
	table += '<thead>';
	table += '<tr>';
	for (const [index, header] of headers.entries()) {
		const thStyle = options.thStyles?.[index] || '';
		table += `<th style="${thStyle}">${options.html ? header.display : sanitize(header.display)}</th>`;
	}
	table += '</tr>';
	table += '</thead>';
	table += '<tbody>';
	for (const row of data) {
		table += '<tr>';
		for (const header of headers) {
			table += `<td>${options.html ? row[header.key] : sanitize(row[header.key])}</td>`;
		}
		table += '</tr>';
	}
	table += '</tbody>';
	table += '</table></div>';
	return table;
}

/**
 * Font Awesome icon to SVG
 * @param {import('@danieloi/pro-solid-svg-icons').IconDefinition} icon - The icon to convert
 * @param {string} [color] - The color of the icon
 * @returns {string} - The SVG icon
 */
export function iconToSvg(icon, color) {
	const [width, height, , , svgPathData] = icon.icon;
	return `<svg fill="${color || 'currentColor'}" height="1em" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><path d="${svgPathData}" /></svg>`;
}

/**
 * Translate (default from a detected language to English)
 * @param {string} text - The text to translate
 * @param {{ from?: string, to?: string }} [options] - Options for the translation
 * @returns {Promise<string>} - The translated text
 */
export async function translate(text, options = {}) {
	const defaults = { from: 'auto', to: 'en' };
	options = { ...defaults, ...options };
	try {
		const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${options.from}&tl=${options.to}&dt=t&q=${encodeURIComponent(text)}`);
		const json = await response.json();
		return json[0][0][0];
	} catch (error) {
		return text;
	}
}

/**
 * Log queries to the server for debugging and analytics
 * @param {string} query - The query to log
 */
export function logQuery(query) {
	const logUrl = `https://old.torahcalc.com/logs/write.php?query=${encodeURIComponent(query)}`;
	try {
		fetch(logUrl);
	} catch (e) {
		// do nothing
	}
}

/**
 * Get the user's current location as a GeolocationPosition object
 * @returns {Promise<GeolocationPosition>} - The user's current location
 */
export async function getUserPosition() {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Geolocation is not supported by your browser.'));
		}
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

/**
 * Get the next instance of a day of the week
 * @param {number} day - The day of the week (0-6, Sunday-Saturday)
 * @param {Date} [date] - The date to start from (defaults to today)
 * @returns {Date} - The next instance of the day of the week
 */
export function getNextDayOfWeek(day, date = new Date()) {
	const resultDate = new Date(date);
	resultDate.setDate(date.getDate() + ((day + 7 - date.getDay()) % 7));
	return resultDate;
}

/**
 * Get the previous instance of a day of the week
 * @param {number} day - The day of the week (0-6, Sunday-Saturday)
 * @param {Date} [date] - The date to start from (defaults to today)
 * @returns {Date} - The previous instance of the day of the week
 */
export function getPrevDayOfWeek(day, date = new Date()) {
	const resultDate = new Date(date);
	resultDate.setDate(date.getDate() - ((date.getDay() + 7 - day) % 7));
	return resultDate;
}

/**
 * Convert Date to { year: number, month: number, day: number } object
 * @param {Date} date - The date to convert
 * @param {boolean} afterSunset - Whether to return the date after sunset
 * @returns {{ year: number, month: number, day: number, afterSunset: boolean }} - The date object
 */
export function dateToObject(date, afterSunset = false) {
	return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), afterSunset };
}

/**
 * HTML-esacpe a string for safe use in HTML
 * @param {string} string - The string to escape
 * @returns {string} - The escaped string
 */
export function escapeHtml(string) {
	return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
