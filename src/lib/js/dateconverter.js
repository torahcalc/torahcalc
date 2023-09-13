import { HDate } from '@hebcal/core';

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
 * @returns {{ year: number, month: number, day: number, monthName: string, displayEn: string, displayHe: string, displayGematriya: string }} The Hebrew date.
 */
export const gregorianToHebrew = ({ year, month, day, afterSunset = false }) => {
	const date = new Date(year, month - 1, day + (afterSunset ? 1 : 0));
	const hDate = new HDate(date);
	return {
		year: hDate.getFullYear(),
		month: hDate.getMonth(), // 1=NISAN, 7=TISHREI
		day: hDate.getDate(),
		monthName: hDate.getMonthName(),
		displayEn: hDate.render('en'),
		displayHe: hDate.render('he'),
		displayGematriya: hDate.renderGematriya(),
	};
};

/**
 * @typedef {Object} HebrewToGregorianOptions
 * @property {number} year - The Hebrew year to convert.
 * @property {number} month - The Hebrew month to convert (1=NISAN, 7=TISHREI).
 * @property {number} day - The Hebrew day to convert (1-30).
 * @property {boolean} [afterSunset=false] - Whether the Hebrew date is after sunset.
 */

/**
 * Converts a Hebrew date to a Gregorian date.
 *
 * @param {HebrewToGregorianOptions} options - The options for the conversion.
 * @returns {{ date: Date, year: number, month: number, day: number }} The Gregorian date.
 */
export const hebrewToGregorian = ({ year, month, day, afterSunset = false }) => {
	const date = new HDate(day, month, year).greg();
	// subtract 1 day if after sunset
	date.setDate(date.getDate() - (afterSunset ? 1 : 0));
	return {
		date,
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
	};
};
