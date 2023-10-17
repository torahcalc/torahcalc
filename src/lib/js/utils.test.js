import { describe, expect, it } from 'vitest';
import { formatDate, formatNumber, formatNumberHTML } from './utils';

describe('test format Gregorian date', () => {
	it('formats 2023-09-12', () => {
		expect(formatDate(2023, 9, 12)).toBe('Tue, September 12, 2023');
	});

	it('formats 2024-03-11', () => {
		expect(formatDate(2024, 3, 11)).toBe('Mon, March 11, 2024');
	});

	it('formats -0001-01-01', () => {
		expect(formatDate(-1, 1, 1)).toBe('Sat, January 1, -0001');
	});

	it('formats -0002-12-31', () => {
		expect(formatDate(-2, 12, 31)).toBe('Fri, December 31, -0002');
	});

	it('does not format year 0', () => {
		expect(() => formatDate(0, 1, 1)).toThrow();
	});
});

describe('test formatNumber', () => {
	it('formats 1234567890', () => {
		expect(formatNumber(1234567890)).toBe('1 234 567 890');
	});

	it('formats 1234567890.12345678', () => {
		expect(formatNumber(1234567890.1234567)).toBe('1 234 567 890.1234567');
	});

	it('formats 8000', () => {
		expect(formatNumber(8000)).toBe('8 000');
	});

	it('formats 8000.12300000001', () => {
		expect(formatNumber(8000.12300000001)).toBe('8 000.123');
	});
});

describe('test formatNumberHTML', () => {
	it('formats 1234567890.12345678', () => {
		expect(formatNumberHTML(1234567890.1234567)).toBe(`<span class="number">${formatNumber(1234567890.1234567)}</span>`);
	});
});
