import { HDate } from '@hebcal/core';
import { formatHebrewDateEn } from './dateconverter';
import { formatDate } from './utils';

/**
 * Find all occurrences where a specific Gregorian date (month/day) overlaps with a specific Hebrew date (month/day)
 * within a given year range.
 *
 * @typedef {Object} CalendarOverlapOptions
 * @property {number} gregorianMonth - The Gregorian month (1-12).
 * @property {number} gregorianDay - The Gregorian day (1-31).
 * @property {number} hebrewMonth - The Hebrew month (1=NISAN, 7=TISHREI).
 * @property {number} hebrewDay - The Hebrew day (1-30).
 * @property {number} startYear - The starting Gregorian year (default: current year - 100).
 * @property {number} endYear - The ending Gregorian year (default: current year + 100).
 *
 * @typedef {Object} Overlap
 * @property {number} gregorianYear - The Gregorian year of the overlap.
 * @property {string} gregorianDate - The Gregorian date in YYYY-MM-DD format.
 * @property {string} gregorianDateDisplay - Formatted Gregorian date (the daytime date or evening date).
 * @property {number} hebrewYear - The Hebrew year of the overlap.
 * @property {string} hebrewDate - Formatted Hebrew date.
 * @property {string} eveningStartDate - The Gregorian date when the Hebrew date starts (at sundown).
 * @property {string} eveningStartDateDisplay - The Gregorian date when the Hebrew date starts (at sundown).
 * @property {boolean} eveningOnly - True if only the evening overlaps (not the daytime).
 *
 * @param {CalendarOverlapOptions} options - The options for finding overlaps.
 * @returns {Overlap[]} Array of overlaps found.
 */
export const findCalendarOverlaps = ({ gregorianMonth, gregorianDay, hebrewMonth, hebrewDay, startYear = new Date().getFullYear() - 100, endYear = new Date().getFullYear() + 100 }) => {
	const overlaps = [];

	// Convert the Gregorian year range to approximate Hebrew year range
	const startHDate = new HDate(new Date(startYear, 0, 1));
	const endHDate = new HDate(new Date(endYear, 11, 31));
	const startHebrewYear = startHDate.getFullYear();
	const endHebrewYear = endHDate.getFullYear();

	// Iterate through Hebrew years
	for (let hYear = startHebrewYear; hYear <= endHebrewYear; hYear++) {
		try {
			// Create the Hebrew date
			const hebrewDateObj = new HDate(hebrewDay, hebrewMonth, hYear);

			// Convert to Gregorian date - this returns the DAYTIME date
			const gregDate = hebrewDateObj.greg();
			const gYear = gregDate.getFullYear();
			const gMonth = gregDate.getMonth() + 1;
			const gDay = gregDate.getDate();

			// Skip if outside the requested Gregorian year range
			if (gYear < startYear || gYear > endYear) {
				continue;
			}

			// The Hebrew date starts at sundown on the previous Gregorian day
			const eveningStartDate = new Date(gregDate);
			eveningStartDate.setDate(eveningStartDate.getDate() - 1);
			const eveningYear = eveningStartDate.getFullYear();
			const eveningMonth = eveningStartDate.getMonth() + 1;
			const eveningDay = eveningStartDate.getDate();

			// Check for full overlap (daytime matches)
			const matchesDaytime = gMonth === gregorianMonth && gDay === gregorianDay;

			// Check for evening-only overlap (evening start matches)
			const matchesEveningOnly = eveningMonth === gregorianMonth && eveningDay === gregorianDay;

			if (matchesDaytime || matchesEveningOnly) {
				overlaps.push({
					gregorianYear: gYear,
					gregorianDate: `${gYear}-${String(gMonth).padStart(2, '0')}-${String(gDay).padStart(2, '0')}`,
					gregorianDateDisplay: formatDate(gYear, gMonth, gDay),
					hebrewYear: hYear,
					hebrewDate: formatHebrewDateEn(hebrewDateObj),
					eveningStartDate: `${eveningYear}-${String(eveningMonth).padStart(2, '0')}-${String(eveningDay).padStart(2, '0')}`,
					eveningStartDateDisplay: formatDate(eveningYear, eveningMonth, eveningDay),
					eveningOnly: matchesEveningOnly,
				});
			}
		} catch (error) {
			// Skip invalid dates
			continue;
		}
	}

	return overlaps;
};

/**
 * Get the next occurrence of a calendar overlap from today.
 *
 * @param {CalendarOverlapOptions} options - The options for finding the overlap.
 * @returns {Overlap | null} The next overlap, or null if none found.
 */
export const getNextCalendarOverlap = (options) => {
	const currentYear = new Date().getFullYear();
	const overlaps = findCalendarOverlaps({
		...options,
		startYear: currentYear,
		endYear: currentYear + 200,
	});

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	for (const overlap of overlaps) {
		const overlapDate = new Date(overlap.gregorianYear, Number.parseInt(overlap.gregorianDate.split(' ')[0]) - 1, Number.parseInt(overlap.gregorianDate.split(' ')[1].replace(',', '')));
		if (overlapDate >= today) {
			return overlap;
		}
	}

	return null;
};
