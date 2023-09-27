import { HDate } from '@hebcal/core';
import dayjs from 'dayjs';
import { gregorianToHebrew, hebrewToGregorian } from './dateconverter';
import { formatDate } from './utils';

/**
 * @typedef {Object} Omer
 * @property {string} day - The Gregorian date in the format `ddd, MMMM D, YYYY`
 * @property {string} night - The Gregorian date of the previous evening in the format `Evening of ddd, MMMM D, YYYY`
 * @property {number} dayOfOmer - The day of the Omer
 * @property {string} hebrewDate - The Hebrew date
 * @property {string} sefiraEn - The sefirah in English
 * @property {string} sefiraHe - The sefirah in Hebrew
 * @property {string} formulaEn - The formula in English
 * @property {string} formulaHe - The formula in Hebrew
 */

/**
 * Calculate the Omer count for a given Gregorian year
 * @param {number} year - The Gregorian year
 * @returns {Record<string, Omer>} - The Omer count
 */
export function calculateOmerYear(year) {
	const hebrewYear = gregorianToHebrew({ year, month: 4, day: 1 }).year;
	const firstDayOfOmer = new HDate(15, 1, hebrewYear);
	const firstDayOfOmerGreg = dayjs(firstDayOfOmer.greg());
	/** @type {Record<string, Omer>} */
	const omer = {};
	for (let dayNum = 1; dayNum < 50; dayNum++) {
		const day = firstDayOfOmerGreg.add(dayNum, 'day');
		const night = day.subtract(1, 'day');
		const dayHeb = gregorianToHebrew({ year: day.year(), month: day.month() + 1, day: day.date() });
		const ymd = day.format('YYYY-MM-DD');
		omer[ymd] = {
			night: `Evening of ${formatDate(night.year(), night.month() + 1, night.date())}`,
			day: formatDate(day.year(), day.month() + 1, day.date()),
			dayOfOmer: dayNum,
			hebrewDate: dayHeb.displayEn,
			sefiraEn: getSefirah(dayNum, 'en'),
			sefiraHe: getSefirah(dayNum, 'he'),
			formulaEn: getFullFormula(dayNum, 'en'),
			formulaHe: getFullFormula(dayNum, 'he'),
		};
	}
	return omer;
}

/**
 * Calculate the Omer count for a given Gregorian date in the format `YYYY-MM-DD`
 * @param {string} date - The Gregorian date
 * @returns {{ dayCount: Omer|null, nightCount: Omer|null }} - The Omer count for the day (counted from the previous evening) and the night (counted from the current evening)
 */
export function calculateOmerDate(date) {
	const day = dayjs(date);
	const year = day.year();
	const omerYear = calculateOmerYear(year);
	const dayCount = omerYear[date] || null;
	const nightCount = omerYear[day.add(1, 'day').format('YYYY-MM-DD')] || null;
	return { dayCount, nightCount };
}

/**
 * Calculates the Omer count for a given Hebrew year, month, and day
 * @param {number} year - The Hebrew year
 * @param {number} month - The Hebrew month
 * @param {number} day - The Hebrew day
 * @returns {{ count: Omer|null }} - The Omer count for the day (counted from the previous evening) and the night (counted from the current evening)
 */
export function calculateOmerHebrew(year, month, day) {
	const gregorianDate = dayjs(hebrewToGregorian({ year, month, day }).date);
	const omer = calculateOmerDate(gregorianDate.format('YYYY-MM-DD'));
	return {
		count: omer.dayCount,
	};
}

/**
 * Get sefirah for a given day
 * @param {number} num - The day number
 * @param {string} [lang='en'] - The language to return the sefirah in
 * @returns {string} - The sefirah (eg. "Chesed ShebiChesed" or "חֶסֶד שֶׁבְּחֶסֶד")
 */
function getSefirah(num, lang = 'en') {
	/** @type {Record<number, { en: string, he: string }>} */
	const daySefiros = {
		0: { en: 'Chesed', he: 'חֶסֶד' },
		1: { en: 'Gevurah', he: 'גְּבוּרָה' },
		2: { en: 'Tiferet', he: 'תִּפְאֶרֶת' },
		3: { en: 'Netzach', he: 'נֶצַח' },
		4: { en: 'Hod', he: 'הוֹד' },
		5: { en: 'Yesod', he: 'יְסוֹד' },
		6: { en: 'Malchut', he: 'מַלְכוּת' },
	};
	/** @type {Record<number, { en: string, he: string }>} */
	const weekSefiros = {
		0: { en: 'ShebiChesed', he: 'שֶׁבְּחֶסֶד' },
		1: { en: 'ShebiGevurah', he: 'שֶׁבְּגְּבוּרָה' },
		2: { en: 'ShebiTiferet', he: 'שֶׁבְּתִּפְאֶרֶת' },
		3: { en: 'ShebiNetzach', he: 'שֶׁבְּנֶצַח' },
		4: { en: 'ShebiHod', he: 'שֶׁבְּהוֹד' },
		5: { en: 'ShebiYesod', he: 'שֶׁבְּיְסוֹד' },
		6: { en: 'ShebiMalchut', he: 'שֶׁבְּמַלְכוּת' },
	};
	const dayNum = (num - 1) % 7;
	const weekNum = Math.floor((num - 1) / 7);
	const daySefirah = daySefiros[dayNum];
	const weekSefirah = weekSefiros[weekNum];
	return lang === 'en' ? `${daySefirah.en} ${weekSefirah.en}` : `${daySefirah.he} ${weekSefirah.he}`;
}

/**
 * Get the formula for the night count (eg. "Today is 8 days, which are 1 week and 1 day, of the Omer.")
 * @param {number} num - The night number
 * @param {string} [lang='en'] - The language to return the formula in
 * @returns {string} - The formula
 */
function getFullFormula(num, lang = 'en') {
	const dayNum = num % 7;
	const weekNum = Math.floor(num / 7);
	// english formula
	if (lang === 'en') {
		let formula = 'Today is ' + inWordsEn(num);
		formula += num != 1 ? ' days' : ' day';
		formula += num > 6 ? ', which are ' : ' of the Omer.';
		if (!formula.includes('.')) {
			formula += inWordsEn(weekNum);
			formula += weekNum != 1 ? ' weeks' : ' week';
			formula += dayNum != 0 ? ' and ' : ', of the Omer.';
			if (!formula.includes('.')) {
				formula += inWordsEn(dayNum);
				formula += dayNum != 1 ? ' days, of the Omer.' : ' day, of the Omer.';
			}
		}
		return formula;
	}
	// hebrew formula
	let hebFormula = 'הַיוֹם ';
	hebFormula += num == 1 ? 'יוֹם ' : '';
	hebFormula += inWordsHe(num);
	if (num != 1) hebFormula += num >= 2 && num <= 10 ? ' יָמִים' : ' יוֹם';
	hebFormula += num > 6 ? ', שֶהֵם' : ' לָעוֹמֶר.';
	if (!hebFormula.includes('.')) {
		hebFormula += weekNum != 1 ? ' ' : ' שָבְוּעַ ';
		hebFormula += inWordsHe(weekNum);
		hebFormula += weekNum != 1 ? ' שָבוּעוֹת' : '';
		let vavChar = ' וְ';
		if (dayNum == 2 || dayNum == 3) vavChar = ' וּ';
		else if (dayNum == 5) vavChar = ' וַ';
		hebFormula += dayNum != 0 ? vavChar : ', לָעוֹמֶר.';
		if (!hebFormula.includes('.')) {
			hebFormula += dayNum == 1 ? 'יוֹם ' : '';
			hebFormula += inWordsHe(dayNum);
			hebFormula += dayNum >= 2 && dayNum <= 10 ? ' יָמִים, לָעוֹמֶר.' : ', לָעוֹמֶר.';
		}
	}
	return hebFormula;
}

/**
 * Convert a number to words
 * @param {number} num - The day number to convert (1-49)
 * @returns {string} - The words
 */
function inWordsEn(num) {
	const singles = [
		'',
		'one ',
		'two ',
		'three ',
		'four ',
		'five ',
		'six ',
		'seven ',
		'eight ',
		'nine ',
		'ten ',
		'eleven ',
		'twelve ',
		'thirteen ',
		'fourteen ',
		'fifteen ',
		'sixteen ',
		'seventeen ',
		'eighteen ',
		'nineteen ',
	];
	const tens = ['', '', 'twenty', 'thirty', 'forty'];
	const digits = num.toString().padStart(2, '0');
	const d1 = Number(digits[0]);
	const d2 = Number(digits[1]);
	let str = '';
	if (d1 > 1) {
		str += tens[d1] + ' ';
	}
	if (d1 == 1) {
		str += singles[d1 * 10 + d2];
	} else {
		str += singles[d2];
	}
	return str.trim().replace(/\s+/g, '-');
}

/**
 * Convert a number to Hebrew words
 * @param {number} num - The day number to convert
 * @returns {string} - The Hebrew words
 */
function inWordsHe(num) {
	const singles = [
		'',
		'אֶחַד ',
		'שְׁנֵי ',
		'שְׁלוֹשָׁה ',
		'אַרְבָּעָה ',
		'חֲמִשָׁה ',
		'שִׁשָּׁה ',
		'שִׁבְעַה ',
		'שְׁמוֹנָה ',
		'תִּשְׁעָה ',
		'עֲשָׂרָה ',
		'אֲחַד-עָשָׂר ',
		'שְׁנֵים-עָשָׂר ',
		'שְׁלוֹשָה-עָשָׂר ',
		'אַרְבָּעָה-עָשָׂר ',
		'חֲמִישָׁה-עָשָׂר ',
		'שִׁשָה-עָשָׂר ',
		'שִׁבְעָה-עָשָׂר ',
		'שְׁמוֹנָה-עָשָׂר ',
		'תִּשְׁעָה-עָשָׂר ',
	];
	const tens = ['', '', 'עֶשְׂרִים', 'שְׁלוֹשִׁים', 'אַרְבָּעִים'];
	const digits = num.toString().padStart(2, '0');
	const d1 = Number(digits[0]);
	const d2 = Number(digits[1]);
	let str = '';
	const andVav = d1 == 3 ? ' וּ' : ' וְ';
	singles[2] = d1 > 1 ? 'שְׁנַיִם ' : 'שְׁנֵי ';
	str += singles[Number(digits)] || singles[d2] + andVav + tens[d1];
	str = str[str.length - 1] == 'ְ' ? str.substring(0, str.length - 2) : str;
	str = str.charAt(1) == 'ו' ? str.substring(3, str.length) : str;
	str = str.charAt(1) == 'וּ' ? str.substring(2, str.length) : str;
	return str.trim().replace(/\s+/g, ' ');
}
