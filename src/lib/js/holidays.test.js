import { describe, expect, it } from 'vitest';
import { getHolidays } from './holidays';
import { HDate } from '@hebcal/core';

describe('test getHolidays', () => {
	it('gets holidays', async () => {
		const hDate = new HDate(9, 7, 5784);
		const result = getHolidays({ start: hDate });
		expect(result[0].desc).toBe('Erev Yom Kippur');
        expect(result[0].hebrew).toBe('עֶרֶב יוֹם כִּפּוּר');
        expect(result[0].gregorianDate).toBe('Sun, September 24, 2023');
        expect(result.map((holiday) => holiday.desc)).toStrictEqual([]);
	});
});
