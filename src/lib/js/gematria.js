import { COMMON_WORDS } from './words/commonwords';
import { TORAH_WORDS } from './words/torahwords';
import { BEREISHIS_PESUKIM } from './words/pesukim1';
import { SHEMOS_PESUKIM } from './words/pesukim2';
import { VAYIKRA_PESUKIM } from './words/pesukim3';
import { BAMIDBAR_PESUKIM } from './words/pesukim4';
import { DEVARIM_PESUKIM } from './words/pesukim5';

/**
 * Gematria methods
 *
 * Each method is an array of 27 numbers, one for each letter of the hebrew alphabet (including final forms) in the order of alef to tav.
 *
 * Note: Some methods that are calculated from other methods (e.g. musafi, neelam, haachor, hamerubah_haklali, katan_mispari, kolel) are not included in this list.
 */
export const METHODS = {
	hechrachi: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 20, 30, 40, 40, 50, 50, 60, 70, 80, 80, 90, 90, 100, 200, 300, 400],
	gadol: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 500, 20, 30, 600, 40, 700, 50, 60, 70, 800, 80, 900, 90, 100, 200, 300, 400],
	siduri: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 23, 11, 12, 24, 13, 25, 14, 15, 16, 26, 17, 27, 18, 19, 20, 21, 22],
	katan: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 2, 3, 4, 4, 5, 5, 6, 7, 8, 8, 9, 9, 1, 2, 3, 4],
	perati: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 400, 400, 900, 1600, 1600, 2500, 2500, 3600, 4900, 6400, 6400, 8100, 8100, 10000, 40000, 90000, 160000],
	atbash: [400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 30, 20, 10, 10, 9, 9, 8, 7, 6, 6, 5, 5, 4, 3, 2, 1],
	albam: [30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 400, 1, 2, 2, 3, 3, 4, 5, 6, 6, 7, 7, 8, 9, 10, 20],
	kidmi: [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 75, 75, 105, 145, 145, 195, 195, 255, 325, 405, 405, 495, 495, 595, 795, 1095, 1495],
	meshulash: [1, 8, 27, 64, 125, 216, 343, 512, 729, 1000, 8000, 8000, 27000, 64000, 64000, 125000, 125000, 216000, 343000, 512000, 512000, 729000, 729000, 1000000, 8000000, 27000000, 64000000],
	mispari: [13, 760, 636, 273, 348, 600, 372, 401, 770, 570, 620, 620, 686, 323, 323, 408, 408, 660, 422, 446, 446, 820, 820, 46, 501, 1083, 720],
	achbi: [20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 400, 300, 300, 200, 200, 100, 90, 80, 80, 70, 70, 60, 50, 40, 30],
	atbach: [9, 8, 7, 6, 5, 4, 3, 2, 1, 90, 500, 80, 70, 400, 60, 300, 50, 40, 30, 200, 20, 100, 10, 900, 800, 700, 600],
	ayakbakar: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 5, 200, 300, 6, 400, 7, 500, 600, 700, 8, 800, 9, 900, 1, 2, 3, 4],
	ofanim: [80, 400, 30, 400, 1, 6, 50, 400, 400, 4, 80, 80, 4, 40, 40, 50, 50, 20, 50, 1, 1, 10, 10, 80, 300, 50, 6],
	achasbeta: [8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 90, 100, 200, 200, 300, 300, 1, 2, 3, 3, 4, 4, 5, 6, 7, 400],
	avgad: [2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 30, 40, 50, 50, 60, 60, 70, 80, 90, 90, 100, 100, 200, 300, 400, 1],
	reverse_avgad: [400, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 20, 30, 30, 40, 40, 50, 60, 70, 70, 80, 80, 90, 100, 200, 300],
	shemi: [111, 412, 83, 434, 6, 12, 67, 418, 419, 20, 100, 100, 74, 80, 80, 106, 106, 120, 130, 81, 81, 104, 104, 186, 510, 350, 406],
};

/**
 * Mapping of possible English spellings of Hebrew letter names to their index in the METHODS arrays
 */
export const LETTER_KEYS = {
	alef: [0],
	beis: [1],
	veis: [1],
	bet: [1],
	vet: [1],
	gimmel: [2],
	gimel: [2],
	dalet: [3],
	daled: [3],
	hey: [4],
	hei: [4],
	heh: [4],
	he: [4],
	vav: [5],
	zayin: [6],
	zain: [6],
	ches: [7],
	chet: [7],
	tes: [8],
	tet: [8],
	yud: [9],
	yood: [9],
	kaf: [10, 11],
	kof: [10, 11],
	chaf: [10, 11],
	chaf_sofit: [11],
	lamed: [12],
	mem: [13, 14],
	mem_sofit: [14],
	nun: [15, 16],
	nun_sofit: [16],
	samech: [17],
	ayin: [18],
	pey: [19, 20],
	peh: [19, 20],
	fey: [19, 20],
	fay: [19, 20],
	pey_sofit: [20],
	peh_sofit: [20],
	fey_sofit: [20],
	fay_sofit: [20],
	tzadi: [21, 22],
	tzadik: [21, 22],
	tzadi_sofit: [22],
	tzadik_sofit: [22],
	kuf: [23],
	qof: [23],
	qoph: [23],
	resh: [24],
	shin: [25],
	sin: [25],
	taf: [26],
	tav: [26],
};

/**
 * Suggested gematrias of each letter's spelling with the default first
 */
export const LETTER_SPELLING_VALUES = {
	alef: [{ value: 111, name: 'אלף' }],
	beis: [
		{ value: 412, name: 'בית' },
		{ value: 402, name: 'בת' },
	],
	gimmel: [
		{ value: 83, name: 'גימל' },
		{ value: 73, name: 'גמל' },
	],
	dalet: [
		{ value: 434, name: 'דלת' },
		{ value: 444, name: 'דלית' },
	],
	hey: [
		{ value: 6, name: 'הא' },
		{ value: 15, name: 'הי' },
		{ value: 10, name: 'הה' },
	],
	vav: [
		{ value: 12, name: 'וו' },
		{ value: 22, name: 'ויו' },
		{ value: 13, name: 'ואו' },
	],
	zayin: [{ value: 67, name: 'זין' }],
	ches: [
		{ value: 418, name: 'חית' },
		{ value: 408, name: 'חת' },
	],
	tes: [
		{ value: 419, name: 'טית' },
		{ value: 409, name: 'טת' },
	],
	yud: [{ value: 20, name: 'יוד' }],
	kaf: [{ value: 100, name: 'כף' }],
	lamed: [{ value: 74, name: 'למד' }],
	mem: [{ value: 80, name: 'מם' }],
	nun: [{ value: 106, name: 'נון' }],
	samech: [{ value: 120, name: 'סמך' }],
	ayin: [{ value: 130, name: 'עין' }],
	pey: [
		{ value: 81, name: 'פא' },
		{ value: 90, name: 'פי' },
		{ value: 85, name: 'פה' },
	],
	tzadi: [
		{ value: 104, name: 'צדי' },
		{ value: 204, name: 'צדיק' },
	],
	kuf: [{ value: 186, name: 'קוף' }],
	resh: [
		{ value: 510, name: 'ריש' },
		{ value: 500, name: 'רש' },
	],
	shin: [
		{ value: 350, name: 'שן' },
		{ value: 360, name: 'שין' },
	],
	tav: [
		{ value: 406, name: 'תו' },
		{ value: 416, name: 'תיו' },
		{ value: 407, name: 'תאו' },
	],
};

/**
 * Calculate the number of words in a hebrew phrase
 *
 * @param {string} text - The phrase to calculate the number of words in
 * @returns {number} The number of words in the phrase
 */
export function getNumberOfWords(text) {
	text = text.trim();
	if (text.length == 0) {
		return 0;
	}
	// replace vbar/paseq, hyphen/maqaf with space
	text = text.replace(/[\u05C0\u007C]|[\u05BE\u002D]/g, ' ');
	// remove basic ascii (inc. '{' and '}')
	text = text.replace(/[\u0020-\u0100]+/g, ' ');
	// replace multiple spaces with single and remove spaces on ends
	text = text.replace(/ +/g, ' ').trim();
	// find number of words separated by spaces
	return text.split(' ').length;
}

/**
 * @typedef {Object} GematriaOptions
 * @property {string} text - The word or phrase to calculate the gematria value of
 * @property {{ [key: string]: number }} [miluiInput] - The milui values to use for each letter
 */

/**
 * Calculate the gematria value of a word
 *
 * @param {GematriaOptions} options - The options for calculating the gematria value
 * @returns {{ [key: string]: number }} The gematria values of the word or phrase for each method
 */
export function calculateGematria({ text, miluiInput = {} }) {
	// create milui values from input
	const miluiValues = METHODS.shemi;
	for (const [letter, value] of Object.entries(miluiInput)) {
		if (!(letter.toLowerCase() in LETTER_KEYS)) {
			throw new Error(`Unexpected letter name '${letter}' in miluiInput. Valid names are: ${Object.keys(LETTER_KEYS).join(', ')}`);
		}
		// @ts-ignore - letterIndices will always be an array of numbers
		const letterIndices = LETTER_KEYS[letter.toLowerCase()];
		for (const letterIndex of letterIndices) {
			miluiValues[letterIndex] = value;
		}
	}

	// determine number of words in phrase before modifying text
	const numberOfWords = getNumberOfWords(text);

	// replace non-standard hebrew characters with standard ones and remove non-hebrew characters
	text = text.replace(/\u05F0/g, 'יב'); // \u05F0 = װ
	text = text.replace(/\u05F1/g, 'טז'); // \u05F1 = ױ
	text = text.replace(/[\u05F2\uFB1F]/g, 'כ'); // \u05F2 = ײ, \uFB1F = ײַ
	text = text.replace(/[\uFB2E-\uFB30\uFB4F\uFB21]/g, 'א'); // \uFB2E = אַ, \uFB2F = אָ, \uFB30 = אּ, \uFB4F = ﭏ, \uFB21 = ﬡ
	text = text.replace(/[\uFB31\uFB4C]/g, 'ב'); // \uFB31 = בּ, \uFB4C = בֿ
	text = text.replace(/\uFB32/g, 'ג'); // \uFB32 = גּ
	text = text.replace(/[\uFB33\uFB22]/g, 'ד'); // \uFB33 = דּ, \uFB22 = ﬢ
	text = text.replace(/[\uFB34\uFB23]/g, 'ה'); // \uFB34 = הּ, \uFB23 = ﬣ
	text = text.replace(/[\uFB4B\uFB35]/g, 'ו'); // \uFB4B = וֹ, \uFB35 = וּ
	text = text.replace(/\uFB36/g, 'ז'); // \uFB36 = זּ
	text = text.replace(/\uFB38/g, 'ט'); // \uFB38 = טּ
	text = text.replace(/[\uFB39\uFB1D]/g, 'י'); // \uFB39 = יּ, \uFB1D = יִ
	text = text.replace(/\uFB3A/g, 'ך'); // \uFB3A = ךּ
	text = text.replace(/[\uFB3B\uFB4D\uFB24]/g, 'כ'); // \uFB3B = כּ, \uFB4D = כֿ, \uFB24 = ﬤ
	text = text.replace(/[\uFB3C\uFB25]/g, 'ל'); // \uFB3C = לּ, \uFB25 = ﬥ
	text = text.replace(/\uFB26/g, 'ם'); // \uFB26 = ﬦ
	text = text.replace(/\uFB3E/g, 'מ'); // \uFB3E = מּ
	text = text.replace(/[\uFB40\u05C6]/g, 'נ'); // \uFB40 = נּ, \u05C6 = ׆
	text = text.replace(/\uFB41/g, 'ס'); // \uFB41 = סּ
	text = text.replace(/[\uFB42\uFB20]/g, 'ע'); // \uFB42 = ﭂, \uFB20 = ﬠ
	text = text.replace(/\uFB43/g, 'ף'); // \uFB43 = ףּ
	text = text.replace(/[\uFB44\uFB4E]/g, 'פ'); // \uFB44 = פּ, \uFB4E = פֿ
	text = text.replace(/\uFB46/g, 'צ'); // \uFB46 = צּ
	text = text.replace(/\uFB47/g, 'ק'); // \uFB47 = קּ
	text = text.replace(/[\uFB48\uFB27]/g, 'ר'); // \uFB48 = רּ, \uFB27 = ﬧ
	text = text.replace(/[\uFB49\uFB2A-\uFB2D]/g, 'ש'); // \uFB49 = שּ, \uFB2A = שׁ, \uFB2B = שׂ, \uFB2C = שּׁ, \uFB2D = שּׂ
	text = text.replace(/[\uFB4A\uFB28]/g, 'ת'); // \uFB4A = תּ, \uFB28 = ﬨ
	text = text.replace(/[\u0020-\u05CF]|[\u05EB-\uFFFF]/g, ''); // remove any remaining non-hebrew characters

	// calculate gematria values
	const results = {
		standard: 0,
		gadol: 0,
		siduri: 0,
		katan: 0,
		perati: 0,
		shemi: 0,
		neelam: 0,
		musafi: 0,
		atbash: 0,
		albam: 0,
		boneeh: 0,
		kidmi: 0,
		hamerubah_haklali: 0,
		meshulash: 0,
		haachor: 0,
		mispari: 0,
		katan_mispari: 0,
		kolel: 0,
		achbi: 0,
		atbach: 0,
		ayakbakar: 0,
		ofanim: 0,
		achasbeta: 0,
		avgad: 0,
		reverse_avgad: 0,
	};
	text.split('').forEach((letter, i) => {
		const letterIndex = letter.charCodeAt(0) - 1488;
		if (letterIndex < 0 || letterIndex >= METHODS.hechrachi.length) {
			throw new Error(`Unexpected letter \\u${letter.charCodeAt(0).toString(16)} at position ${i} in word ${text}`);
		}
		results.standard += METHODS.hechrachi[letterIndex];
		results.gadol += METHODS.gadol[letterIndex];
		results.siduri += METHODS.siduri[letterIndex];
		results.katan += METHODS.katan[letterIndex];
		results.perati += METHODS.perati[letterIndex];
		results.shemi += miluiValues[letterIndex];
		results.musafi += METHODS.hechrachi[letterIndex] + 1; // gematria + number of letters
		results.atbash += METHODS.atbash[letterIndex];
		results.albam += METHODS.albam[letterIndex];
		results.boneeh += METHODS.hechrachi[letterIndex] * (text.length - i); // gematria plus value of all previous letters for each letter
		results.kidmi += METHODS.kidmi[letterIndex];
		results.neelam += miluiValues[letterIndex] - METHODS.hechrachi[letterIndex]; // milui without the first letter (the letter itself)
		results.meshulash += METHODS.meshulash[letterIndex];
		results.haachor += METHODS.hechrachi[letterIndex] * (i + 1); // gematria * position in word for each letter
		results.mispari += METHODS.mispari[letterIndex];
		results.achbi += METHODS.achbi[letterIndex];
		results.atbach += METHODS.atbach[letterIndex];
		results.ayakbakar += METHODS.ayakbakar[letterIndex];
		results.ofanim += METHODS.ofanim[letterIndex];
		results.achasbeta += METHODS.achasbeta[letterIndex];
		results.avgad += METHODS.avgad[letterIndex];
		results.reverse_avgad += METHODS.reverse_avgad[letterIndex];
	});
	results.hamerubah_haklali = results.standard * results.standard; // gematria squared
	results.katan_mispari = 1 + ((results.standard - 1) % 9); // digital root of gematria
	results.kolel = results.standard + numberOfWords; // gematria + number of words in phrase
	return results;
}

/**
 * @typedef {Object} GematriaSearchOptions
 * @property {string} [text] - The word or phrase to calculate the gematria value of
 * @property {number} [value] - The gematria value to search for
 */

/**
 * Find words and verses in the Torah with the same gematria value as the given word or phrase
 *
 * @param {GematriaSearchOptions} options - The options for calculating the gematria value
 * @returns {{ [key: string]: string[] }} The words and verses in the Torah with the same gematria value as the given word or phrase
 */
export function searchGematria({ text, value }) {
	if (text !== undefined) {
		if (value !== undefined) {
			throw new Error("Unexpected 'text' and 'value' parameters. Only one of these parameters should be provided.");
		}
		const gematria = calculateGematria({ text });
		value = gematria.standard;
	}
	if (value === undefined) {
		throw new Error("Missing 'text' or 'value' parameter");
	}
	return {
		COMMON_WORDS: COMMON_WORDS[value] || [],
		TORAH_WORDS: TORAH_WORDS[value] || [],
		BEREISHIS_PESUKIM: BEREISHIS_PESUKIM[value] || [],
		SHEMOS_PESUKIM: SHEMOS_PESUKIM[value] || [],
		VAYIKRA_PESUKIM: VAYIKRA_PESUKIM[value] || [],
		BAMIDBAR_PESUKIM: BAMIDBAR_PESUKIM[value] || [],
		DEVARIM_PESUKIM: DEVARIM_PESUKIM[value] || [],
	};
}
