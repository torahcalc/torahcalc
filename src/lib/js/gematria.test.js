import { describe, it, expect } from 'vitest';
import { calculateGematria, getNumberOfWords, METHODS } from './gematria';

describe('test METHODS', () => {
	it('has 27 numbers in each method', () => {
		for (const method of Object.values(METHODS)) {
			expect(method.length).toBe(27);
		}
	});
});

describe('test getNumberOfWords', () => {
	it('counts words', () => {
		expect(getNumberOfWords('')).toBe(0);
		expect(getNumberOfWords('תורה')).toBe(1);
		expect(getNumberOfWords('תורה שבכתב')).toBe(2);
		expect(getNumberOfWords('א-ב')).toBe(2);
		expect(getNumberOfWords('א-ב ג-ד')).toBe(4);
	});
});

describe('test calculateGematria', () => {
	it('calculates gematria', () => {
		const gematria = calculateGematria({ text: 'תורה', miluiInput: METHODS.ofanim });
		expect(gematria.ofanim).toBe(80);
		expect(gematria.achasbeta).toBe(8);
		expect(gematria.avgad).toBe(2);
		expect(gematria.reverse_avgad).toBe(400);
		expect(gematria.shemi).toBe(111);
	});
});
