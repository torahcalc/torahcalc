import { HDate } from '@hebcal/core';
import { describe, expect, it } from 'vitest';
import { getHolidays } from './holidays';

describe('test getHolidays', () => {
	it('gets holidays from a start date', async () => {
		const hDate = new HDate(9, 7, 5784);
		const result = getHolidays({ startDate: hDate });
		expect(result[0].name).toBe('Yom Kippur');
		expect(result[0].date).toBe('2023-09-25');
		expect(result[0].gregorianStart).toBe('Begins in the evening of Sun, Sep 24');
		expect(result[0].gregorianEnd).toBe('Ends in the evening of Mon, Sep 25');
		expect(result[0].hebrewStart).toBe('10th of Tishrei, 5784');
		expect(result[0].hebrewEnd).toBe('10th of Tishrei, 5784');
		expect(result[result.length - 1].name).toBe('Tzom Gedaliah');
		expect(result[result.length - 1].date).toBe('2024-10-06');
		expect(result[result.length - 1].gregorianStart).toBe('Begins at dawn of Sun, Oct 6');
		expect(result[result.length - 1].gregorianEnd).toBe('Ends in the evening of Sun, Oct 6');
		expect(result[result.length - 1].hebrewStart).toBe('4th of Tishrei, 5785'); // moved from Shabbos to Sunday
		expect(result[result.length - 1].hebrewEnd).toBe('4th of Tishrei, 5785');
	});

	it('gets holidays from a gregorian year', async () => {
		const result = getHolidays({ gregorianYear: 2023 });
		expect(result[0].name).toBe("Asara B'Teves");
		expect(result[0].date).toBe('2023-01-03');
		expect(result[0].gregorianStart).toBe('Begins at dawn of Tue, Jan 3');
		expect(result[0].gregorianEnd).toBe('Ends in the evening of Tue, Jan 3');
		expect(result[0].hebrewStart).toBe('10th of Teves, 5783');
		expect(result[0].hebrewEnd).toBe('10th of Teves, 5783');
		expect(result[result.length - 1].name).toBe("Asara B'Teves");
		expect(result[result.length - 1].date).toBe('2023-12-22');
		expect(result[result.length - 1].gregorianStart).toBe('Begins at dawn of Fri, Dec 22');
		expect(result[result.length - 1].gregorianEnd).toBe('Ends in the evening of Fri, Dec 22');
		expect(result[result.length - 1].hebrewStart).toBe('10th of Teves, 5784');
		expect(result[result.length - 1].hebrewEnd).toBe('10th of Teves, 5784');
	});

	it('gets holidays from a hebrew year', async () => {
		const result = getHolidays({ hebrewYear: 5784 });
		expect(result[0].name).toBe('Rosh Hashanah');
		expect(result[0].date).toBe('2023-09-16');
		expect(result[0].gregorianStart).toBe('Begins in the evening of Fri, Sep 15');
		expect(result[0].gregorianEnd).toBe('Ends in the evening of Sun, Sep 17');
		expect(result[0].hebrewStart).toBe('1st of Tishrei, 5784');
		expect(result[0].hebrewEnd).toBe('2nd of Tishrei, 5784');
		expect(result[result.length - 1].name).toBe('Leil Selichos');
		expect(result[result.length - 1].date).toBe('2024-09-28');
		expect(result[result.length - 1].gregorianStart).toBe('Begins in the evening of Fri, Sep 27');
		expect(result[result.length - 1].gregorianEnd).toBe('Ends in the evening of Sat, Sep 28');
		expect(result[result.length - 1].hebrewStart).toBe('25th of Elul, 5784');
		expect(result[result.length - 1].hebrewEnd).toBe('25th of Elul, 5784');
	});

	// TODO: Tests for holiday type flags
});
