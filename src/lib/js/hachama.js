import { gregorianToHebrew } from './dateconverter';
import { formatDate } from './utils';

/** Interval between every two birkas hachama dates in JD */
const JULIAN_DATE_INTERVAL = 10227;

/** The birkas hachama date in JD for 2009 */
const BIRKAS_HACHAMA_JD_2009 = 2454929.5; // April 8, 2009

/**
 * Convert a Julian date to a Gregorian date
 * @param {number} jd Julian date
 * @returns {Date} Gregorian date
 */
function julianToGregorian(jd) {
	const j = Math.floor(jd + 0.5);
	const f = jd + 0.5 - j;
	let i = Math.floor((j - 1867216.25) / 36524.25);
	let b = j + 1 + i - Math.floor(i / 4);
	let c = b + 1524;
	let d = Math.floor((c - 122.1) / 365.25);
	let e = Math.floor(365.25 * d);
	let g = Math.floor((c - e) / 30.6001);

	let day = c - e + f - Math.floor(30.6001 * g);
	let month = g < 13.5 ? g - 1 : g - 13;
	let year = month > 2.5 ? d - 4716 : d - 4715;

	const date = new Date(Date.UTC(year, month - 1, day));
	// fix for 2-digit years and years before year 1
	date.setUTCFullYear(year > 0 ? year : year + 1);
	return date;
}

/**
 * @typedef {{ gregorianDate: { date: string, display: string, year: number, month: number, day: number }, hebrewDate: { year: number, month: number, day: number, monthName: string, displayEn: string, displayHe: string, displayGematriya: string, warning?: string } }} BirkasHachamaResult
 */

/**
 * Calculate the next birkas hachama date
 * @param {number} year Gregorian year
 * @returns {BirkasHachamaResult} The next birkas hachama date
 */
export function nextBirkasHachama(year) {
	let birkasHachamaJulianDate = BIRKAS_HACHAMA_JD_2009;
	let birkasHachamaGregorianDate = julianToGregorian(birkasHachamaJulianDate);
	if (year < birkasHachamaGregorianDate.getUTCFullYear()) {
		while (year < birkasHachamaGregorianDate.getUTCFullYear()) {
			birkasHachamaJulianDate -= JULIAN_DATE_INTERVAL;
			birkasHachamaGregorianDate = julianToGregorian(birkasHachamaJulianDate);
		}
	}
	if (year > birkasHachamaGregorianDate.getUTCFullYear()) {
		while (year > birkasHachamaGregorianDate.getUTCFullYear()) {
			birkasHachamaJulianDate += JULIAN_DATE_INTERVAL;
			birkasHachamaGregorianDate = julianToGregorian(birkasHachamaJulianDate);
		}
	}
	const gregYear = birkasHachamaGregorianDate.getUTCFullYear();
	const gregMonth = birkasHachamaGregorianDate.getUTCMonth() + 1;
	const gregDate = birkasHachamaGregorianDate.getUTCDate();
	const hebrewDate = gregorianToHebrew({ year: gregYear, month: gregMonth, day: gregDate });
	return {
		gregorianDate: {
			date: birkasHachamaGregorianDate.toISOString().split('T')[0],
			display: formatDate(gregYear, gregMonth, gregDate),
			year: gregYear,
			month: gregMonth,
			day: gregDate,
		},
		hebrewDate: hebrewDate,
	};
}

/**
 * Calculate the previous birkas hachama date
 *
 * @param {number} year Gregorian year
 * @returns {BirkasHachamaResult} The previous birkas hachama date
 */
export function previousBirkasHachama(year) {
	const nextBirkasHachamaDate = nextBirkasHachama(year).gregorianDate.date;
	let currentUpcomingBirkasHachamaDate = nextBirkasHachamaDate;
	while (currentUpcomingBirkasHachamaDate === nextBirkasHachamaDate && year >= -3761) {
		year--;
		currentUpcomingBirkasHachamaDate = nextBirkasHachama(year).gregorianDate.date;
	}
	return nextBirkasHachama(year);
}
