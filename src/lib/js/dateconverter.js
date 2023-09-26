import { HDate } from '@hebcal/core';
import dayjs from 'dayjs';

const GREGORIAN_REFORMATION = new Date('September 14, 1752');
const DAY_OF_CREATION = new Date('-003760-09-07T00:00:00.000Z');
const MAX_GREGORIAN_YEAR = 275759;
const MAX_HEBREW_YEAR = 279516;
const GREGORIAN_REFORMATION_WARNING =
	'Warning: Dates before the adoption of the Gregorian Calendar in 1752 may be inaccurate. <a href="https://en.wikipedia.org/wiki/Calendar_(New_Style)_Act_1750#England_and_Wales">More info.</a>';

/** Map HebCal month names to the names used in this app. */
const hebrewMonthMap = {
	Nisan: 'Nissan', // 1
	Iyyar: 'Iyar', // 2
	Sivan: 'Sivan', // 3
	Tamuz: 'Tammuz', // 4
	Av: 'Av', // 5
	Elul: 'Elul', // 6
	Tishrei: 'Tishrei', // 7
	Cheshvan: 'Cheshvan', // 8
	Kislev: 'Kislev', // 9
	Tevet: 'Tevet', // 10
	"Sh'vat": 'Shevat', // 11
	Adar: 'Adar', // 12
	'Adar II': 'Adar II', // 13
};

export const hebrewMonths = Object.values(hebrewMonthMap);

/**
 * Format a Hebrew date in English with month names replaced using the map.
 * @param {HDate} hDate - The Hebrew date to format.
 * @returns {string} The formatted date.
 */
export const formatHebrewDateEn = (hDate) => {
	const formatted = hDate.render('en');
	for (const [hebcalMonthName, replacementMonthName] of Object.entries(hebrewMonthMap)) {
		if (formatted.includes(hebcalMonthName)) {
			return formatted.replace(hebcalMonthName, replacementMonthName);
		}
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
		monthName: hDate.getMonthName(),
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
