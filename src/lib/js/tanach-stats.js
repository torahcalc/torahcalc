/**
 * Tanach Statistics
 * Data for chapters, verses, words, and letters in each book of Tanach and parsha in Torah
 */

/**
 * @typedef {Object} BookStats
 * @property {number} [chapters] - Number of chapters in the book (for books, not parshios)
 * @property {number} verses - Number of verses in the book
 * @property {number} words - Number of words in the book
 * @property {number} letters - Number of letters in the book
 * @property {number} [portions] - Number of portions (for Torah books only)
 */

/**
 * @typedef {Object} ParshaStats
 * @property {number} verses - Number of verses in the parsha
 * @property {number} words - Number of words in the parsha
 * @property {number} letters - Number of letters in the parsha
 */

/** @type {Record<string, BookStats>} */
export const TANACH_STATS = {
	// Overall Tanach
	tanach: { chapters: 929, verses: 23198, words: 305411, letters: 1196718, portions: 54 },

	// Torah section
	'the torah': { chapters: 187, verses: 5844, words: 79977, letters: 304801, portions: 54 },

	// Torah books
	'sefer bereishis': { chapters: 50, verses: 1533, words: 20612, letters: 78063, portions: 12 },
	'sefer shemos': { chapters: 40, verses: 1209, words: 16713, letters: 63527, portions: 11 },
	'sefer vayikra': { chapters: 27, verses: 859, words: 11950, letters: 44790, portions: 10 },
	'sefer bamidbar': { chapters: 36, verses: 1288, words: 16408, letters: 63529, portions: 10 },
	'sefer devarim': { chapters: 34, verses: 955, words: 14294, letters: 54892, portions: 11 },

	// Nevi'im section
	neviim: { chapters: 380, verses: 9292, words: 141434, letters: 553581 },

	// Nevi'im - Early Prophets
	yehoshua: { chapters: 24, verses: 656, words: 10031, letters: 39730 },
	shoftim: { chapters: 21, verses: 618, words: 9885, letters: 38952 },
	'shmuel i': { chapters: 31, verses: 811, words: 13261, letters: 51357 },
	'shmuel ii': { chapters: 24, verses: 695, words: 11033, letters: 42179 },
	'melachim i': { chapters: 22, verses: 817, words: 13140, letters: 50625 },
	'melachim ii': { chapters: 25, verses: 717, words: 12245, letters: 47704 },

	// Nevi'im - Major Prophets
	yeshayahu: { chapters: 66, verses: 1291, words: 16925, letters: 66874 },
	yirmeyahu: { chapters: 52, verses: 1364, words: 21831, letters: 84899 },
	yechezkel: { chapters: 48, verses: 1273, words: 18730, letters: 74511 },

	// Trei Asar (The Twelve)
	'trei asar': { chapters: 67, verses: 1050, words: 14353, letters: 56750 },
	hoshea: { chapters: 14, verses: 197, words: 2381, letters: 9389 },
	yoel: { chapters: 4, verses: 73, words: 957, letters: 3872 },
	amos: { chapters: 9, verses: 146, words: 2042, letters: 8034 },
	ovadyah: { chapters: 1, verses: 21, words: 291, letters: 1119 },
	yonah: { chapters: 4, verses: 48, words: 688, letters: 2700 },
	michah: { chapters: 7, verses: 105, words: 1396, letters: 5571 },
	nachum: { chapters: 3, verses: 47, words: 558, letters: 2255 },
	chavakuk: { chapters: 3, verses: 56, words: 671, letters: 2596 },
	tzefanyah: { chapters: 3, verses: 53, words: 767, letters: 2995 },
	chagai: { chapters: 2, verses: 38, words: 600, letters: 2336 },
	zecharyah: { chapters: 14, verses: 211, words: 3126, letters: 12433 },
	malachi: { chapters: 3, verses: 55, words: 876, letters: 3450 },

	// Kesuvim section
	kesuvim: { chapters: 362, verses: 8064, words: 84001, letters: 338340 },

	// Kesuvim - Chronicles
	'divrei hayamim i': { chapters: 29, verses: 943, words: 10740, letters: 44559 },
	'divrei hayamim ii': { chapters: 36, verses: 822, words: 13315, letters: 54917 },

	// Kesuvim - Sifrei Emes
	tehillim: { chapters: 150, verses: 2527, words: 19583, letters: 78822 },
	iyov: { chapters: 42, verses: 1070, words: 8340, letters: 31851 },
	mishlei: { chapters: 31, verses: 915, words: 6915, letters: 26500 },

	// Kesuvim - Five Megillot
	rut: { chapters: 4, verses: 85, words: 1294, letters: 4949 },
	'shir hashirim': { chapters: 8, verses: 117, words: 1250, letters: 5141 },
	koheles: { chapters: 12, verses: 222, words: 2987, letters: 10967 },
	eichah: { chapters: 5, verses: 154, words: 1542, letters: 5974 },
	esther: { chapters: 10, verses: 167, words: 3045, letters: 12111 },

	// Kesuvim - Other
	daniel: { chapters: 12, verses: 357, words: 5923, letters: 24277 },
	ezra: { chapters: 10, verses: 280, words: 3754, letters: 15762 },
	nechemiah: { chapters: 13, verses: 405, words: 5312, letters: 22506 },
};

/** @type {Record<string, ParshaStats>} */
export const PARSHA_STATS = {
	// Bereishis
	'parshas bereishis': { verses: 146, words: 1931, letters: 7234 },
	'parshas noach': { verses: 153, words: 1861, letters: 6907 },
	'parshas lech lecha': { verses: 126, words: 1686, letters: 6336 },
	'parshas vayeira': { verses: 147, words: 2085, letters: 7862 },
	'parshas chayei sarah': { verses: 105, words: 1402, letters: 5314 },
	'parshas toldos': { verses: 106, words: 1432, letters: 5426 },
	'parshas vayetze': { verses: 148, words: 2021, letters: 7512 },
	'parshas vayishlach': { verses: 153, words: 1976, letters: 7458 },
	'parshas vayeshev': { verses: 112, words: 1558, letters: 5972 },
	'parshas miketz': { verses: 146, words: 2022, letters: 7914 },
	'parshas vayigash': { verses: 106, words: 1480, letters: 5680 },
	'parshas vayechi': { verses: 85, words: 1158, letters: 4448 },

	// Shemos
	'parshas shemos': { verses: 124, words: 1763, letters: 6762 },
	'parshas vaeira': { verses: 121, words: 1748, letters: 6701 },
	'parshas bo': { verses: 106, words: 1655, letters: 6149 },
	'parshas beshalach': { verses: 116, words: 1681, letters: 6423 },
	'parshas yisro': { verses: 74, words: 1105, letters: 4022 },
	'parshas mishpatim': { verses: 118, words: 1462, letters: 5313 },
	'parshas terumah': { verses: 96, words: 1145, letters: 4691 },
	'parshas tetzaveh': { verses: 101, words: 1412, letters: 5429 },
	'parshas ki sisa': { verses: 139, words: 2002, letters: 7424 },
	'parshas vayakhel': { verses: 122, words: 1558, letters: 6181 },
	'parshas pekudei': { verses: 92, words: 1182, letters: 4432 },

	// Vayikra
	'parshas vayikra': { verses: 111, words: 1673, letters: 6222 },
	'parshas tzav': { verses: 97, words: 1353, letters: 5096 },
	'parshas shemini': { verses: 91, words: 1238, letters: 4670 },
	'parshas tazria': { verses: 67, words: 1010, letters: 3667 },
	'parshas metzora': { verses: 90, words: 1274, letters: 4697 },
	'parshas acharei mos': { verses: 80, words: 1170, letters: 4294 },
	'parshas kedoshim': { verses: 64, words: 868, letters: 3229 },
	'parshas emor': { verses: 124, words: 1614, letters: 6106 },
	'parshas behar': { verses: 57, words: 737, letters: 2817 },
	'parshas bechukosai': { verses: 78, words: 1013, letters: 3992 },

	// Bamidbar
	'parshas bamidbar': { verses: 159, words: 1823, letters: 7392 },
	'parshas naso': { verses: 176, words: 2264, letters: 8632 },
	"parshas beha'alosecha": { verses: 136, words: 1840, letters: 7056 },
	'parshas shlach': { verses: 119, words: 1540, letters: 5820 },
	'parshas korach': { verses: 95, words: 1409, letters: 5325 },
	'parshas chukas': { verses: 87, words: 1245, letters: 4670 },
	'parshas balak': { verses: 104, words: 1455, letters: 5356 },
	'parshas pinchas': { verses: 168, words: 1887, letters: 7853 },
	'parshas matos': { verses: 112, words: 1484, letters: 5652 },
	'parshas masei': { verses: 132, words: 1461, letters: 5773 },

	// Devarim
	'parshas devarim': { verses: 105, words: 1548, letters: 5972 },
	"parshas va'eschanan": { verses: 121, words: 1878, letters: 7343 },
	'parshas eikev': { verses: 111, words: 1747, letters: 6865 },
	"parshas re'eh": { verses: 126, words: 1932, letters: 7442 },
	'parshas shoftim': { verses: 97, words: 1523, letters: 5590 },
	'parshas ki seitzei': { verses: 110, words: 1582, letters: 5856 },
	'parshas ki savo': { verses: 122, words: 1747, letters: 6811 },
	'parshas nitzavim': { verses: 40, words: 657, letters: 2575 },
	'parshas vayelech': { verses: 30, words: 553, letters: 2123 },
	"parshas h'aazinu": { verses: 52, words: 615, letters: 2326 },
	"parshas v'zos habrachah": { verses: 41, words: 512, letters: 1989 },
};

/**
 * Get statistics for a book of Tanach or a parsha
 * @param {string} book - The book or parsha name (case-insensitive)
 * @returns {BookStats | ParshaStats | null} The statistics for the book/parsha, or null if not found
 */
/**
 * Get statistics for a book or parsha
 * @param {string} book - The book or parsha name
 * @param {'book' | 'parsha'} [bookType='book'] - The type of interpretation
 * @returns {BookStats | null} The statistics object or null if not found
 */
export function getStats(book, bookType = 'book') {
	return bookType === 'parsha' ? PARSHA_STATS[book] || null : TANACH_STATS[book] || null;
}

/**
 * Check if a name is a valid book or parsha
 * @param {string} name - The book or parsha name
 * @returns {boolean} True if the name is valid
 */
export function isValidBook(name) {
	return getStats(name, 'book') !== null || getStats(name, 'parsha') !== null;
}

/**
 * Check if a name has a specific statistic (chapters, verses, words, letters, portions)
 * @param {string} name - The book or parsha name
 * @param {string} statType - The type of statistic (chapters, verses, words, letters, portions)
 * @returns {boolean} True if the name has that statistic
 */
/**
 * Check if a book or parsha has a specific statistic
 * @param {string} name - The book or parsha name
 * @param {string} statType - The type of statistic
 * @param {'parsha' | 'book'} [bookType='book'] - The type of interpretation
 * @returns {boolean} True if the statistic exists
 */
export function hasStat(name, statType, bookType = 'book') {
	const stats = getStats(name, bookType);
	if (!stats) return false;
	return statType in stats && stats[statType] !== undefined;
}

/**
 * Get a specific statistic for a book or parsha
 * @param {string} name - The book or parsha name
 * @param {string} statType - The type of statistic (chapters, verses, words, letters, portions)
 * @param {'parsha' | 'book'} [bookType='book'] - The type of interpretation
 * @returns {number | null} The statistic value, or null if not found
 */
export function getStat(name, statType, bookType = 'book') {
	const stats = getStats(name, bookType);
	if (!stats) return null;
	return stats[statType] ?? null;
}

/**
 * Format a statistic type for display
 * @param {string} statType - The statistic type
 * @param {number} count - The count
 * @returns {string} The formatted statistic name
 */
export function formatStatType(statType, count) {
	const names = {
		chapters: 'chapter',
		verses: 'verse',
		words: 'word',
		letters: 'letter',
		portions: 'portion',
	};
	const singular = names[statType] || statType;
	return count === 1 ? singular : singular + 's';
}

/**
 * Format a book or parsha name for display
 * @param {string} name - The book or parsha name
 * @returns {string} The formatted name
 */
export function formatBookName(name) {
	const upperWords = new Set(['ii', 'i']);

	return name
		.split(' ')
		.map((word) => (upperWords.has(word.toLowerCase()) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
		.join(' ');
}
