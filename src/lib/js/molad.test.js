import { describe, it, expect } from 'vitest';
import { calculateMolad } from './molad';

describe('test calculateMolad', () => {
	it('calculates molad before Nissan, after 5774 (Rosh Hashanah)', async () => {
		const response = calculateMolad(5785, 7); // October 3, 2024 3:21 am and 13 chalakim
		expect(response).toStrictEqual({
			dayOfWeekFormat: {
				'12Hr': 'Thursday morning, 21 minutes and 13 chalakim after 3:00 am',
				'24Hr': 'Thursday morning, 21 minutes and 13 chalakim after 03:00',
			},
			hebrewDateFormat: {
				'12Hr': '1st of Tishrei, 5785, 3:21 am and 13 chalakim',
				'24Hr': '1st of Tishrei, 5785, 03:21 and 13 chalakim',
			},
			shabbosMevarchim: {
				roshHashanah: true,
				roshChodesh: 'Thu, October 3, 2024',
				roshChodeshDayOfWeekDisplayEn: "B'Yom Chamishi",
				roshChodeshDayOfWeekDisplayHe: 'ביום חמישי',
				shabbosMevarchim: 'Sat, September 28, 2024',
			},
			timeFormat: {
				'12Hr': 'Thursday, October 3, 2024, 3:21 am and 13 chalakim',
				'24Hr': 'Thursday, October 3, 2024, 03:21 and 13 chalakim',
			},
			timeString: '2024-10-03 03:21:43.333',
			monthName: 'Tishrei 5785',
		});
	});

	it('calculates molad before Nissan, before 5774', async () => {
		const response = calculateMolad(5770, 10); // December 17, 2009 12:59 am and 10 chalakim
		expect(response).toStrictEqual({
			dayOfWeekFormat: {
				'12Hr': 'Thursday morning, 59 minutes and 10 chalakim after 12:00 am',
				'24Hr': 'Thursday morning, 59 minutes and 10 chalakim after 00:00',
			},
			hebrewDateFormat: {
				'12Hr': '30th of Kislev, 5770, 12:59 am and 10 chalakim',
				'24Hr': '30th of Kislev, 5770, 00:59 and 10 chalakim',
			},
			shabbosMevarchim: {
				roshHashanah: false,
				roshChodesh: 'Thu, December 17, 2009 and Fri, December 18, 2009',
				roshChodeshDayOfWeekDisplayEn: "B'Yom Chamishi Uv'Yom Shishi",
				roshChodeshDayOfWeekDisplayHe: 'ביום חמישי וביום שישי',
				shabbosMevarchim: 'Sat, December 12, 2009',
			},
			timeFormat: {
				'12Hr': 'Thursday, December 17, 2009, 12:59 am and 10 chalakim',
				'24Hr': 'Thursday, December 17, 2009, 00:59 and 10 chalakim',
			},
			timeString: '2009-12-17 00:59:33.333',
			monthName: 'Teves 5770',
		});
	});

	it('calculates molad after Nissan, after 5774', async () => {
		const response = calculateMolad(5785, 6); // August 23, 2025 11:26 pm and 6 chalakim
		expect(response).toStrictEqual({
			dayOfWeekFormat: {
				'12Hr': 'Saturday evening, 26 minutes and 6 chalakim after 11:00 pm',
				'24Hr': 'Saturday evening, 26 minutes and 6 chalakim after 23:00',
			},
			hebrewDateFormat: {
				'12Hr': '29th of Av, 5785, 11:26 pm and 6 chalakim',
				'24Hr': '29th of Av, 5785, 23:26 and 6 chalakim',
			},
			shabbosMevarchim: {
				roshHashanah: false,
				roshChodesh: 'Sun, August 24, 2025 and Mon, August 25, 2025',
				roshChodeshDayOfWeekDisplayEn: "B'Yom Rishon Uv'Yom Sheni",
				roshChodeshDayOfWeekDisplayHe: 'ביום ראשון וביום שני',
				shabbosMevarchim: 'Sat, August 23, 2025',
			},
			timeFormat: {
				'12Hr': 'Saturday, August 23, 2025, 11:26 pm and 6 chalakim',
				'24Hr': 'Saturday, August 23, 2025, 23:26 and 6 chalakim',
			},
			timeString: '2025-08-23 23:26:20.000',
			monthName: 'Elul 5785',
		});
	});

	it('calculates molad after Nissan, before 5774', async () => {
		const response = calculateMolad(5770, 6); // August 10, 2010 6:52:00 AM and 0 chalakim
		expect(response.timeString).toBe('2010-08-10 06:52:00.000');
	});

	it('calculates molad before Nissan, in 5774', async () => {
		const response = calculateMolad(5774, 8); // October 4, 2013 11:30 PM and 3 chalakim
		expect(response.timeString).toBe('2013-10-04 23:30:10.000');
	});

	it('calculates molad after Nissan, in 5774', async () => {
		const response = calculateMolad(5774, 2); // April 29, 2014 4:38 PM and 10 chalakim
		expect(response.timeString).toBe('2014-04-29 16:38:33.333');
	});

	it('calculates molad on Adar II, in 5774', async () => {
		const response = calculateMolad(5774, 13); // March 1, 2014 3:10 (8 chalakim) PM
		expect(response.timeString).toBe('2014-03-01 15:10:26.667');
	});

	it('calculates molad on Adar II, before 5774', async () => {
		const response = calculateMolad(5771, 13); // March 5, 2011 12:00 AM and 7 chalakim
		expect(response.timeString).toBe('2011-03-05 00:00:23.333');
	});

	it('calculates molad on Adar II, after 5774', async () => {
		const response = calculateMolad(5784, 13); // March 10, 2024 10:13 am and 6 chalakim
		expect(response.timeString).toBe('2024-03-10 10:13:20.000');
	});

	it('calculates molad in year 5767', async () => {
		const response = calculateMolad(5767, 12); // February 17, 2007 11:17:36 am 11 chalakim
		expect(response.timeString).toBe('2007-02-17 11:17:36.667');
	});

	it('calculates molad where 0 minutes should be omitted', async () => {
		const response = calculateMolad(5771, 13); // March 5, 2011, 12:00 am 7 chalakim
		expect(response.timeFormat['12Hr']).toBe('Saturday, March 5, 2011, 12:00 am and 7 chalakim');
		expect(response.timeFormat['24Hr']).toBe('Saturday, March 5, 2011, 00:00 and 7 chalakim');
		expect(response.dayOfWeekFormat['12Hr']).toBe('Saturday morning, 7 chalakim after 12:00 am');
		expect(response.dayOfWeekFormat['24Hr']).toBe('Saturday morning, 7 chalakim after 00:00');
		expect(response.hebrewDateFormat['12Hr']).toBe('29th of Adar, 5771, 12:00 am and 7 chalakim');
		expect(response.hebrewDateFormat['24Hr']).toBe('29th of Adar, 5771, 00:00 and 7 chalakim');
	});

	it('calculates molad where 0 chalakim should be omitted', async () => {
		const response = calculateMolad(5784, 7); // September 15, 2023 5:49:00 am
		expect(response.timeFormat['12Hr']).toBe('Friday, September 15, 2023, 5:49 am');
		expect(response.timeFormat['24Hr']).toBe('Friday, September 15, 2023, 05:49');
		expect(response.dayOfWeekFormat['12Hr']).toBe('Friday morning, 49 minutes after 5:00 am');
		expect(response.dayOfWeekFormat['24Hr']).toBe('Friday morning, 49 minutes after 05:00');
		expect(response.hebrewDateFormat['12Hr']).toBe('29th of Elul, 5783, 5:49 am');
		expect(response.hebrewDateFormat['24Hr']).toBe('29th of Elul, 5783, 05:49');
	});
});
