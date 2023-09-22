import { describe, it, expect } from 'vitest';
import { getConverters, getUnits, getOpinions, getUnit, getOpinion, getDefaultOpinion, convertUnits } from './unitconverter';

describe('test getConverters', () => {
	it('returns all converters', async () => {
		const converters = await getConverters(false);
		expect('length' in converters).toBe(true);
		expect('weight' in converters).toBe(true);
		expect('volume' in converters).toBe(true);
		expect('area' in converters).toBe(true);
		expect('coins' in converters).toBe(true);
		expect(converters.coins.units.usd.value).toBeGreaterThan(30000);
		expect(converters.coins.units.usd.value).toBeLessThan(50000);
		// updated should be before current time
		expect(converters.coins.units.usd.updated).toBeLessThanOrEqual(new Date().getTime());

		// ! NOTE: getConverters(true) is not yet tested because "fetch" is not available globally in tests
	});
});

describe('test getUnits', () => {
	it('returns all units', async () => {
		const converters = await getConverters(false);
		const units = getUnits(converters);
		expect('length' in units).toBe(true);
		expect('weight' in units).toBe(true);
		expect('volume' in units).toBe(true);
		expect('area' in units).toBe(true);
		expect('coins' in units).toBe(true);
		expect('time' in units).toBe(true);
	});
});

describe('test getOpinions', () => {
	it('returns all opinions', async () => {
		const converters = await getConverters(false);
		const opinions = getOpinions(converters);
		expect('length' in opinions).toBe(true);
		expect('volume' in opinions).toBe(true);
		expect('area' in opinions).toBe(true);
		expect('coins' in opinions).toBe(true);
	});
});

describe('test getUnit', () => {
	it('returns unit', async () => {
		const unit = await getUnit('length', 'meter');
		expect(unit.name).toBe('Meter');
		expect(unit.type).toBe('STANDARD');
		expect(unit.value).toBe(38404.8);

		const unit2 = await getUnit('coins', 'usd');
		expect(unit2.name).toBe('US Dollars (USD)');
		expect(unit2.type).toBe('STANDARD');
		expect(unit2.value).toBeGreaterThan(30000);
		expect(unit2.value).toBeLessThan(50000);
		// updated should be before current time
		expect(unit2.updated).toBeLessThanOrEqual(new Date().getTime());

		const unit3 = await getUnit('length', 'amah');
		expect(unit3.name).toBe('Amah - אמה');
		expect(unit3.type).toBe('BIBLICAL');
		expect(unit3.value).toBe(80000);
	});
});

describe('test getOpinion and getDefaultOpinion', () => {
	it('returns opinion', async () => {
		const opinion = await getOpinion('length', 'rabbi_yaakov_kamenetsky');
		expect(opinion.name).toBe('Rabbi Yaakov Kamenetsky - הרב יעקב קמנצקי');
		expect(opinion.factor).toBe(10 / 9);

		const opinion2 = await getDefaultOpinion('length');
		if (opinion2 === null) {
			expect(opinion2).not.toBe(null);
			throw new Error('Default opinion should not be null');
		}
		expect(opinion2.name).toBe("Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה");
		expect(opinion2.factor).toBe(1);

		const opinion3 = await getDefaultOpinion('time');
		expect(opinion3).toBe(null); // there are no opinions for time
	});
});

describe('test convertUnits', () => {
	it('converts length units', async () => {
		const result = await convertUnits({ type: 'length', unitFromId: 'meter', unitToId: 'amah', amount: 1 });
		expect(result).toStrictEqual({
			from: 'Meter',
			opinion: "Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה",
			result: 2.083073,
			to: 'Amah - אמה',
		});

		const result2 = await convertUnits({ type: 'length', unitFromId: 'amah', unitToId: 'meter', amount: 1, opinionId: 'rabbi_yaakov_kamenetsky' });
		expect(result2).toStrictEqual({
			from: 'Amah - אמה',
			opinion: 'Rabbi Yaakov Kamenetsky - הרב יעקב קמנצקי',
			result: 0.5334,
			to: 'Meter',
		});

		const result3 = await convertUnits({ type: 'length', unitFromId: 'amah', unitToId: 'tefach', amount: 3.5 });
		expect(result3).toStrictEqual({
			from: 'Amah - אמה',
			result: 3.5 * 6,
			to: 'Tefach - טפח',
		});
	});

	it('converts volume units', async () => {
		const result = await convertUnits({ type: 'volume', unitFromId: 'liter', unitToId: 'reviis', amount: 1 });
		expect(result).toStrictEqual({
			from: 'Liter',
			opinion: "Desert (Rabbi Avraham Chaim Naeh) - מדבריות (ר' אברהם חיים נאה",
			result: 11.574074,
			to: "Revi'is - רביעית",
		});
	});

	it('converts area units', async () => {
		const result = await convertUnits({ type: 'area', unitFromId: 'amah_merubaas', unitToId: 'square_meter', amount: 1 });
		expect(result).toStrictEqual({
			from: 'Amah merubaas - אמה מרובעת',
			opinion: "Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה",
			result: 0.230458,
			to: 'Square meter',
		});
	});

	it('converts coins units', async () => {
		const result = await convertUnits({ type: 'coins', unitFromId: 'shekel', unitToId: 'dinar', amount: 1 });
		expect(result).toStrictEqual({
			from: 'Shekel - שקל',
			result: 2,
			to: 'Dinar / Zuz - דינר / זוז',
		});
	});

	it('converts time units', async () => {
		const result = await convertUnits({ type: 'time', unitFromId: 'hour', unitToId: 'minute', amount: 1 });
		expect(result).toStrictEqual({
			from: 'Hour',
			result: 60,
			to: 'Minute',
		});
	});
});
