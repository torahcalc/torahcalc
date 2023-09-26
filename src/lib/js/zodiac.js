import dayjs from 'dayjs';
import { dateToHDate } from './utils';

/**
 * Hebcal month numbers mapped to zodiac sign names.
 *
 * @type {{ [key: number]: { latin: string, hebrewTransliterated: string, hebrew: string } }}
 */
const ZODIAC_MAPPING = {
	// Nissan
	1: {
		latin: 'Aries',
		hebrewTransliterated: 'Taleh',
		hebrew: 'טלה',
	},
	// Iyar
	2: {
		latin: 'Taurus',
		hebrewTransliterated: 'Shor',
		hebrew: 'שור',
	},
	// Sivan
	3: {
		latin: 'Gemini',
		hebrewTransliterated: 'Teomim',
		hebrew: 'תאומים',
	},
	// Tammuz
	4: {
		latin: 'Cancer',
		hebrewTransliterated: 'Sartan',
		hebrew: 'סרטן',
	},
	// Av
	5: {
		latin: 'Leo',
		hebrewTransliterated: 'Aryeh',
		hebrew: 'אריה',
	},
	// Elul
	6: {
		latin: 'Virgo',
		hebrewTransliterated: 'Betulah',
		hebrew: 'בתולה',
	},
	// Tishrei
	7: {
		latin: 'Libra',
		hebrewTransliterated: 'Moznayim',
		hebrew: 'מאזניים',
	},
	// Cheshvan
	8: {
		latin: 'Scorpio',
		hebrewTransliterated: 'Akrav',
		hebrew: 'עקרב',
	},
	// Kislev
	9: {
		latin: 'Sagittarius',
		hebrewTransliterated: 'Keshet',
		hebrew: 'קשת',
	},
	// Teves
	10: {
		latin: 'Capricorn',
		hebrewTransliterated: 'Gedi',
		hebrew: 'גדי',
	},
	// Shevat
	11: {
		latin: 'Aquarius',
		hebrewTransliterated: "D'li",
		hebrew: 'דלי',
	},
	// Adar
	12: {
		latin: 'Pisces',
		hebrewTransliterated: 'Dagim',
		hebrew: 'דגים',
	},
	// Adar II
	13: {
		latin: 'Pisces',
		hebrewTransliterated: 'Dagim',
		hebrew: 'דגים',
	},
};

/**
 * Calculate the Hebrew zodiac sign for a given date.
 * @param {string} date - The date to calculate the zodiac for in YYYY-MM-DD format.
 * @returns {{ [key: string]: string }} - The zodiac sign for the given date.
 */
export function calculateZodiac(date) {
	const hDate = dateToHDate(dayjs(date).toDate());
	return {
		date: dayjs(date).format('YYYY-MM-DD'),
		hebrewDate: hDate.render('en'),
		latin: ZODIAC_MAPPING[hDate.getMonth()].latin,
		hebrewTransliterated: ZODIAC_MAPPING[hDate.getMonth()].hebrewTransliterated,
		hebrew: ZODIAC_MAPPING[hDate.getMonth()].hebrew,
	};
}
