import dayjs from 'dayjs';
import { dateToHDate } from './utils';
import { formatHebrewDateEn, hebrewMonthMap } from './dateconverter';

/**
 * Hebcal month numbers mapped to zodiac sign names.
 *
 * @type {{ [key: number]: { latin: string, hebrewTransliterated: string, hebrew: string, symbol: string } }}
 */
const ZODIAC_MAPPING = {
	// Nissan
	1: {
		latin: 'Aries',
		hebrewTransliterated: 'Taleh',
		hebrew: 'טלה',
		symbol: '♈',
	},
	// Iyar
	2: {
		latin: 'Taurus',
		hebrewTransliterated: 'Shor',
		hebrew: 'שור',
		symbol: '♉',
	},
	// Sivan
	3: {
		latin: 'Gemini',
		hebrewTransliterated: 'Teomim',
		hebrew: 'תאומים',
		symbol: '♊',
	},
	// Tammuz
	4: {
		latin: 'Cancer',
		hebrewTransliterated: 'Sartan',
		hebrew: 'סרטן',
		symbol: '♋',
	},
	// Av
	5: {
		latin: 'Leo',
		hebrewTransliterated: 'Aryeh',
		hebrew: 'אריה',
		symbol: '♌',
	},
	// Elul
	6: {
		latin: 'Virgo',
		hebrewTransliterated: 'Betulah',
		hebrew: 'בתולה',
		symbol: '♍',
	},
	// Tishrei
	7: {
		latin: 'Libra',
		hebrewTransliterated: 'Moznayim',
		hebrew: 'מאזניים',
		symbol: '♎',
	},
	// Cheshvan
	8: {
		latin: 'Scorpio',
		hebrewTransliterated: 'Akrav',
		hebrew: 'עקרב',
		symbol: '♏',
	},
	// Kislev
	9: {
		latin: 'Sagittarius',
		hebrewTransliterated: 'Keshet',
		hebrew: 'קשת',
		symbol: '♐',
	},
	// Teves
	10: {
		latin: 'Capricorn',
		hebrewTransliterated: 'Gedi',
		hebrew: 'גדי',
		symbol: '♑',
	},
	// Shevat
	11: {
		latin: 'Aquarius',
		hebrewTransliterated: "D'li",
		hebrew: 'דלי',
		symbol: '♒',
	},
	// Adar, Adar I, Adar II
	12: {
		latin: 'Pisces',
		hebrewTransliterated: 'Dagim',
		hebrew: 'דגים',
		symbol: '♓',
	},
};

/**
 * @typedef {Object} ZodiacResult
 * @property {string} date - The Gregorian date in YYYY-MM-DD format.
 * @property {string} hebrewDate - The Hebrew date in English format.
 * @property {string} month - The Hebrew month name.
 * @property {string} latin - The Latin zodiac sign name.
 * @property {string} hebrewTransliterated - The Hebrew zodiac sign name transliterated into English.
 * @property {string} hebrew - The Hebrew zodiac sign name in Hebrew.
 * @property {string} symbol - The zodiac sign unicode symbol.
 */

/**
 * Calculate the Hebrew zodiac sign for a given date.
 * @param {string} date - The date to calculate the zodiac for in YYYY-MM-DD format.
 * @returns {ZodiacResult} The zodiac sign for the given date.
 */
export function calculateZodiac(date) {
	const hDate = dateToHDate(dayjs(date).toDate());
	return calculateZodiacHebrewDate(hDate);
}

/**
 * Calculate the Hebrew zodiac sign for a given Hebrew date.
 * @param {import('@hebcal/core').HDate} hDate - The Hebrew date to calculate the zodiac for.
 * @returns {ZodiacResult} The zodiac sign for the given Hebrew date.
 */
export function calculateZodiacHebrewDate(hDate) {
	const monthIndex = Math.min(hDate.getMonth(), 12); // If 13 (Adar II), use 12 (Adar)
	return {
		date: dayjs(hDate.greg()).format('YYYY-MM-DD'),
		hebrewDate: formatHebrewDateEn(hDate),
		month: hebrewMonthMap[monthIndex],
		...ZODIAC_MAPPING[monthIndex],
	};
}
