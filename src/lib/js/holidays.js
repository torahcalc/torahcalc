import { gregorianToHebrew, hebrewToGregorian } from './dateconverter';
import { getLastSaturday } from './utils';
import dayjs from 'dayjs';

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
 * @typedef {Object} HolidayHebrewDate
 * @property {number} mm - The month of the holiday (1 = Nissan, 2 = Iyar, etc.)
 * @property {number} dd - The day of the month of the holiday
 */

/**
 * @typedef {Object} Holiday
 * @property {string} name - The name of the holiday
 * @property {HolidayHebrewDate} start - The start date of the holiday
 * @property {HolidayHebrewDate} end - The end date of the holiday
 * @property {string} type - The type of holiday (major, minor, fasts, roshChodesh, specialShabbos, shabbosMevorchim, modern)
 */

/**
 * List of holidays with start and end dates for a given year
 * 
 * @type {Record<string, Holiday>}
 */
export const HOLIDAY_DETAILS = {
	'rosh_hashanah': { name: 'Rosh Hashanah', start: { mm: Tishrei, dd: 1 }, end: { mm: Tishrei, dd: 2 }, type: 'major' },
	'tzom_gedaliah': { name: 'Tzom Gedaliah', start: { mm: Tishrei, dd: 3 }, end: { mm: Tishrei, dd: 3 }, type: 'fasts' }, // moved to sun if sat
	'yom_kippur': { name: 'Yom Kippur', start: { mm: Tishrei, dd: 10 }, end: { mm: Tishrei, dd: 10 }, type: 'major' },
	'sukkos': { name: 'Sukkos', start: { mm: Tishrei, dd: 15 }, end: { mm: Tishrei, dd: 21 }, type: 'major' },
	'shemini_atzeres': { name: 'Shemini Atzeres', start: { mm: Tishrei, dd: 22 }, end: { mm: Tishrei, dd: 22 }, type: 'major' },
	'simchas_torah': { name: 'Simchas Torah', start: { mm: Tishrei, dd: 23 }, end: { mm: Tishrei, dd: 23 }, type: 'major' },
	'rosh_chodesh_cheshvan': { name: 'Rosh Chodesh Cheshvan', start: { mm: Cheshvan, dd: 1 }, end: { mm: Cheshvan, dd: 1 }, type: 'roshChodesh' },
	'yom_haaliyah_schools': { name: 'Yom HaAliyah (Observed in Schools)', start: { mm: Cheshvan, dd: 7 }, end: { mm: Cheshvan, dd: 7 }, type: 'modern' },
	'sigd': { name: 'Sigd', start: { mm: Cheshvan, dd: 29 }, end: { mm: Cheshvan, dd: 29 }, type: 'modern' },
	'rosh_chodesh_kislev': { name: 'Rosh Chodesh Kislev', start: { mm: Kislev, dd: 1 }, end: { mm: Kislev, dd: 1 }, type: 'roshChodesh' },
	'chanukah': { name: 'Chanukah', start: { mm: Kislev, dd: 25 }, end: { mm: Teves, dd: 3 }, type: 'major' },
	'rosh_chodesh_teves': { name: 'Rosh Chodesh Teves', start: { mm: Teves, dd: 1 }, end: { mm: Teves, dd: 1 }, type: 'roshChodesh' },
	'asara_bteves': { name: "Asara B'Teves", start: { mm: Teves, dd: 10 }, end: { mm: Teves, dd: 10 }, type: 'fasts' },
	'rosh_chodesh_shevat': { name: 'Rosh Chodesh Shevat', start: { mm: Shevat, dd: 1 }, end: { mm: Shevat, dd: 1 }, type: 'roshChodesh' },
	'tu_bshvat': { name: "Tu B'Shvat", start: { mm: Shevat, dd: 15 }, end: { mm: Shevat, dd: 15 }, type: 'minor' },
	'rosh_chodesh_adar_i': { name: 'Rosh Chodesh Adar I', start: { mm: Adar, dd: 1 }, end: { mm: Adar, dd: 1 }, type: 'roshChodesh' }, // none if not leap year
	'rosh_chodesh_adar_ii': { name: 'Rosh Chodesh Adar II', start: { mm: AdarII, dd: 1 }, end: { mm: AdarII, dd: 1 }, type: 'roshChodesh' }, // none if not leap year
	'rosh_chodesh_adar': { name: 'Rosh Chodesh Adar', start: { mm: AdarII, dd: 1 }, end: { mm: AdarII, dd: 1 }, type: 'roshChodesh' }, // none if leap year
	'taanis_esther': { name: "Ta'anis Esther", start: { mm: AdarII, dd: 13 }, end: { mm: AdarII, dd: 13 }, type: 'fasts' }, // moved to thu if sat
	'purim': { name: 'Purim', start: { mm: AdarII, dd: 14 }, end: { mm: AdarII, dd: 14 }, type: 'major' },
	'shushan_purim': { name: 'Shushan Purim', start: { mm: AdarII, dd: 15 }, end: { mm: AdarII, dd: 15 }, type: 'minor' }, // moved to sun if sat
	'rosh_chodesh_nissan': { name: 'Rosh Chodesh Nissan', start: { mm: Nissan, dd: 1 }, end: { mm: Nissan, dd: 1 }, type: 'roshChodesh' },
	'yom_haaliyah': { name: 'Yom HaAliyah', start: { mm: Nissan, dd: 10 }, end: { mm: Nissan, dd: 10 }, type: 'modern' },
	'taanis_bechoros': { name: "Ta'anis Bechoros", start: { mm: Nissan, dd: 14 }, end: { mm: Nissan, dd: 14 }, type: 'fasts' }, // moved to thu if sat
	'pesach': { name: 'Pesach', start: { mm: Nissan, dd: 15 }, end: { mm: Nissan, dd: 22 }, type: 'major' },
	'yom_hashoah': { name: 'Yom HaShoah', start: { mm: Nissan, dd: 27 }, end: { mm: Nissan, dd: 27 }, type: 'modern' }, // moved to thu if fri, to mon if sun
	'rosh_chodesh_iyar': { name: 'Rosh Chodesh Iyar', start: { mm: Iyar, dd: 1 }, end: { mm: Iyar, dd: 1 }, type: 'roshChodesh' },
	'yom_hazikaron': { name: 'Yom HaZikaron', start: { mm: Iyar, dd: 4 }, end: { mm: Iyar, dd: 4 }, type: 'modern' }, // moved to mon if sun, to wed if thu, to wed if fri
	'yom_haatzmaut': { name: "Yom HaAtzma'ut", start: { mm: Iyar, dd: 5 }, end: { mm: Iyar, dd: 5 }, type: 'modern' }, // moved to tue if mon, to thu if fri, to thu if sat
	'pesach_sheni': { name: 'Pesach Sheni', start: { mm: Iyar, dd: 14 }, end: { mm: Iyar, dd: 14 }, type: 'minor' },
	'lag_bomer': { name: "Lag B'Omer", start: { mm: Iyar, dd: 18 }, end: { mm: Iyar, dd: 18 }, type: 'minor' },
	'yom_yerushalayim': { name: 'Yom Yerushalayim', start: { mm: Iyar, dd: 28 }, end: { mm: Iyar, dd: 28 }, type: 'modern' },
	'rosh_chodesh_sivan': { name: 'Rosh Chodesh Sivan', start: { mm: Sivan, dd: 1 }, end: { mm: Sivan, dd: 1 }, type: 'roshChodesh' },
	'shavuos': { name: 'Shavuos', start: { mm: Sivan, dd: 6 }, end: { mm: Sivan, dd: 7 }, type: 'major' },
	'rosh_chodesh_tammuz': { name: 'Rosh Chodesh Tammuz', start: { mm: Tammuz, dd: 1 }, end: { mm: Tammuz, dd: 1 }, type: 'roshChodesh' },
	'tzom_tammuz': { name: 'Tzom Tammuz', start: { mm: Tammuz, dd: 17 }, end: { mm: Tammuz, dd: 17 }, type: 'fasts' }, // moved to sun if sat
	'rosh_chodesh_av': { name: 'Rosh Chodesh Av', start: { mm: Av, dd: 1 }, end: { mm: Av, dd: 1 }, type: 'roshChodesh' },
	'tisha_bav': { name: "Tisha B'av", start: { mm: Av, dd: 9 }, end: { mm: Av, dd: 9 }, type: 'major' }, // moved to sun if sat
	'tu_bav': { name: "Tu B'av", start: { mm: Av, dd: 15 }, end: { mm: Av, dd: 15 }, type: 'minor' },
	'rosh_chodesh_elul': { name: 'Rosh Chodesh Elul', start: { mm: Elul, dd: 1 }, end: { mm: Elul, dd: 1 }, type: 'roshChodesh' },
	'shabbos_mevorchim_cheshvan': { name: 'Shabbos Mevorchim Cheshvan', start: { mm: Cheshvan, dd: 1 }, end: { mm: Cheshvan, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_kislev': { name: 'Shabbos Mevorchim Kislev', start: { mm: Kislev, dd: 1 }, end: { mm: Kislev, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_teves': { name: 'Shabbos Mevorchim Teves', start: { mm: Teves, dd: 1 }, end: { mm: Teves, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_shevat': { name: 'Shabbos Mevorchim Shevat', start: { mm: Shevat, dd: 1 }, end: { mm: Shevat, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_adar_i': { name: 'Shabbos Mevorchim Adar I', start: { mm: Adar, dd: 1 }, end: { mm: Adar, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_adar_ii': { name: 'Shabbos Mevorchim Adar II', start: { mm: AdarII, dd: 1 }, end: { mm: AdarII, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_adar': { name: 'Shabbos Mevorchim Adar', start: { mm: AdarII, dd: 1 }, end: { mm: AdarII, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_nissan': { name: 'Shabbos Mevorchim Nissan', start: { mm: Nissan, dd: 1 }, end: { mm: Nissan, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_iyar': { name: 'Shabbos Mevorchim Iyar', start: { mm: Iyar, dd: 1 }, end: { mm: Iyar, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_sivan': { name: 'Shabbos Mevorchim Sivan', start: { mm: Sivan, dd: 1 }, end: { mm: Sivan, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_tammuz': { name: 'Shabbos Mevorchim Tammuz', start: { mm: Tammuz, dd: 1 }, end: { mm: Tammuz, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_av': { name: 'Shabbos Mevorchim Av', start: { mm: Av, dd: 1 }, end: { mm: Av, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_mevorchim_elul': { name: 'Shabbos Mevorchim Elul', start: { mm: Elul, dd: 1 }, end: { mm: Elul, dd: 1 }, type: 'shabbosMevorchim' }, // before rc
	'shabbos_shekalim': { name: 'Shabbos Shekalim', start: { mm: AdarII, dd: 1 }, end: { mm: AdarII, dd: 1 }, type: 'specialShabbos' }, // on or before rc adar
	'shabbos_zachor': { name: 'Shabbos Zachor', start: { mm: AdarII, dd: 14 }, end: { mm: AdarII, dd: 14 }, type: 'specialShabbos' }, // before purim
	'shabbos_parah': { name: 'Shabbos Parah', start: { mm: AdarII, dd: 23 }, end: { mm: AdarII, dd: 23 }, type: 'specialShabbos' }, // shabbos before or on shabbos before rc nissan
	'shabbos_hachodesh': { name: 'Shabbos HaChodesh', start: { mm: Nissan, dd: 1 }, end: { mm: Nissan, dd: 1 }, type: 'specialShabbos' }, // on or before rc nissan
	'shabbos_hagadol': { name: 'Shabbos HaGadol', start: { mm: Nissan, dd: 15 }, end: { mm: Nissan, dd: 15 }, type: 'specialShabbos' }, // before pesach
	'shabbos_chazon': { name: 'Shabbos Chazon', start: { mm: Av, dd: 9 }, end: { mm: Av, dd: 9 }, type: 'specialShabbos' }, // before tisha b'av
	'shabbos_nachamu': { name: 'Shabbos Nachamu', start: { mm: Av, dd: 16 }, end: { mm: Av, dd: 16 }, type: 'specialShabbos' }, // after tisha b'av
	'shabbos_shira': { name: 'Shabbos Shira', start: { mm: Shevat, dd: 15 }, end: { mm: Shevat, dd: 15 }, type: 'specialShabbos' }, // on or before tu bishvat
	'shabbos_shuva': { name: 'Shabbos Shuva', start: { mm: Tishrei, dd: 8 }, end: { mm: Tishrei, dd: 8 }, type: 'specialShabbos' }, // shabbos after rh
	'leil_selichos': { name: 'Leil Selichos', start: { mm: Elul, dd: 30 }, end: { mm: Elul, dd: 30 }, type: 'minor' }, // shabbos before rh (or week before if rh is mon/tue)
	// 'hoshanah_rabbah': { name: 'Hoshanah Rabbah', start: { mm: Tishrei, dd: 21}, end: { mm: Tishrei, dd: 21}, type: 'major' },
	// 'ben_gurion_day': { name: 'Ben-Gurion Day', start: { mm: Kislev, dd: 6}, end: { mm: Kislev, dd: 6}, type: 'modern' },
	// 'rabin_day': { name: 'Rabin Day', start: { mm: Cheshvan, dd: 12}, end: { mm: Cheshvan, dd: 12}, type: 'modern' },
	// 'herzl_day': { name: 'Herzl Day', start: { mm: Iyar, dd: 10}, end: { mm: Iyar, dd: 10}, type: 'modern' },
	// 'jabotinsky_day': { name: 'Jabotinsky Day', start: { mm: Tammuz, dd: 29}, end: { mm: Tammuz, dd: 29}, type: 'modern' },
	'rebbe_recovers_from_illness': { name: 'The Rebbe recovers from illness', start: { mm: Kislev, dd: 1 }, end: { mm: Kislev, dd: 1 }, type: 'chabad' },
	'birthday_and_passing_of_rabbi_dovber_of_lubavitch': { name: 'Birthday and Passing of Rabbi DovBer of Lubavitch', start: { mm: Kislev, dd: 9 }, end: { mm: Kislev, dd: 9 }, type: 'chabad' },
	'liberation_of_rabbi_dovber_of_lubavitch': { name: 'Liberation of Rabbi DovBer of Lubavitch', start: { mm: Kislev, dd: 10 }, end: { mm: Kislev, dd: 10 }, type: 'chabad' },
	'liberation_of_rabbi_schneur_zalman_of_liadi': { name: 'Liberation of Rabbi Schneur Zalman of Liadi', start: { mm: Kislev, dd: 19 }, end: { mm: Kislev, dd: 20 }, type: 'chabad' },
	'sefarim_victory': { name: 'Sefarim Victory', start: { mm: Teves, dd: 5 }, end: { mm: Teves, dd: 5 }, type: 'chabad' },
	'yahrtzeit_of_rabbi_yosef_yitzchak_schneersohn': { name: "Yahrtzeit of Rabbi Yosef Yitzchak Schneersohn and Beginning of Rebbe's Leadership", start: { mm: Shevat, dd: 10 }, end: { mm: Shevat, dd: 10 }, type: 'chabad' },
	'passing_of_rebbetzin_chaya_mushka_schneerson': { name: 'Passing of the Rebbetzin Chaya Mushka Schneerson', start: { mm: Shevat, dd: 22 }, end: { mm: Shevat, dd: 22 }, type: 'chabad' },
	'birthday_of_lubavitcher_rebbe': { name: 'Birthday of the Lubavitcher Rebbe, Rabbi Menachem M. Schneerson', start: { mm: Nissan, dd: 11 }, end: { mm: Nissan, dd: 11 }, type: 'chabad' },
	'birthday_of_rabbi_shmuel_of_lubavitch': { name: 'Birthday of Rabbi Shmuel of Lubavitch', start: { mm: Iyar, dd: 2 }, end: { mm: Iyar, dd: 2 }, type: 'chabad' },
	'yahrtzeit_of_lubavitcher_rebbe': { name: 'Yahrtzeit of the Lubavitcher Rebbe, Rabbi Menachem M. Schneerson', start: { mm: Tammuz, dd: 3 }, end: { mm: Tammuz, dd: 3 }, type: 'chabad' },
	'liberation_of_rabbi_yosef_yitzchak_of_lubavitch': { name: 'Liberation of Rabbi Yosef Yitzchak of Lubavitch', start: { mm: Tammuz, dd: 12 }, end: { mm: Tammuz, dd: 13 }, type: 'chabad' },
	'birthday_of_rabbi_schneur_zalman_of_liadi': { name: 'Birthday of Rabbi Schneur Zalman of Liadi', start: { mm: Elul, dd: 18 }, end: { mm: Elul, dd: 18 }, type: 'chabad' },
};

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
 */

/**
 * @typedef {Object} HolidayOptions
 * @property {number} [gregorianYear] - The Gregorian year to calculate holidays for
 * @property {number} [hebrewYear] - The Hebrew year to calculate holidays for
 * @property {import('@hebcal/core').HDate} [startDate] - The start date to calculate holidays for 1 year from
 * @property {HolidayFlags} [types] - The types of holidays to calculate
 */

/**
 * @typedef {Object} HolidayResult
 * @property {string} name - The name of the holiday
 * @property {string} type - The type of holiday
 * @property {string} date - The date of the holiday in YYYY-MM-DD format
 * @property {number} gregorianYear - The Gregorian year of the holiday
 * @property {string} gregorianStart - The start date of the holiday in Gregorian format
 * @property {string} gregorianEnd - The end date of the holiday in Gregorian format
 * @property {number} hebrewYear - The Hebrew year of the holiday
 * @property {string} hebrewStart - The start date of the holiday in Hebrew format
 * @property {string} hebrewEnd - The end date of the holiday in Hebrew format
 * @property {number} hebrewMonth - The Hebrew month of the holiday
 * @property {number} hebrewDay - The Hebrew day of the holiday
 * @property {string} html - The HTML for the holiday
 * @property {string} titleHTML - The HTML for the holiday title
 * @property {string} gregorianDateHTML - The HTML for the Gregorian date
 * @property {string} hebrewDateHTML - The HTML for the Hebrew date
 */

/**
 * Calculate holidays for a given year
 *
 * @param {HolidayOptions} [options] - The options for the calculation
 * @returns {HolidayResult[]} An array of holiday details
 */
export function getHolidays({ gregorianYear = undefined, hebrewYear = undefined, startDate = undefined, types = {} } = {}) {
	if ([gregorianYear, hebrewYear, startDate].filter((x) => x !== undefined).length > 1) {
		throw new Error('Only one of gregorianYear, hebrewYear, or startDate can be specified.');
	} else if ([gregorianYear, hebrewYear, startDate].filter((x) => x !== undefined).length === 0) {
		throw new Error('One of gregorianYear, hebrewYear, or startDate must be specified.');
	}

	/** @type {HolidayResult[]} */
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
		for (const [hID, holiday] of Object.entries(HOLIDAY_DETAILS)) {
			let holidayType = holiday.type;
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
					if (hID == 'pesach' || hID == 'shavuos') {
						--endDate; // end 1 day early
					}
					// Simchas Torah in Israel
					else if (hID == 'simchas_torah') {
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
				if (holidayType == 'shabbosMevorchim' || hID == "leil_selichos" || holidayType == 'specialShabbos') {
					// shabbos mevorchim, leil selichos, special shabbatot
					if (!((hID == 'shabbos_shekalim' || hID == 'shabbos_parah' || hID == 'shabbos_hachodesh' || hID == 'shabbos_shira' || hID == 'shabbos_shuva' || hID == 'shabbos_chazon' || hID == 'shabbos_nachamu') && gSDate.getDay() == 6)) {
						// if date is shabbos and can be same date, don't subtract
						const oldGSDate = gSDate;
						gSDate = getLastSaturday(gSDate);
						if (hID == 'leil_selichos' && (oldGSDate.getDay() == 1 || oldGSDate.getDay() == 2)) {
							// leil selichos - if rh is mon/tue subtract extra week
							gSDate = getLastSaturday(gSDate);
						}
						oneDay = true;
						gEDate = gSDate;
					}
				} else if ((hID == 'tzom_gedaliah' || hID == 'shushan_purim' || hID == 'tzom_tammuz' || hID == 'tisha_bav') && gSDate.getDay() == 6) {
					// if Sat. & tzom gedaliah, shushan purim, tzom tammuz, tisha b'av
					gSDate.setDate(gSDate.getDate() + 1); // move to Sun.
					gEDate = gSDate;
				} else if ((hID == 'taanis_esther' || hID == 'taanis_bechoros') && gSDate.getDay() == 6) {
					// if Sat. & taanis esther, bechoros
					gSDate.setDate(gSDate.getDate() - 2); // move to Thu.
					gEDate = gSDate;
				} else if (hID == 'yom_hashoah') {
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
				} else if (hID == 'yom_hazikaron') {
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
				} else if (hID == 'yom_haatzmaut') {
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
				let wrongRoshChodeshAdar = ((7 * year + 1) % 19 < 7 && (hID == 'rosh_chodesh_adar' || hID == 'shabbos_mevorchim_adar')) || ((7 * year + 1) % 19 >= 7 && (hID == 'rosh_chodesh_adar_i' || hID == 'rosh_chodesh_adar_ii' || hID == 'shabbos_mevorchim_adar_i' || hID == 'shabbos_mevorchim_adar_ii'));
				let eveningDate = new Date(gSDate);
				let beginsHTML = '';
				let beginsText = '';
				if (holidayType != 'fasts') {
					eveningDate.setDate(eveningDate.getDate() - 1);
					beginsHTML = `Begins in the evening of ${formatHtmlBold(dayjs(eveningDate).format('ddd, MMM D'))}`;
					beginsText = `Begins in the evening of ${dayjs(eveningDate).format('ddd, MMM D')}`;
				} else {
					beginsHTML = `Begins at dawn of ${formatHtmlBold(dayjs(gSDate).format('ddd, MMM D'))}`;
					beginsText = `Begins at dawn of ${dayjs(gSDate).format('ddd, MMM D')}`;
				}
				const endsHTML = `<br />Ends in the evening of ${formatHtmlBold(dayjs(gEDate).format('ddd, MMM D'))}`;
				const endsText = `Ends in the evening of ${dayjs(gEDate).format('ddd, MMM D')}`;
				const gregorianYear = formatGregorianYear(Number(dayjs(gSDate).format('YYYY')));
				if (!wrongRoshChodeshAdar) {
					const titleColumnHTML = `<b>${name}</b><br />${gregorianYear} / ${hebrewYear}`;
					const gregorianDateColumnHTML = `${beginsHTML}${endsHTML}`;
					let hebrewDateColumnHTML = `Begins on ${formatHtmlBold(startDateHebrew.displayEn.replace(/, \d+$/, ""))}<br />Ends on ${formatHtmlBold(endDateHebrew.displayEn.replace(/, \d+$/, ""))}`;
					if (oneDay) {
						hebrewDateColumnHTML = `${formatHtmlBold(startDateHebrew.displayEn.replace(/, \d+$/, ""))}`;
					}
					const outputHTML = `<div class="row g-3"><div class="col-4 fw-bold">${titleColumnHTML}</div><div class="col-4">${gregorianDateColumnHTML}</div><div class="col-4">${hebrewDateColumnHTML}</div></div>`;
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
						titleHTML: titleColumnHTML,
						gregorianDateHTML: gregorianDateColumnHTML,
						hebrewDateHTML: hebrewDateColumnHTML,
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
			return output.date >= startDateGreg && output.date <= nextYearYMD;
		}
	});

	return holidayOutput;
}

/**
 * Format a date for display in HTML (bold and replace spaces with non-breaking spaces)
 * @param {string} date - The date to format
 * @returns {string} - The formatted date
 */
export function formatHtmlBold(date) {
	return `<b>${date.toString().replaceAll(" ", "&nbsp;")}</b>`;
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
