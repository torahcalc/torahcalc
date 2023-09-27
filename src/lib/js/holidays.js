import { HDate, HebrewCalendar } from '@hebcal/core';
import { formatDateObject } from './utils';

/**
 * @typedef {Object} HolidayOptions
 * @property {number} [gregorianYear] - The Gregorian year to calculate holidays for
 * @property {number} [hebrewYear] - The Hebrew year to calculate holidays for
 * @property {HDate} [start] - The start date to calculate holidays for 1 year from
 * @property {boolean} [il] - Whether to use the Israeli holiday schedule
 * @property {boolean} [minorFasts] - Whether to include minor fasts
 * @property {boolean} [roshChodesh] - Whether to include Rosh Chodesh
 * @property {boolean} [shabbosMevorchim] - Whether to include Shabbat Mevarchim
 * @property {boolean} [specialShabbosos] - Whether to include special Shabbasos
 * @property {boolean} [holidays] - Whether to include regular holidays
 */

/**
 * Calculate zmanim for a given date and location
 *
 * @param {HolidayOptions} [options] - The options for the calculation
 * @returns {any} - The zmanim, timed events, and shaah zmanis durations
 */
export function getHolidays({ gregorianYear, hebrewYear, start, il = false, minorFasts = true, roshChodesh = true, shabbosMevorchim = false, specialShabbosos = true, holidays = true } = {}) {
	let yearOptions = {};
	if (gregorianYear && hebrewYear) {
		throw new Error("Only one of 'gregorianYear' and 'hebrewYear' can be specified");
	} else if (gregorianYear) {
		yearOptions = { year: gregorianYear, isHebrewYear: false };
	} else if (hebrewYear) {
		yearOptions = { year: hebrewYear, isHebrewYear: true };
	} else {
		// If no year is specified, default to the upcoming year of holidays from today
		const hDateToday = start || new HDate();
		yearOptions = {
			start: hDateToday,
			end: new HDate(hDateToday.getDate(), hDateToday.getMonth(), hDateToday.getFullYear() + 1),
		};
	}
	const calendarOptions = {
		...yearOptions,
		il: il,
		noMinorFasts: !minorFasts,
		noRoshChodesh: !roshChodesh,
		shabbatMevarchim: shabbosMevorchim,
		noSpecialShabbat: !specialShabbosos,
		noHolidays: !holidays,
		omer: false,
		molad: false,
		ashkenazi: true,
		locale: 'ashkenazi',
	};
	const calendar = HebrewCalendar.calendar(calendarOptions);
	/** @type {{ [key: string]: any }} */
	const events = [];
	for (const event of calendar) {
		events.push({
			url: event.url(),
			date: event.getDate(),
			gregorianDate: formatDateObject(event.getDate().greg()),
			desc: event.getDesc(),
			hebrew: event.render('he'),
			categories: event.getCategories(),
		});
	}
	return events;
}
