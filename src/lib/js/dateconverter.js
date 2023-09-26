import { HDate } from '@hebcal/core';
import { formatDate } from './utils';

const GREGORIAN_REFORMATION = new Date('September 14, 1752');
const DAY_OF_CREATION = new Date('-003760-09-07T00:00:00.000Z');
const MAX_GREGORIAN_YEAR = 275759;
const MAX_HEBREW_YEAR = 279516;
const GREGORIAN_REFORMATION_WARNING =
	'Warning: Dates before the adoption of the Gregorian Calendar in 1752 may be inaccurate. <a href="https://en.wikipedia.org/wiki/Calendar_(New_Style)_Act_1750#England_and_Wales">More info.</a>';

/**
 * Map HebCal month numbers to the names used in this app.
 * @type {{ [key: number]: string }}
 */
export const hebrewMonthMap = {
	1: 'Nissan', // 'Nisan' in HebCal
	2: 'Iyar', // 'Iyyar' in HebCal
	3: 'Sivan',
	4: 'Tammuz', // 'Tamuz' in HebCal
	5: 'Av',
	6: 'Elul',
	7: 'Tishrei',
	8: 'Cheshvan',
	9: 'Kislev',
	10: 'Teves', // 'Tevet' in HebCal
	11: 'Shevat', // "Sh'vat" in HebCal
	12: 'Adar',
	13: 'Adar II',
};

export const hebrewMonths = Object.values(hebrewMonthMap);

/**
 * Format a Hebrew date in English with month names replaced using the map.
 * @param {HDate} hDate - The Hebrew date to format.
 * @returns {string} The formatted date.
 */
export const formatHebrewDateEn = (hDate) => {
	const formatted = hDate.render('en');
	const monthNumber = hDate.getMonth();
	const hebcalMonthName = hDate.getMonthName();
	if (formatted.includes(hebcalMonthName) && monthNumber in hebrewMonthMap) {
		const replacementMonthName = hebrewMonthMap[monthNumber];
		return formatted.replace(hebcalMonthName, replacementMonthName);
	}
	return formatted;
};

/**
 * Format a Hebrew date with month names in Hebrew.
 * @param {HDate} hDate - The Hebrew date to format.
 * @returns {string} The formatted date.
 */
export const formatHebrewDateHe = (hDate) => {
	return hDate.render('he');
};

/**
 * Format a Hebrew date in Hebrew with gematriya for the day and year.
 * @param {HDate} hDate - The Hebrew date to format.
 * @returns {string} The formatted date.
 */
export const formatHebrewDateGematriya = (hDate) => {
	return hDate.renderGematriya();
};

/**
 * Converts a Gregorian date to a Hebrew date.
 *
 * @typedef {Object} GregorianToHebrewOptions
 * @property {number} year - The Gregorian year to convert.
 * @property {number} month - The Gregorian month to convert (1-12).
 * @property {number} day - The Gregorian day to convert (1-31).
 * @property {boolean} [afterSunset=false] - Whether the Gregorian date is after sunset.
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
		monthName: hebrewMonthMap[hDate.getMonth()] || hDate.getMonthName(),
		displayEn: formatHebrewDateEn(hDate),
		displayHe: formatHebrewDateHe(hDate),
		displayGematriya: formatHebrewDateGematriya(hDate),
	};
	if (date < GREGORIAN_REFORMATION) {
		// @ts-ignore
		result.warning = GREGORIAN_REFORMATION_WARNING;
	}
	return result;
};

/**
 * Converts a Hebrew date to a Gregorian date.
 *
 * @typedef {Object} HebrewToGregorianOptions
 * @property {number} year - The Hebrew year to convert.
 * @property {number} month - The Hebrew month to convert (1=NISAN, 7=TISHREI).
 * @property {number} day - The Hebrew day to convert (1-30).
 * @property {boolean} [afterSunset=false] - Whether the Hebrew date is after sunset.
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
	const fixedYear = date.getFullYear() > 0 ? date.getFullYear() : date.getFullYear() - 1; // fix for years before year 1
	const result = {
		date,
		year: fixedYear,
		month: date.getMonth() + 1,
		day: date.getDate(),
		display: formatDate(fixedYear, date.getMonth() + 1, date.getDate()),
	};
	if (date < GREGORIAN_REFORMATION) {
		// @ts-ignore
		result.warning = GREGORIAN_REFORMATION_WARNING;
	}
	return result;
};
