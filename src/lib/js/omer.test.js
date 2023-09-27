import { describe, expect, it } from 'vitest';
import { calculateOmerYear, calculateOmerDate, calculateOmerHebrew } from './omer';

describe('test calculateOmer', () => {
	it('calculates omer year', async () => {
		const result = calculateOmerYear(2023);
		expect(Object.keys(result).length).toBe(49);

		expect(result['2023-04-06']).not.toBeDefined();

		expect(result['2023-04-07'].night).toBe('Evening of Thu, April 6, 2023');
		expect(result['2023-04-07'].day).toBe('Fri, April 7, 2023');
		expect(result['2023-04-07'].dayOfOmer).toBe(1);
		expect(result['2023-04-07'].dayOfOmer).toBe(1);
		expect(result['2023-04-07'].hebrewDate).toBe('16th of Nissan, 5783');
		expect(result['2023-04-07'].sefiraEn).toBe('Chesed ShebiChesed');
		expect(result['2023-04-07'].sefiraHe).toBe('חֶסֶד שֶׁבְּחֶסֶד');
		expect(result['2023-04-07'].formulaEn).toBe('Today is one day of the Omer.');
		expect(result['2023-04-07'].formulaHe).toBe('הַיוֹם יוֹם אֶחַד לָעוֹמֶר.');

		expect(result['2023-05-25'].night).toBe('Evening of Wed, May 24, 2023');
		expect(result['2023-05-25'].day).toBe('Thu, May 25, 2023');
		expect(result['2023-05-25'].dayOfOmer).toBe(49);
		expect(result['2023-05-25'].hebrewDate).toBe('5th of Sivan, 5783');
		expect(result['2023-05-25'].sefiraEn).toBe('Malchut ShebiMalchut');
		expect(result['2023-05-25'].sefiraHe).toBe('מַלְכוּת שֶׁבְּמַלְכוּת');
		expect(result['2023-05-25'].formulaEn).toBe('Today is forty-nine days, which are seven weeks, of the Omer.');
		expect(result['2023-05-25'].formulaHe).toBe('הַיוֹם תִּשְׁעָה וְאַרְבָּעִים יוֹם, שֶהֵם שִׁבְעַה שָבוּעוֹת, לָעוֹמֶר.');

		expect(result['2023-05-26']).not.toBeDefined();
	});

	it('calculates omer date', async () => {
		let result = calculateOmerDate('2023-01-01');
		expect(result.dayCount).toBeNull();
		expect(result.nightCount).toBeNull();

		result = calculateOmerDate('2023-04-06');
		expect(result.dayCount).toBeNull();
		expect(result.nightCount?.dayOfOmer).toBe(1);

		result = calculateOmerDate('2023-04-07');
		expect(result.dayCount?.dayOfOmer).toBe(1);
		expect(result.nightCount?.dayOfOmer).toBe(2);

		result = calculateOmerDate('2023-04-08');
		expect(result.dayCount?.dayOfOmer).toBe(2);
		expect(result.nightCount?.dayOfOmer).toBe(3);

		result = calculateOmerDate('2023-05-25');
		expect(result.dayCount?.dayOfOmer).toBe(49);
		expect(result.nightCount).toBeNull();

		result = calculateOmerDate('2023-05-26');
		expect(result.dayCount).toBeNull();
		expect(result.nightCount).toBeNull();
	});

	it('calculates omer hebrew', async () => {
		let result = calculateOmerHebrew(5783, 1, 15);
		expect(result.count).toBeNull();

		result = calculateOmerHebrew(5783, 1, 16);
		expect(result.count?.dayOfOmer).toBe(1);

		result = calculateOmerHebrew(5783, 1, 17);
		expect(result.count?.dayOfOmer).toBe(2);

		result = calculateOmerHebrew(5783, 3, 5);
		expect(result.count?.dayOfOmer).toBe(49);

		result = calculateOmerHebrew(5783, 3, 6);
		expect(result.count).toBeNull();
	});
});
