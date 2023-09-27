import { describe, expect, it } from 'vitest';
import { nextBirkasHachama } from './hachama';

describe('test nextBirkasHachama', () => {
	it('calculates next birkas hachama from year before', async () => {
		const result = nextBirkasHachama(2008);
		expect(result.gregorianDate.date).toBe('2009-04-08');
		expect(result.gregorianDate.display).toBe('Wed, April 8, 2009');
		expect(result.hebrewDate.displayEn).toBe('14th of Nissan, 5769');
	});

	it('calculates next birkas hachama from same year', async () => {
		const result = nextBirkasHachama(2009);
		expect(result.gregorianDate.date).toBe('2009-04-08');
		expect(result.gregorianDate.display).toBe('Wed, April 8, 2009');
		expect(result.hebrewDate.displayEn).toBe('14th of Nissan, 5769');
	});

	it('calculates next birkas hachama from year after', async () => {
		const result = nextBirkasHachama(2010);
		expect(result.gregorianDate.date).toBe('2037-04-08');
		expect(result.gregorianDate.display).toBe('Wed, April 8, 2037');
		expect(result.hebrewDate.displayEn).toBe('23rd of Nissan, 5797');
	});

	it('calculates next birkas hachama from 1800', async () => {
		const result = nextBirkasHachama(1800);
		expect(result.gregorianDate.date).toBe('1813-04-07');
		expect(result.gregorianDate.display).toBe('Wed, April 7, 1813');
		expect(result.hebrewDate.displayEn).toBe('7th of Nissan, 5573');
	});

	it('calculates next birkas hachama from 2222', async () => {
		const result = nextBirkasHachama(2222);
		expect(result.gregorianDate.date).toBe('2233-04-10');
		expect(result.gregorianDate.display).toBe('Wed, April 10, 2233');
		expect(result.hebrewDate.displayEn).toBe('29th of Adar II, 5993');
	});

	it('calculates next birkas hachama from 0', async () => {
		const result = nextBirkasHachama(0);
		expect(result.gregorianDate.date).toBe('0021-03-24');
		expect(result.gregorianDate.display).toBe('Wed, March 24, 0021');
		expect(result.hebrewDate.displayEn).toBe('24th of Adar II, 3781');
	});

	it('calculates next birkas hachama from 22', async () => {
		const result = nextBirkasHachama(22);
		expect(result.gregorianDate.date).toBe('0049-03-24');
		expect(result.gregorianDate.display).toBe('Wed, March 24, 0049');
		expect(result.hebrewDate.displayEn).toBe('4th of Nissan, 3809');
	});

	it('calculates next birkas hachama from -100', async () => {
		const result = nextBirkasHachama(-100);
		expect(result.gregorianDate.date).toBe('-000090-03-24');
		expect(result.gregorianDate.display).toBe('Fri, March 24, -0090');
		expect(result.hebrewDate.displayEn).toBe('7th of Nissan, 3671');
	});

	it('calculates next birkas hachama from 9500', async () => {
		const result = nextBirkasHachama(9500);
		expect(result.gregorianDate.date).toBe('9513-06-04');
		expect(result.gregorianDate.display).toBe('Wed, June 4, 9513');
		expect(result.hebrewDate.displayEn).toBe('26th of Nissan, 13273');
	});
});
