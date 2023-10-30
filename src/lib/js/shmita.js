import { gregorianToHebrew } from './dateconverter';

/**
 * Calculate the next shmita year (Hebrew year divisible by 7)
 * @param {number} year Gregorian or Hebrew year
 * @param {boolean} [isGregorian=true] Whether the year is Gregorian or Hebrew
 * @returns {number} The next shmita year on the Hebrew calendar
 */
export function nextShmita(year, isGregorian = true) {
	let hebrewYear = year;
	if (isGregorian) {
		hebrewYear = gregorianToHebrew({ year, month: 1, day: 1 }).year;
	}
	return hebrewYear + (7 - (hebrewYear % 7 || 7));
}

/**
 * Calculate the previous shmita year (Hebrew year divisible by 7)
 *
 * @param {number} year Gregorian or Hebrew year
 * @param {boolean} [isGregorian=true] Whether the year is Gregorian or Hebrew
 * @returns {number} The previous birkas hachama date
 */
export function previousShmita(year, isGregorian = true) {
	let hebrewYear = year;
	if (isGregorian) {
		hebrewYear = gregorianToHebrew({ year, month: 1, day: 1 }).year;
	}
	return hebrewYear - (hebrewYear % 7 || 7);
}

/**
 * Return whether the given year is a shmita year (Hebrew year divisible by 7)
 *
 * @param {number} year Hebrew year
 * @returns {boolean} Whether the year is a shmita year
 */
export function isShmitaYear(year) {
	return year % 7 === 0;
}
