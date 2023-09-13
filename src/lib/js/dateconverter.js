import { HDate } from '@hebcal/core';

const GREGORIAN_REFORMATION = new Date('September 14, 1752');
const DAY_OF_CREATION = new Date('-003760-09-07T00:00:00.000Z');
const MAX_GREGORIAN_YEAR = 275759;
const MAX_HEBREW_YEAR = 279516;
const GREGORIAN_REFORMATION_WARNING =
	'Warning: Dates before the adoption of the Gregorian Calendar in 1752 may be inaccurate. <a href="https://en.wikipedia.org/wiki/Calendar_(New_Style)_Act_1750#England_and_Wales">More info.</a>';

/**
 * @typedef {Object} GregorianToHebrewOptions
 * @property {number} year - The Gregorian year to convert.
 * @property {number} month - The Gregorian month to convert (1-12).
 * @property {number} day - The Gregorian day to convert (1-31).
 * @property {boolean} [afterSunset=false] - Whether the Gregorian date is after sunset.
 */

/**
 * Converts a Gregorian date to a Hebrew date.
 *
 * @param {GregorianToHebrewOptions} options - The options for the conversion.
 * @returns {{ year: number, month: number, day: number, monthName: string, displayEn: string, displayHe: string, displayGematriya: string, warning?: string }} The Hebrew date.
 */
export const gregorianToHebrew = ({ year, month, day, afterSunset = false }) => {
	if (year === 0) {
		throw new Error('Gregorian year 0 does not exist.');
	}
	if (year > MAX_GREGORIAN_YEAR) {
		throw new Error(`Gregorian cannot exceed ${MAX_GREGORIAN_YEAR}.`);
	}
	const date = new Date(year, month - 1, day + (afterSunset ? 1 : 0));
	date.setFullYear(year > 0 ? year : year + 1); // fix for 2-digit years and years before year 1
	if (date < DAY_OF_CREATION) {
		throw new Error('Gregorian date cannot be before September 7, 3761 BCE.');
	}
	const hDate = new HDate(date);
	const result = {
		year: hDate.getFullYear(),
		month: hDate.getMonth(), // 1=NISAN, 7=TISHREI
		day: hDate.getDate(),
		monthName: hDate.getMonthName(),
		displayEn: hDate.render('en'),
		displayHe: hDate.render('he'),
		displayGematriya: hDate.renderGematriya(),
	};
	if (date < GREGORIAN_REFORMATION) {
		// @ts-ignore
		result.warning = GREGORIAN_REFORMATION_WARNING;
	}
	return result;
};

/**
 * @typedef {Object} HebrewToGregorianOptions
 * @property {number} year - The Hebrew year to convert.
 * @property {number} month - The Hebrew month to convert (1=NISAN, 7=TISHREI).
 * @property {number} day - The Hebrew day to convert (1-30).
 * @property {boolean} [afterSunset=false] - Whether the Hebrew date is after sunset.
 */

/**
 * Format a date as Mon, January 11, 2023.
 *
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date.
 */
export const formatDate = (date) => {
	const dateToFormat = new Date(date);
	let year = date.getFullYear();
	dateToFormat.setFullYear(9999);
	let formatted = dateToFormat.toLocaleDateString('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	// fix for years before year 1
	if (year <= 0) {
		year -= 1;
	}
	if (isNaN(Math.abs(year))) {
		throw new Error('Invalid Gregorian date.');
	}
	const formattedYear = (year < 0 ? '-' : '') + Math.abs(year).toString().padStart(4, '0');
	formatted = formatted.replace('9999', formattedYear);
	return formatted;
};

/**
 * Converts a Hebrew date to a Gregorian date.
 *
 * @param {HebrewToGregorianOptions} options - The options for the conversion.
 * @returns {{ date: Date, year: number, month: number, day: number, display: string, warning?: string }} The Gregorian date.
 */
export const hebrewToGregorian = ({ year, month, day, afterSunset = false }) => {
	if (year <= 0) {
		throw new Error('Hebrew date cannot be before Tishrei 1, 0001 (September 7, -3761).');
	}
	if (year > MAX_HEBREW_YEAR) {
		throw new Error(`Hebrew year cannot exceed ${MAX_HEBREW_YEAR}.`);
	}
	const date = new HDate(day, month, year).greg();
	// subtract 1 day if after sunset
	date.setDate(date.getDate() - (afterSunset ? 1 : 0));
	const result = {
		date,
		year: date.getFullYear() > 0 ? date.getFullYear() : date.getFullYear() - 1, // fix for years before year 1
		month: date.getMonth() + 1,
		day: date.getDate(),
		display: formatDate(date),
	};
	if (date < GREGORIAN_REFORMATION) {
		// @ts-ignore
		result.warning = GREGORIAN_REFORMATION_WARNING;
	}
	return result;
};
