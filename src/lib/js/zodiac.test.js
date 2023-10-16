import { describe, expect, it } from 'vitest';
import { calculateZodiac } from './zodiac';

describe('test calculateZodiac', () => {
	it('calculates zodiac', async () => {
		const result = calculateZodiac('2023-10-01');
		expect(result).toStrictEqual({
			date: '2023-10-01',
			hebrewDate: '16th of Tishrei, 5784',
			latin: 'Libra',
			hebrew: 'מאזניים',
			hebrewTransliterated: 'Moznayim',
			month: 'Tishrei',
			symbol: '♎',
		});
	});
});
