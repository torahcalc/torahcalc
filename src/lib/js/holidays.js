import { getLastSaturday } from './utils';
import dayjs from 'dayjs';
import { gregorianToHebrew, hebrewToGregorian } from './dateconverter';
import { HDate } from '@hebcal/core';
new HDate(); // to avoid "unused" warning

const Nissan = 1;
const Iyar = 2;
const Sivan = 3;
const Tammuz = 4;
const Av = 5;
const Elul = 6;
const Tishrei = 7;
const Cheshvan = 8;
const Kislev = 9;
const Teves = 10;
const Shevat = 11;
const Adar = 12;
const AdarII = 13;

/**
 * List of holidays with start and end dates for a given year
 */
const HOLIDAY_DETAILS = [
	{ id: 1, name: 'Rosh Hashanah', start: { mm: Tishrei, dd: 1 }, end: { mm: Tishrei, dd: 2 }, type: 'major' },
	{ id: 2, name: 'Tzom Gedaliah', start: { mm: Tishrei, dd: 3 }, end: { mm: Tishrei, dd: 3 }, type: 'fasts' }, // moved to sun if sat
	{ id: 3, name: 'Yom Kippur', start: { mm: Tishrei, dd: 10 }, end: { mm: Tishrei, dd: 10 }, type: 'major' },
	{ id: 4, name: 'Sukkos', start: { mm: Tishrei, dd: 15 }, end: { mm: Tishrei, dd: 21 }, type: 'major' },
	{ id: 5, name: 'Shemini Atzeret', start: { mm: Tishrei, dd: 22 }, end: { mm: Tishrei, dd: 22 }, type: 'major' },
	{ id: 6, name: 'Simchas Torah', start: { mm: Tishrei, dd: 23 }, end: { mm: Tishrei, dd: 23 }, type: 'major' },
	{ id: 7, name: 'Rosh Chodesh Cheshvan', start: { mm: Cheshvan, dd: 1 }, end: { mm: Cheshvan, dd: 1 }, type: 'roshChodesh' },
	{ id: 8, name: 'Yom HaAliyah', start: { mm: Cheshvan, dd: 7 }, end: { mm: Cheshvan, dd: 7 }, type: 'modern' },
	{ id: 9, name: 'Sigd', start: { mm: Cheshvan, dd: 29 }, end: { mm: Cheshvan, dd: 29 }, type: 'modern' },
	{ id: 10, name: 'Rosh Chodesh Kislev', start: { mm: Kislev, dd: 1 }, end: { mm: Kislev, dd: 1 }, type: 'roshChodesh' },
	{ id: 11, name: 'Chanukah', start: { mm: Kislev, dd: 25 }, end: { mm: Teves, dd: 3 }, type: 'major' },
	{ id: 12, name: 'Rosh Chodesh Teves', start: { mm: Teves, dd: 1 }, end: { mm: Teves, dd: 1 }, type: 'roshChodesh' },
	{ id: 13, name: "Asara B'Teves", start: { mm: Teves, dd: 10 }, end: { mm: Teves, dd: 10 }, type: 'fasts' },
	{ id: 14, name: 'Rosh Chodesh Shevat', start: { mm: Shevat, dd: 1 }, end: { mm: Shevat, dd: 1 }, type: 'roshChodesh' },
	{ id: 15, name: "Tu B'Shvat", start: { mm: Shevat, dd: 15 }, end: { mm: Shevat, dd: 15 }, type: 'minor' },
	{ id: 16, name: 'Rosh Chodesh Adar I', start: { mm: Adar, dd: 1 }, end: { mm: Adar, dd: 1 }, type: 'roshChodesh' }, // none if not leap year
	{ id: 17, name: 'Rosh Chodesh Adar II', start: { mm: AdarII, dd: 1 }, end: { mm: AdarII, dd: 1 }, type: 'roshChodesh' }, // none if not leap year
	{ id: 18, name: 'Rosh Chodesh Adar', start: { mm: AdarII, dd: 1 }, end: { mm: AdarII, dd: 1 }, type: 'roshChodesh' }, // none if leap year
	{ id: 19, name: "Ta'anis Esther", start: { mm: AdarII, dd: 13 }, end: { mm: AdarII, dd: 13 }, type: 'fasts' }, // moved to thu if sat
	{ id: 20, name: 'Purim', start: { mm: AdarII, dd: 14 }, end: { mm: AdarII, dd: 14 }, type: 'major' },
	{ id: 21, name: 'Shushan Purim', start: { mm: AdarII, dd: 15 }, end: { mm: AdarII, dd: 15 }, type: 'minor' }, // moved to sun if sat
	{ id: 22, name: 'Rosh Chodesh Nissan', start: { mm: Nissan, dd: 1 }, end: { mm: Nissan, dd: 1 }, type: 'roshChodesh' },
	{ id: 23, name: 'Yom HaAliyah', start: { mm: Nissan, dd: 10 }, end: { mm: Nissan, dd: 10 }, type: 'modern' },
	{ id: 24, name: "Ta'anis Bechoros", start: { mm: Nissan, dd: 14 }, end: { mm: Nissan, dd: 14 }, type: 'fasts' }, // moved to thu if sat
	{ id: 25, name: 'Pesach', start: { mm: Nissan, dd: 15 }, end: { mm: Nissan, dd: 22 }, type: 'major' },
	{ id: 26, name: 'Yom HaShoah', start: { mm: Nissan, dd: 27 }, end: { mm: Nissan, dd: 27 }, type: 'modern' }, // moved to thu if fri, to mon if sun
	{ id: 27, name: 'Rosh Chodesh Iyar', start: { mm: Iyar, dd: 1 }, end: { mm: Iyar, dd: 1 }, type: 'roshChodesh' },
	{ id: 28, name: 'Yom HaZikaron', start: { mm: Iyar, dd: 4 }, end: { mm: Iyar, dd: 4 }, type: 'modern' }, // moved to mon if sun, to wed if thu, to wed if fri
	{ id: 29, name: "Yom HaAtzma'ut", start: { mm: Iyar, dd: 5 }, end: { mm: Iyar, dd: 5 }, type: 'modern' }, // moved to tue if mon, to thu if fri, to thu if sat
	{ id: 30, name: 'Pesach Sheni', start: { mm: Iyar, dd: 14 }, end: { mm: Iyar, dd: 14 }, type: 'minor' },
	{ id: 31, name: "Lag B'Omer", start: { mm: Iyar, dd: 18 }, end: { mm: Iyar, dd: 18 }, type: 'minor' },
	{ id: 32, name: 'Yom Yerushalayim', start: { mm: Iyar, dd: 28 }, end: { mm: Iyar, dd: 28 }, type: 'modern' },
	{ id: 33, name: 'Rosh Chodesh Sivan', start: { mm: Sivan, dd: 1 }, end: { mm: Sivan, dd: 1 }, type: 'roshChodesh' },
	{ id: 34, name: 'Shavuos', start: { mm: Sivan, dd: 6 }, end: { mm: Sivan, dd: 7 }, type: 'major' },
	{ id: 35, name: 'Rosh Chodesh Tammuz', start: { mm: Tammuz, dd: 1 }, end: { mm: Tammuz, dd: 1 }, type: 'roshChodesh' },
	{ id: 36, name: 'Tzom Tammuz', start: { mm: Tammuz, dd: 17 }, end: { mm: Tammuz, dd: 17 }, type: 'fasts' }, // moved to sun if sat
	{ id: 37, name: 'Rosh Chodesh Av', start: { mm: Av, dd: 1 }, end: { mm: Av, dd: 1 }, type: 'roshChodesh' },
	{ id: 38, name: "Tisha B'av", start: { mm: Av, dd: 9 }, end: { mm: Av, dd: 9 }, type: 'major' }, // moved to sun if sat
	{ id: 39, name: "Tu B'av", start: { mm: Av, dd: 15 }, end: { mm: Av, dd: 15 }, type: 'minor' },
	{ id: 40, name: 'Rosh Chodesh Elul', start: { mm: Elul, dd: 1 }, end: { mm: Elul, dd: 1 }, type: 'roshChodesh' },
	{ id: 42, name: 'Shabbos Mevorchim Cheshvan', start: { mm: Cheshvan, dd: 1 }, end: { mm: Cheshvan, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 43, name: 'Shabbos Mevorchim Kislev', start: { mm: Kislev, dd: 1 }, end: { mm: Kislev, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 44, name: 'Shabbos Mevorchim Teves', start: { mm: Teves, dd: 1 }, end: { mm: Teves, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 45, name: 'Shabbos Mevorchim Shevat', start: { mm: Shevat, dd: 1 }, end: { mm: Shevat, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 46, name: 'Shabbos Mevorchim Adar I', start: { mm: Adar, dd: 1 }, end: { mm: Adar, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 47, name: 'Shabbos Mevorchim Adar II', start: { mm: AdarII, dd: 1 }, end: { mm: AdarII, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 48, name: 'Shabbos Mevorchim Adar', start: { mm: AdarII, dd: 1 }, end: { mm: AdarII, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 49, name: 'Shabbos Mevorchim Nissan', start: { mm: Nissan, dd: 1 }, end: { mm: Nissan, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 50, name: 'Shabbos Mevorchim Iyar', start: { mm: Iyar, dd: 1 }, end: { mm: Iyar, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 51, name: 'Shabbos Mevorchim Sivan', start: { mm: Sivan, dd: 1 }, end: { mm: Sivan, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 52, name: 'Shabbos Mevorchim Tammuz', start: { mm: Tammuz, dd: 1 }, end: { mm: Tammuz, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 53, name: 'Shabbos Mevorchim Av', start: { mm: Av, dd: 1 }, end: { mm: Av, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 54, name: 'Shabbos Mevorchim Elul', start: { mm: Elul, dd: 1 }, end: { mm: Elul, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	{ id: 55, name: 'Shabbos Shekalim', start: { mm: AdarII, dd: 1 }, end: { mm: AdarII, dd: 1 }, type: 'specialShabbos' }, // on or before rc adar
	{ id: 56, name: 'Shabbos Zachor', start: { mm: AdarII, dd: 14 }, end: { mm: AdarII, dd: 14 }, type: 'specialShabbos' }, // before purim
	{ id: 57, name: 'Shabbos Parah', start: { mm: AdarII, dd: 23 }, end: { mm: AdarII, dd: 23 }, type: 'specialShabbos' }, // shabbos before or on shabbos before rc nissan
	{ id: 58, name: 'Shabbos HaChodesh', start: { mm: Nissan, dd: 1 }, end: { mm: Nissan, dd: 1 }, type: 'specialShabbos' }, // on or before rc nissan
	{ id: 59, name: 'Shabbos HaGadol', start: { mm: Nissan, dd: 15 }, end: { mm: Nissan, dd: 15 }, type: 'specialShabbos' }, // before pesach
	{ id: 60, name: 'Shabbos Chazon', start: { mm: Av, dd: 9 }, end: { mm: Av, dd: 9 }, type: 'specialShabbos' }, // before tisha b'av
	{ id: 61, name: 'Shabbos Nachamu', start: { mm: Av, dd: 16 }, end: { mm: Av, dd: 16 }, type: 'specialShabbos' }, // after tisha b'av
	{ id: 62, name: 'Shabbos Shira', start: { mm: Shevat, dd: 15 }, end: { mm: Shevat, dd: 15 }, type: 'specialShabbos' }, // on or before tu bishvat
	{ id: 63, name: 'Shabbos Shuva', start: { mm: Tishrei, dd: 8 }, end: { mm: Tishrei, dd: 8 }, type: 'specialShabbos' }, // shabbos after rh
	{ id: 64, name: 'Leil Selichos', start: { mm: Elul, dd: 30 }, end: { mm: Elul, dd: 30 }, type: 'minor' }, // shabbos before rh (or week before if rh is mon/tue)
	// { id: 65, name: 'Hoshanah Rabbah', start: { mm: Tishrei, dd: 21}, end: { mm: Tishrei, dd: 21}, type: 'major' },
	// { id: 66, name: 'Ben-Gurion Day', start: { mm: Kislev, dd: 6}, end: { mm: Kislev, dd: 6}, type: 'modern' },
	// { id: 67, name: 'Rabin Day', start: { mm: Cheshvan, dd: 12}, end: { mm: Cheshvan, dd: 12}, type: 'modern' },
	// { id: 68, name: 'Herzl Day', start: { mm: Iyar, dd: 10}, end: { mm: Iyar, dd: 10}, type: 'modern' },
	// { id: 69, name: 'Jabotinsky Day', start: { mm: Tammuz, dd: 29}, end: { mm: Tammuz, dd: 29}, type: 'modern' },
	{ id: 70, name: 'The Rebbe recovers from illness', start: { mm: Kislev, dd: 1 }, end: { mm: Kislev, dd: 1 }, type: 'chabad' },
	{ id: 71, name: 'Birthday and Passing of Rabbi DovBer of Lubavitch', start: { mm: Kislev, dd: 9 }, end: { mm: Kislev, dd: 9 }, type: 'chabad' },
	{ id: 72, name: 'Liberation of Rabbi DovBer of Lubavitch', start: { mm: Kislev, dd: 10 }, end: { mm: Kislev, dd: 10 }, type: 'chabad' },
	{ id: 73, name: 'Liberation of Rabbi Schneur Zalman of Liadi', start: { mm: Kislev, dd: 19 }, end: { mm: Kislev, dd: 20 }, type: 'chabad' },
	{ id: 74, name: 'Sefarim Victory', start: { mm: Teves, dd: 5 }, end: { mm: Teves, dd: 5 }, type: 'chabad' },
	{ id: 75, name: "Yahrtzeit of Rabbi Yosef Yitzchak Schneersohn and Beginning of Rebbe's Leadership", start: { mm: Shevat, dd: 10 }, end: { mm: Shevat, dd: 10 }, type: 'chabad' },
	{ id: 76, name: 'Passing of the Rebbetzin Chaya Mushka Schneerson', start: { mm: Shevat, dd: 22 }, end: { mm: Shevat, dd: 22 }, type: 'chabad' },
	{ id: 77, name: 'Birthday of the Lubavitcher Rebbe, Rabbi Menachem M. Schneerson', start: { mm: Nissan, dd: 11 }, end: { mm: Nissan, dd: 11 }, type: 'chabad' },
	{ id: 78, name: 'Birthday of Rabbi Shmuel of Lubavitch', start: { mm: Iyar, dd: 2 }, end: { mm: Iyar, dd: 2 }, type: 'chabad' },
	{ id: 79, name: 'Yahrtzeit of the Lubavitcher Rebbe, Rabbi Menachem M. Schneerson', start: { mm: Tammuz, dd: 3 }, end: { mm: Tammuz, dd: 3 }, type: 'chabad' },
	{ id: 80, name: 'Liberation of Rabbi Yosef Yitzchak of Lubavitch', start: { mm: Tammuz, dd: 12 }, end: { mm: Tammuz, dd: 13 }, type: 'chabad' },
	{ id: 81, name: 'Birthday of Rabbi Schneur Zalman of Liadi', start: { mm: Elul, dd: 18 }, end: { mm: Elul, dd: 18 }, type: 'chabad' },
];

/**
 *
 * @typedef {Object} HolidayFlags
 * @property {boolean} [diaspora] - Whether to use the diaspora holiday schedule
 * @property {boolean} [major] - Whether to include regular holidays
 * @property {boolean} [minor] - Whether to include minor holidays
 * @property {boolean} [fasts] - Whether to include fasts
 * @property {boolean} [roshChodesh] - Whether to include Rosh Chodesh
 * @property {boolean} [shabbosMevorchim] - Whether to include Shabbos Mevorchim
 * @property {boolean} [specialShabbos] - Whether to include special Shabbasos
 * @property {boolean} [modern] - Whether to include modern holidays
 * @property {boolean} [chabad] - Whether to include Chabad holidays
 *
 * @typedef {Object} HolidayOptions
 * @property {number} [gregorianYear] - The Gregorian year to calculate holidays for
 * @property {number} [hebrewYear] - The Hebrew year to calculate holidays for
 * @property {HDate} [startDate] - The start date to calculate holidays for 1 year from
 * @property {HolidayFlags} [types] - The types of holidays to calculate
 */

/**
 * Calculate zmanim for a given date and location
 *
 * @param {HolidayOptions} [options] - The options for the calculation
 * @returns {any} - The zmanim, timed events, and shaah zmanis durations
 */
export function getHolidays({ gregorianYear = undefined, hebrewYear = undefined, startDate = undefined, types = {} } = {}) {
	if ((gregorianYear && hebrewYear) || (gregorianYear && startDate) || (hebrewYear && startDate)) {
		throw new Error('Only one of gregorianYear, hebrewYear, or start can be specified.');
	} else if (!gregorianYear && !hebrewYear && !startDate) {
		throw new Error('One of gregorianYear, hebrewYear, or start must be specified.');
	}

	let holidayOutput = [];
	let year = 0;
	let endYear = 0;
	if (gregorianYear) {
		// greg year
		year = gregorianYear + 3760;
		if (gregorianYear < 0) {
			++year;
		}
		endYear = year + 1;
	} else if (startDate) {
		// upcoming
		year = startDate.getFullYear();
		endYear = year + 1;
	} else if (hebrewYear) {
		// heb year
		year = hebrewYear;
		endYear = year;
	}
	// iterate twice to get holidays from two years then filter down to one year later
	for (; year <= endYear; year++) {
		for (const holiday of HOLIDAY_DETAILS) {
			let holidayType = holiday.type;
			let hID = holiday.id;
			// @ts-ignore - assume holidayType is a valid key in types
			if (types[holidayType] ?? true) {
				let name = holiday.name;
				let startMonth = holiday.start.mm;
				let startDate = holiday.start.dd;
				let endMonth = holiday.end.mm;
				let endDate = holiday.end.dd;

				// israel schedule changes
				if (!types.diaspora) {
					// Pesach, Shavuos in Israel
					if (hID == 25 || hID == 34) {
						--endDate; // end 1 day early
					}
					// Simchas Torah in Israel
					else if (hID == 6) {
						continue; // skip
					}
				}

				let oneDay = startDate == endDate;
				let gSDate = hebrewToGregorian({ year: year, month: startMonth, day: startDate }).date;
				let gEDate = hebrewToGregorian({ year: year, month: endMonth, day: endDate }).date;
				if (holidayType == 'roshChodesh' || holidayType == 'shabbosMevorchim') {
					const firstOfMonth = hebrewToGregorian({ year: year, month: startMonth, day: 1 }).date;
					const dayBeforeFirstOfMonth = new Date(firstOfMonth);
					dayBeforeFirstOfMonth.setDate(dayBeforeFirstOfMonth.getDate() - 1);
					const hebrewDateBeforeFirstOfMonth = gregorianToHebrew({ year: dayBeforeFirstOfMonth.getFullYear(), month: dayBeforeFirstOfMonth.getMonth() + 1, day: dayBeforeFirstOfMonth.getDate() });
					const twoDayRoshChodesh = hebrewDateBeforeFirstOfMonth.day === 30;
					if (twoDayRoshChodesh) {
						gSDate = dayBeforeFirstOfMonth;
						oneDay = false;
					}
				}
				if (holidayType == 'shabbosMevorchim' || hID == 64 || (hID >= 55 && hID <= 63)) {
					// shabbos mevorchim, leil selichos, special shabbatot
					if (!((hID == 55 || hID == 57 || hID == 58 || hID == 62 || hID == 63 || hID == 60 || hID == 61) && gSDate.getDay() == 6)) {
						// if date is shabbos and can be same date, don't subtract
						const oldGSDate = gSDate;
						gSDate = getLastSaturday(gSDate);
						if (hID == 64 && (oldGSDate.getDay() == 1 || oldGSDate.getDay() == 2)) {
							// leil selichos - if rh is mon/tue subtract extra week
							gSDate = getLastSaturday(gSDate);
						}
						oneDay = true;
						gEDate = gSDate;
					}
				} else if ((hID == 2 || hID == 21 || hID == 36 || hID == 38) && gSDate.getDay() == 6) {
					// if Sat. & tzom gedaliah, shushan purim, tzom tammuz, tisha b'av
					gSDate.setDate(gSDate.getDate() + 1); // move to Sun.
					gEDate = gSDate;
				} else if ((hID == 19 || hID == 24) && gSDate.getDay() == 6) {
					// if Sat. & taanis esther, bechoros
					gSDate.setDate(gSDate.getDate() - 2); // move to Thu.
					gEDate = gSDate;
				} else if (hID == 26) {
					// if yom hashoah
					if (gSDate.getDay() == 5) {
						// if Fri.
						gSDate.setDate(gSDate.getDate() - 1); // move to Thu.
						gEDate = gSDate;
					} else if (gSDate.getDay() == 0) {
						// if Sun.
						gSDate.setDate(gSDate.getDate() + 1); // move to Mon.
						gEDate = gSDate;
					}
				} else if (hID == 28) {
					// if yom hazikaron
					if (gSDate.getDay() == 0) {
						// if Sun.
						gSDate.setDate(gSDate.getDate() + 1); // move to Mon.
						gEDate = gSDate;
					} else if (gSDate.getDay() == 4) {
						// if Thu.
						gSDate.setDate(gSDate.getDate() - 1); // move to Wed.
						gEDate = gSDate;
					} else if (gSDate.getDay() == 5) {
						// if Fri.
						gSDate.setDate(gSDate.getDate() - 2); // move to Wed.
						gEDate = gSDate;
					}
				} else if (hID == 29) {
					// if yom haatzmaut
					if (gSDate.getDay() == 1) {
						// if mon.
						gSDate.setDate(gSDate.getDate() + 1); // move to tue.
						gEDate = gSDate;
					} else if (gSDate.getDay() == 5) {
						// if fri.
						gSDate.setDate(gSDate.getDate() - 1); // move to thu.
						gEDate = gSDate;
					} else if (gSDate.getDay() == 6) {
						// if sat.
						gSDate.setDate(gSDate.getDate() - 2); // move to thu.
						gEDate = gSDate;
					}
				}
				let startDateHebrew = gregorianToHebrew({ year: gSDate.getFullYear(), month: gSDate.getMonth() + 1, day: gSDate.getDate() });
				let endDateHebrew = gregorianToHebrew({ year: gEDate.getFullYear(), month: gEDate.getMonth() + 1, day: gEDate.getDate() });
				const hebrewYear = startDateHebrew.year;
				let wrongRoshChodeshAdar = ((7 * year + 1) % 19 < 7 && (hID == 18 || hID == 48)) || ((7 * year + 1) % 19 >= 7 && (hID == 16 || hID == 17 || hID == 46 || hID == 47));
				let eveningDate = new Date(gSDate);
				let beginsHTML = '';
				let beginsText = '';
				if (holidayType != 'fasts') {
					eveningDate.setDate(eveningDate.getDate() - 1);
					beginsHTML = "Begins in the evening&nbsp;of<p class='dt'>" + dayjs(eveningDate).format('ddd, MMM D') + '</p>';
					beginsText = 'Begins in the evening of ' + dayjs(eveningDate).format('ddd, MMM D');
				} else {
					beginsHTML = "Begins at dawn&nbsp;of<p class='dt'>" + dayjs(gSDate).format('ddd, MMM D') + '</p>';
					beginsText = 'Begins at dawn of ' + dayjs(gSDate).format('ddd, MMM D');
				}
				const endsHTML = 'Ends in the evening&nbsp;of<p class="dt">' + dayjs(gEDate).format('ddd, MMM D') + '</p>';
				const endsText = 'Ends in the evening of ' + dayjs(gEDate).format('ddd, MMM D');
				const gregorianYear = formatGregorianYear(+dayjs(gSDate).format('YYYY'));
				if (!wrongRoshChodeshAdar) {
					let outputHTML =
						"<div class='holidayDivRow'>" +
						"<div class='holidayDiv title'>" +
						name +
						'<br>' +
						gregorianYear +
						' / ' +
						hebrewYear +
						'</div>' +
						"<div class='holidayDiv'>" +
						beginsHTML +
						endsHTML +
						'</div>' +
						"<div class='holidayDiv'>";
					if (oneDay) {
						outputHTML += "<p class='dt'>" + startDateHebrew.displayEn + '</p>';
					} else {
						outputHTML += "Begins on<p class='dt'>" + startDateHebrew.displayEn + '</p>' + "<br class='nl'/>Ends on" + "<p class='dt'>" + endDateHebrew.displayEn + '</p>';
					}
					outputHTML += '</div>' + '</div>';
					holidayOutput.push({
						name: name,
						type: holidayType,
						date: dayjs(gSDate).format('YYYY-MM-DD'),
						gregorianYear: gSDate.getFullYear(),
						gregorianStart: beginsText,
						gregorianEnd: endsText,
						hebrewYear: hebrewYear,
						hebrewStart: startDateHebrew.displayEn,
						hebrewEnd: endDateHebrew.displayEn,
						hebrewMonth: startDateHebrew.month,
						hebrewDay: startDateHebrew.day,
						html: outputHTML,
					});
				}
			}
		}
	}

	holidayOutput.sort(function (a, b) {
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});
	// sort years backward if negative year
	if (holidayOutput.length > 0 && holidayOutput[0].gregorianYear < 0) {
		holidayOutput.sort(function (a, b) {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});
	}

	// filter holiday output based on input (gregorianYear, hebrewYear, or startDate)
	const startDateGreg = startDate ? dayjs(hebrewToGregorian({ year: startDate.getFullYear(), month: startDate.getMonth(), day: startDate.getDate() }).date).format('YYYY-MM-DD') : '';
	const nextYearYMD = startDate ? dayjs(hebrewToGregorian({ year: startDate.getFullYear() + 1, month: startDate.getMonth(), day: startDate.getDate() }).date).format('YYYY-MM-DD') : '';
	holidayOutput = holidayOutput.filter((output) => {
		if (gregorianYear) {
			return Number(output.gregorianYear) == gregorianYear;
		} else if (hebrewYear) {
			return Number(output.hebrewYear) == hebrewYear;
		} else if (startDate) {
			return output.date > startDateGreg && output.date < nextYearYMD;
		}
	});

	return holidayOutput;
}

/**
 * Format a Gregorian Year taking into account the lack of a year 0
 * @param {number} gregorianYear - The Gregorian year to format
 * @returns {string} - The formatted Gregorian year
 */
function formatGregorianYear(gregorianYear) {
	// there is no year 0
	if (gregorianYear <= 0) {
		gregorianYear -= 1;
	}
	// pad year to 4 digits
	return (gregorianYear < 0 ? '-' : '') + Math.abs(gregorianYear).toString().padStart(4, '0');
}
