import dayjs from 'dayjs';
import { gregorianToHebrew } from './dateconverter';
import { HDate } from '@hebcal/core';

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
 * Format a number as a string with commas, maximum precision, and no trailing zeros.
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
