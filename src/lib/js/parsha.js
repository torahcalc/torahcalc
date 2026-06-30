import { HDate, Locale, Sedra } from '@hebcal/core';
import dayjs from 'dayjs';
import { formatHebrewDateEn } from './dateconverter';
import { formatDate } from './utils';

/**
 * @typedef {Object} ParshaResult
 * @property {string} date - The Gregorian date of the Shabbat the parsha is read, in YYYY-MM-DD format.
 * @property {string} formattedDate - The Gregorian date of the Shabbat formatted as `ddd, MMMM D, YYYY`.
 * @property {string} hebrewDate - The Hebrew date of the Shabbat in English format.
 * @property {string} parsha - The transliterated name of the parsha or holiday reading (e.g. `Beha'alotcha`, `Matot-Masei`, or `Shavuot`).
 * @property {string} hebrewParsha - The Hebrew name of the parsha or holiday reading (e.g. `בְּהַעֲלֹתְךָ`, `מַטּוֹת־מַסְעֵי`, or `שָׁבוּעוֹת`).
 * @property {string[]} parshaNames - The individual transliterated parsha name(s) (e.g. `['Matot', 'Masei']`).
 * @property {number|number[]|undefined} num - The 1-indexed parsha number, or an array of numbers for a doubled parsha. `undefined` for a holiday reading.
 * @property {boolean} isDoubled - Whether the parsha is a doubled parsha (e.g. `Matot-Masei`).
 * @property {boolean} isHoliday - Whether the Shabbat reading is a holiday reading rather than a regular parsha (e.g. when Shavuot falls on Shabbat).
 * @property {boolean} il - Whether the Israel reading schedule was used (`false` for Diaspora).
 */

/**
 * Calculate the weekly Torah portion (parsha) for a given date.
 *
 * If the date is not a Saturday, the reading of the following Shabbat is returned. If that
 * Shabbat coincides with a holiday (for example when Shavuot falls on Shabbat), the holiday
 * reading is returned instead of a regular parsha.
 *
 * @param {string} date - The Gregorian date in YYYY-MM-DD format.
 * @param {boolean} [il=false] - Whether to use the Israel reading schedule (`false` for Diaspora).
 * @returns {ParshaResult} The parsha for the given date.
 */
export function calculateParsha(date, il = false) {
	const inputDate = dayjs(date);
	if (!inputDate.isValid()) {
		throw new Error('Invalid date.');
	}
	const shabbat = new HDate(inputDate.toDate()).onOrAfter(6);
	const sedra = new Sedra(shabbat.getFullYear(), il);
	const result = sedra.lookup(shabbat);
	const greg = shabbat.greg();
	const parshaNames = result.parsha;
	return {
		date: dayjs(greg).format('YYYY-MM-DD'),
		formattedDate: formatDate(greg.getFullYear(), greg.getMonth() + 1, greg.getDate()),
		hebrewDate: formatHebrewDateEn(shabbat),
		parsha: parshaNames.join('-'),
		hebrewParsha: parshaNames.map((name) => Locale.gettext(name, 'he')).join('־'),
		parshaNames,
		num: result.num,
		isDoubled: Array.isArray(result.num),
		isHoliday: result.chag === true,
		il,
	};
}
