import { describe, it, expect } from 'vitest';
import { formatDate } from './utils';

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
