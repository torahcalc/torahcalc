import { describe, expect, it } from 'vitest';
import { calculateOmer } from './omer';

describe('test calculateOmer', () => {
	it('calculates omer', async () => {
		const result = calculateOmer(2023);
		expect(result.length).toBe(49);

		expect(result[0].night).toBe('Evening of Thu, April 6, 2023');
		expect(result[0].day).toBe('Fri, April 7, 2023');
		expect(result[0].dayOfOmer).toBe(1);
		expect(result[0].dayOfOmer).toBe(1);
		expect(result[0].hebrewDate).toBe('16th of Nissan, 5783');
		expect(result[0].sefiraEn).toBe('Chesed ShebiChesed');
		expect(result[0].sefiraHe).toBe('חֶסֶד שֶׁבְּחֶסֶד');
		expect(result[0].formulaEn).toBe('Today is one day of the Omer.');
		expect(result[0].formulaHe).toBe('הַיוֹם יוֹם אֶחַד לָעוֹמֶר.');

		expect(result[48].night).toBe('Evening of Wed, May 24, 2023');
		expect(result[48].day).toBe('Thu, May 25, 2023');
		expect(result[48].dayOfOmer).toBe(49);
		expect(result[48].hebrewDate).toBe('5th of Sivan, 5783');
		expect(result[48].sefiraEn).toBe('Malchut ShebiMalchut');
		expect(result[48].sefiraHe).toBe('מַלְכוּת שֶׁבְּמַלְכוּת');
		expect(result[48].formulaEn).toBe('Today is forty-nine days, which are seven weeks, of the Omer.');
		expect(result[48].formulaHe).toBe('הַיוֹם תִּשְׁעָה וְאַרְבָּעִים יוֹם, שֶהֵם שִׁבְעַה שָבוּעוֹת, לָעוֹמֶר.');
	});
});
