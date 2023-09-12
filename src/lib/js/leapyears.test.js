import { describe, it, expect } from 'vitest';
import { isHebrewLeapYear, isGregorianLeapYear } from './leapyears.js';

describe('test hebrew leap years', () => {
	it('test non-leap year', () => {
		const result = isHebrewLeapYear({ year: 5781 });
		expect(result.isLeapYear).toBe(false);
		expect(result.reason).toBe(
			'5781 is the 5th year of the 19-year Metonic cycle and is therefore not a leap year.'
		);
		expect(result.nextLeapYear).toBe(5782);
		expect(result.nextLeapYearReason).toBe(
			'After 5781, the next leap year is 5782 – the 6th year of the cycle.'
		);
	});

	it('test leap year', () => {
		const result = isHebrewLeapYear({ year: 5782 });
		expect(result.isLeapYear).toBe(true);
		expect(result.reason).toBe(
			'5782 is the 6th year of the 19-year Metonic cycle and is therefore a leap year.'
		);
		expect(result.nextLeapYear).toBe(5784);
		expect(result.nextLeapYearReason).toBe(
			'After 5782, the next leap year is 5784 – the 8th year of the cycle.'
		);
	});

	it('test year 19 of the cycle', () => {
		const result = isHebrewLeapYear({ year: 5795 });
		expect(result.isLeapYear).toBe(true);
		expect(result.reason).toBe(
			'5795 is the 19th year of the 19-year Metonic cycle and is therefore a leap year.'
		);
		expect(result.nextLeapYear).toBe(5798);
		expect(result.nextLeapYearReason).toBe(
			'After 5795, the next leap year is 5798 – the 3rd year of the cycle.'
		);
	});
});

describe('test gregorian leap years', () => {
	it('test divisible by 400', () => {
		const result = isGregorianLeapYear({ year: 2000 });
		expect(result.isLeapYear).toBe(true);
		expect(result.reason).toBe('2000 is divisible by 400, and is therefore a leap year.');
		expect(result.nextLeapYear).toBe(2004);
		expect(result.nextLeapYearReason).toBe(
			'After 2000, the next leap year is 2004. 2004 is divisible by 4 and not by 100, and is therefore a leap year.'
		);
	});

	it('test divisible by 100 but not by 400', () => {
		const result = isGregorianLeapYear({ year: 1900 });
		expect(result.isLeapYear).toBe(false);
		expect(result.reason).toBe(
			'1900 is divisible by 100, but not by 400, and is therefore not a leap year.'
		);
		expect(result.nextLeapYear).toBe(1904);
		expect(result.nextLeapYearReason).toBe(
			'After 1900, the next leap year is 1904. 1904 is divisible by 4 and not by 100, and is therefore a leap year.'
		);
	});

	it('test divisible by 4 but not by 100', () => {
		const result = isGregorianLeapYear({ year: 2004 });
		expect(result.isLeapYear).toBe(true);
		expect(result.reason).toBe(
			'2004 is divisible by 4 and not by 100, and is therefore a leap year.'
		);
		expect(result.nextLeapYear).toBe(2008);
		expect(result.nextLeapYearReason).toBe(
			'After 2004, the next leap year is 2008. 2008 is divisible by 4 and not by 100, and is therefore a leap year.'
		);
	});

	it('test not divisible by 4', () => {
		const result = isGregorianLeapYear({ year: 2005 });
		expect(result.isLeapYear).toBe(false);
		expect(result.reason).toBe('2005 is not divisible by 4, and is therefore not a leap year.');
		expect(result.nextLeapYear).toBe(2008);
		expect(result.nextLeapYearReason).toBe(
			'After 2005, the next leap year is 2008. 2008 is divisible by 4 and not by 100, and is therefore a leap year.'
		);
	});
});
