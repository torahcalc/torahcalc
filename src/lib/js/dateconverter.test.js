import { describe, it, expect } from 'vitest';
import { gregorianToHebrew, hebrewToGregorian } from './dateconverter';

describe('test gregorian to hebrew date conversion', () => {
	it('converts 2023-09-12', () => {
		const { year, month, day } = gregorianToHebrew({ year: 2023, month: 9, day: 12 });
		expect(year).toBe(5783);
		expect(month).toBe(6);
		expect(day).toBe(26);
	});

	it('converts 2024-03-11', () => {
		const { year, month, day } = gregorianToHebrew({ year: 2024, month: 3, day: 11 });
		expect(year).toBe(5784);
		expect(month).toBe(13);
		expect(day).toBe(1);
	});

	it('test afterSunset', () => {
		const { year, month, day } = gregorianToHebrew({ year: 2023, month: 9, day: 11, afterSunset: true });
		expect(year).toBe(5783);
		expect(month).toBe(6);
		expect(day).toBe(26);
	});

	it('convert year 0', () => {
		expect(() => gregorianToHebrew({ year: 0, month: 1, day: 1 })).toThrow();
	});

	it('convert year before epoch', () => {
		const { year, month, day } = gregorianToHebrew({ year: -1, month: 1, day: 1 });
		expect(year).toBe(3760);
		expect(month).toBe(11);
		expect(day).toBe(8);
	});
});

describe('test hebrew to gregorian date conversion', () => {
	it('converts 26 Elul 5783', () => {
		const { date, year, month, day } = hebrewToGregorian({ year: 5783, month: 6, day: 26 });
		expect(date).toEqual(new Date(2023, 8, 12)); // 2023-09-12
		expect(year).toBe(2023);
		expect(month).toBe(9);
		expect(day).toBe(12);
	});

	it('converts 1 Adar II 5784', () => {
		const { date, year, month, day } = hebrewToGregorian({ year: 5784, month: 13, day: 1 });
		expect(date).toEqual(new Date(2024, 2, 11)); // 2024-03-11
		expect(year).toBe(2024);
		expect(month).toBe(3);
		expect(day).toBe(11);
	});

	it('test afterSunset', () => {
		const { date, year, month, day } = hebrewToGregorian({ year: 5783, month: 6, day: 26, afterSunset: true });
		expect(date).toEqual(new Date(2023, 8, 11)); // 2023-09-11
		expect(year).toBe(2023);
		expect(month).toBe(9);
		expect(day).toBe(11);
	});

	it('convert year before epoch', () => {
		expect(() => hebrewToGregorian({ year: 0, month: 1, day: 1 })).toThrow();
		expect(() => hebrewToGregorian({ year: -1, month: 1, day: 1 })).toThrow();
	});

	it('convert year when gregorian year is -1', () => {
		const { date, year, month, day } = hebrewToGregorian({ year: 3760, month: 11, day: 8 });
		const expectedDate = new Date(2023, 0, 1);
		expectedDate.setFullYear(0);  // JavaScript Date object uses 0 for year 1 BCE
		expect(date).toEqual(expectedDate);  // 0000-01-01
		expect(year).toBe(-1);  // The actual year is 1 BCE even though in JavaScript it is 0
		expect(month).toBe(1);
		expect(day).toBe(1);
	});

	it('convert year when gregorian year is -2', () => {
		const { date, year, month, day } = hebrewToGregorian({ year: 3759, month: 11, day: 8 });
		const expectedDate = new Date(2023, 0, 11);
		expectedDate.setFullYear(-1);  // JavaScript Date object uses -1 for year 2 BCE
		expect(date).toEqual(expectedDate);  // January 11, -0001
		expect(year).toBe(-2);  // The actual year is 2 BCE even though in JavaScript it is -1
		expect(month).toBe(1);
		expect(day).toBe(11);
	});
});
