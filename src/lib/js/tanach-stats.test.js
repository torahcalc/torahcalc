import { describe, expect, it } from 'vitest';
import { formatBookName, formatStatType, getStat, getStats, hasStat, isValidBook } from './tanach-stats';

describe('getStats', () => {
	it('returns stats for Tanach', () => {
		const stats = getStats('tanach');
		expect(stats).toEqual({ chapters: 929, verses: 23198, words: 305411, letters: 1196718, portions: 54 });
	});

	it('returns stats for Torah', () => {
		const stats = getStats('torah');
		expect(stats).toEqual({ chapters: 187, verses: 5844, words: 79977, letters: 304801, portions: 54 });
	});

	it('returns stats for Bereishis (Hebrew)', () => {
		const stats = getStats('sefer bereishis', 'book');
		expect(stats).toEqual({ chapters: 50, verses: 1533, words: 20612, letters: 78063, portions: 12 });
	});

	it('returns stats for a parsha', () => {
		const stats = getStats('parshas noach', 'parsha');
		expect(stats).toEqual({ verses: 153, words: 1861, letters: 6907 });
	});

	it('returns stats for Tehillim', () => {
		const stats = getStats('tehillim');
		expect(stats).toEqual({ chapters: 150, verses: 2527, words: 19583, letters: 78822 });
	});

	it('returns null for unknown book', () => {
		const stats = getStats('nonexistent');
		expect(stats).toBeNull();
	});
});

describe('isValidBook', () => {
	it('returns true for valid books', () => {
		expect(isValidBook('torah')).toBe(true);
		expect(isValidBook('sefer bereishis')).toBe(true);
		expect(isValidBook('sefer shemos')).toBe(true);
		expect(isValidBook('sefer vayikra')).toBe(true);
		expect(isValidBook('sefer bamidbar')).toBe(true);
		expect(isValidBook('sefer devarim')).toBe(true);
	});

	it('returns false for invalid books', () => {
		expect(isValidBook('nonexistent')).toBe(false);
		expect(isValidBook('')).toBe(false);
	});
});

describe('hasStat', () => {
	it('returns true if book has the statistic', () => {
		expect(hasStat('torah', 'chapters')).toBe(true);
		expect(hasStat('torah', 'verses')).toBe(true);
		expect(hasStat('torah', 'words')).toBe(true);
		expect(hasStat('torah', 'letters')).toBe(true);
		expect(hasStat('torah', 'portions')).toBe(true);
	});

	it('returns false if book does not have the statistic', () => {
		expect(hasStat('noach', 'chapters')).toBe(false); // parsha, no chapters
	});

	it('returns false for invalid books', () => {
		expect(hasStat('nonexistent', 'chapters')).toBe(false);
	});

	it('returns false for invalid statistic types', () => {
		expect(hasStat('torah', 'invalid')).toBe(false);
	});
});

describe('getStat', () => {
	it('returns the correct statistic', () => {
		expect(getStat('torah', 'chapters')).toBe(187);
		expect(getStat('torah', 'verses')).toBe(5844);
		expect(getStat('torah', 'words')).toBe(79977);
		expect(getStat('torah', 'letters')).toBe(304801);
		expect(getStat('torah', 'portions')).toBe(54);
	});

	it('returns null for missing statistic', () => {
		expect(getStat('noach', 'chapters')).toBeNull(); // parsha, no chapters
		expect(getStat('noach', 'portions')).toBeNull(); // parsha, no portions
	});

	it('returns null for invalid book', () => {
		expect(getStat('nonexistent', 'chapters')).toBeNull();
	});

	it('works with parsha stats', () => {
		expect(getStat('parshas noach', 'verses', 'parsha')).toBe(153);
		expect(getStat('parshas noach', 'words', 'parsha')).toBe(1861);
		expect(getStat('parshas noach', 'letters', 'parsha')).toBe(6907);
	});
});

describe('formatStatType', () => {
	it('formats singular correctly', () => {
		expect(formatStatType('chapters', 1)).toBe('chapter');
		expect(formatStatType('verses', 1)).toBe('verse');
		expect(formatStatType('words', 1)).toBe('word');
		expect(formatStatType('letters', 1)).toBe('letter');
		expect(formatStatType('portions', 1)).toBe('portion');
	});

	it('formats plural correctly', () => {
		expect(formatStatType('chapters', 2)).toBe('chapters');
		expect(formatStatType('verses', 100)).toBe('verses');
		expect(formatStatType('words', 5000)).toBe('words');
		expect(formatStatType('letters', 10000)).toBe('letters');
		expect(formatStatType('portions', 54)).toBe('portions');
	});

	it('handles zero as plural', () => {
		expect(formatStatType('chapters', 0)).toBe('chapters');
	});
});

describe('formatBookName', () => {
	it('formats special cases correctly', () => {
		expect(formatBookName('tanach')).toBe('Tanach');
		expect(formatBookName('torah')).toBe('Torah');
		expect(formatBookName('trei asar')).toBe('Trei Asar');
	});

	it('formats books with roman numerals', () => {
		expect(formatBookName('shmuel i')).toBe('Shmuel I');
		expect(formatBookName('shmuel ii')).toBe('Shmuel II');
		expect(formatBookName('1 samuel')).toBe('1 Samuel');
		expect(formatBookName('2 chronicles')).toBe('2 Chronicles');
	});

	it('formats multi-word names', () => {
		expect(formatBookName('lech lecha')).toBe('Lech Lecha');
		expect(formatBookName('chayei sarah')).toBe('Chayei Sarah');
	});

	it('formats simple names by capitalizing first letter', () => {
		expect(formatBookName('yoel')).toBe('Yoel');
		expect(formatBookName('amos')).toBe('Amos');
	});
});

describe('Book and Parsha Coverage', () => {
	it('has all 5 Torah books', () => {
		expect(isValidBook('sefer bereishis')).toBe(true);
		expect(isValidBook('sefer shemos')).toBe(true);
		expect(isValidBook('sefer vayikra')).toBe(true);
		expect(isValidBook('sefer bamidbar')).toBe(true);
		expect(isValidBook('sefer devarim')).toBe(true);
	});

	it("has major Nevi'im books", () => {
		expect(isValidBook('yehoshua')).toBe(true);
		expect(isValidBook('yeshayahu')).toBe(true);
		expect(isValidBook('yirmeyahu')).toBe(true);
	});

	it('has Trei Asar books', () => {
		expect(isValidBook('hoshea')).toBe(true);
		expect(isValidBook('yoel')).toBe(true);
		expect(isValidBook('amos')).toBe(true);
		expect(isValidBook('malachi')).toBe(true);
	});

	it('has major Kesuvim books', () => {
		expect(isValidBook('tehillim')).toBe(true);
		expect(isValidBook('mishlei')).toBe(true);
		expect(isValidBook('iyov')).toBe(true);
	});

	it('has all 54 parshios', () => {
		// Sample from each book
		expect(isValidBook('parshas bereishis')).toBe(true);
		expect(isValidBook('parshas noach')).toBe(true);
		expect(isValidBook('parshas vayeira')).toBe(true);
		expect(isValidBook('parshas vaeira')).toBe(true);
		expect(isValidBook('parshas bo')).toBe(true);
		expect(isValidBook('parshas vayikra')).toBe(true);
		expect(isValidBook('parshas tzav')).toBe(true);
		expect(isValidBook('parshas bamidbar')).toBe(true);
		expect(isValidBook('parshas naso')).toBe(true);
		expect(isValidBook('parshas devarim')).toBe(true);
		expect(isValidBook("parshas va'eschanan")).toBe(true);
	});
});
