import { describe, expect, it } from 'vitest';
import { convertUnits, convertUnitsMulti, getConverters, getDefaultOpinion, getOpinion, getOpinions, getUnit, getUnits } from './unitconverter';

const RABBI_AVRAHAM_CHAIM_NAEH = "Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה";
const ARUCH_HASHULCHAN = 'Aruch Hashulchan - ערוך השולחן';

describe('test getConverters', () => {
	it('returns all converters', async () => {
		const converters = await getConverters(false);
		expect('length' in converters).toBe(true);
		expect('weight' in converters).toBe(true);
		expect('volume' in converters).toBe(true);
		expect('area' in converters).toBe(true);
		expect('coins' in converters).toBe(true);
		expect(converters.coins.units.usd.value).toBeGreaterThan(5000);
		expect(converters.coins.units.usd.value).toBeLessThan(500000);

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
		expect(unit.value).toBe(38400);

		const unit2 = await getUnit('coins', 'usd');
		expect(unit2.name).toBe('US Dollars (USD)');
		expect(unit2.type).toBe('STANDARD');
		expect(unit2.value).toBeGreaterThan(5000);
		expect(unit2.value).toBeLessThan(500000);

		const unit3 = await getUnit('length', 'amah');
		expect(unit3.name).toBe('Amah - אמה');
		expect(unit3.type).toBe('BIBLICAL');
		expect(unit3.value).toBe(80000);
	});
});

describe('test getOpinion and getDefaultOpinion', () => {
	it('returns opinion', async () => {
		const opinion = await getOpinion('length', 'aruch_hashulchan');
		expect(opinion.name).toBe(ARUCH_HASHULCHAN);
		expect(opinion.factor).toBeCloseTo(10 / 9);

		const opinion2 = await getDefaultOpinion('length');
		if (opinion2 === null) {
			expect(opinion2).not.toBe(null);
			throw new Error('Default opinion should not be null');
		}
		expect(opinion2.name).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(opinion2.factor).toBe(1);

		const opinion3 = await getDefaultOpinion('time');
		expect(opinion3).toBe(null); // there are no opinions for time
	});
});

describe('test convertUnits', () => {
	it('converts length units', async () => {
		let result = await convertUnits({ type: 'length', unitFromId: 'meter', unitToId: 'amah', amount: 1 });
		expect(result.from).toBe('Meter');
		expect(result.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.result).toBeCloseTo(2.0833333333333335);
		expect(result.to).toBe('Amah - אמה');
		expect(result.min).toBeCloseTo(2.0408163265306127);
		expect(result.max).toBeCloseTo(2.1276595744680855);

		result = await convertUnits({ type: 'length', unitFromId: 'meter', unitToId: 'amah', amount: -1 });
		expect(result.from).toBe('Meter');
		expect(result.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.result).toBeCloseTo(-2.0833333333333335);
		expect(result.to).toBe('Amah - אמה');
		expect(result.min).toBeCloseTo(-2.1276595744680855);
		expect(result.max).toBeCloseTo(-2.0408163265306127);

		result = await convertUnits({ type: 'length', unitFromId: 'amah', unitToId: 'centimeter', amount: 1 });
		expect(result.from).toBe('Amah - אמה');
		expect(result.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.result).toBeCloseTo(48);
		expect(result.to).toBe('Centimeter');
		expect(result.min).toBeCloseTo(47);
		expect(result.max).toBeCloseTo(49);

		result = await convertUnits({ type: 'length', unitFromId: 'amah', unitToId: 'centimeter', amount: -1 });
		expect(result.from).toBe('Amah - אמה');
		expect(result.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.result).toBeCloseTo(-48);
		expect(result.to).toBe('Centimeter');
		expect(result.min).toBeCloseTo(-49);
		expect(result.max).toBeCloseTo(-47);

		result = await convertUnits({ type: 'length', unitFromId: 'amah', unitToId: 'meter', amount: 1, opinionId: 'aruch_hashulchan' });
		expect(result.from).toBe('Amah - אמה');
		expect(result.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.result).toBeCloseTo(0.5334);
		expect(result.to).toBe('Meter');
		expect(result.min).not.toBeDefined();
		expect(result.max).not.toBeDefined();

		result = await convertUnits({ type: 'length', unitFromId: 'amah', unitToId: 'tefach', amount: 3.5 });
		expect(result.from).toBe('Amah - אמה');
		expect(result.result).toBeCloseTo(21);
		expect(result.to).toBe('Tefach - טפח');
		expect(result.min).not.toBeDefined();
		expect(result.max).not.toBeDefined();

		result = await convertUnits({ type: 'length', unitFromId: 'foot', unitToId: 'amah', amount: 1, opinionId: 'aruch_hashulchan' });
		expect(result.from).toBe('Foot');
		expect(result.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.result).toBeCloseTo(0.5714285714285714);
		expect(result.to).toBe('Amah - אמה');
		expect(result.min).not.toBeDefined();
		expect(result.max).not.toBeDefined();
	});

	it('converts volume units', async () => {
		const result = await convertUnits({ type: 'volume', unitFromId: 'liter', unitToId: 'reviis', amount: 1 });
		expect(result.from).toBe('Liter');
		expect(result.opinion).toBe("Rabbi Mordechai Willig - ר' מרדכי ויליג");
		expect(result.result).toBeCloseTo(14.8148);
		expect(result.to).toBe("Revi'is - רביעית");
	});

	it('converts area units', async () => {
		const result = await convertUnits({ type: 'area', unitFromId: 'amah_merubaas', unitToId: 'square_meter', amount: 1 });
		expect(result.from).toBe('Amah merubaas - אמה מרובעת');
		expect(result.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.result).toBeCloseTo(0.2304);
		expect(result.to).toBe('Square meter');
	});

	it('converts coins units', async () => {
		const result = await convertUnits({ type: 'coins', unitFromId: 'shekel', unitToId: 'dinar', amount: 1 });
		expect(result.from).toBe('Shekel - שקל');
		expect(result.result).toBe(2);
		expect(result.to).toBe('Dinar / Zuz - דינר / זוז');
	});

	it('converts time units', async () => {
		const result = await convertUnits({ type: 'time', unitFromId: 'hour', unitToId: 'minute', amount: 1 });
		expect(result.from).toBe('Hour');
		expect(result.result).toBe(60);
		expect(result.to).toBe('Minute');
	});
});

describe('test convertUnitsMulti', () => {
	it('converts length units from biblical unit', async () => {
		const result = await convertUnitsMulti({ type: 'length', unitFromId: 'derech_yom', amount: 1 });
		expect(result.derech_yom.result).toBe(1);
		expect(result.derech_yom.opinion).toBe(undefined);
		expect(result.parsah.result).toBe(10);
		expect(result.parsah.opinion).toBe(undefined);
		expect(result.mil.result).toBe(40);
		expect(result.mil.opinion).toBe(undefined);
		expect(result.ris.result).toBe(300);
		expect(result.ris.opinion).toBe(undefined);
		expect(result.kaneh.result).toBe(13333.333333333334);
		expect(result.kaneh.opinion).toBe(undefined);
		expect(result.amah.result).toBe(80000);
		expect(result.amah.opinion).toBe(undefined);
		expect(result.short_amah.result).toBe(96000);
		expect(result.short_amah.opinion).toBe(undefined);
		expect(result.zeret.result).toBe(160000);
		expect(result.zeret.opinion).toBe(undefined);
		expect(result.tefach.result).toBe(480000);
		expect(result.tefach.opinion).toBe(undefined);
		expect(result.etzbah.result).toBe(1920000);
		expect(result.etzbah.opinion).toBe(undefined);
		expect(result.kilometer.result).toBe(38.4);
		expect(result.kilometer.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.meter.result).toBe(38400);
		expect(result.meter.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.centimeter.result).toBe(3840000);
		expect(result.centimeter.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.millimeter.result).toBe(38400000);
		expect(result.millimeter.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.mile.result).toBeCloseTo(23.86363636);
		expect(result.mile.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.yard.result).toBe(41994.75065616798);
		expect(result.yard.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.foot.result).toBe(125984.25196850393);
		expect(result.foot.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.inch.result).toBe(1511811.0236220472);
		expect(result.inch.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
		expect(result.nautical_mile.result).toBeCloseTo(20.73693305);
		expect(result.nautical_mile.opinion).toBe(RABBI_AVRAHAM_CHAIM_NAEH);
	});

	it('converts length units with opinion from standard', async () => {
		const result = await convertUnitsMulti({ type: 'length', unitFromId: 'kilometer', amount: 3, opinionId: 'aruch_hashulchan' });
		expect(result.derech_yom.result).toBeCloseTo((3 / 38.4048 / 10) * 9);
		expect(result.derech_yom.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.parsah.result).toBeCloseTo((3 / 38.4048 / 10) * 9 * 10);
		expect(result.parsah.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.mil.result).toBeCloseTo((3 / 38.4048 / 10) * 9 * 40);
		expect(result.mil.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.ris.result).toBeCloseTo((3 / 38.4048 / 10) * 9 * 300);
		expect(result.ris.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.kaneh.result).toBeCloseTo((3 / 38.4048 / 10) * 9 * 13333.333333333334);
		expect(result.kaneh.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.amah.result).toBeCloseTo((3 / 38.4048 / 10) * 9 * 80000);
		expect(result.amah.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.short_amah.result).toBeCloseTo((3 / 38.4048 / 10) * 9 * 96000);
		expect(result.short_amah.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.zeret.result).toBeCloseTo((3 / 38.4048 / 10) * 9 * 160000);
		expect(result.zeret.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.tefach.result).toBeCloseTo((3 / 38.4048 / 10) * 9 * 480000);
		expect(result.tefach.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.etzbah.result).toBeCloseTo((3 / 38.4048 / 10) * 9 * 1920000);
		expect(result.etzbah.opinion).toBe(ARUCH_HASHULCHAN);
		expect(result.kilometer.result).toBeCloseTo(3);
		expect(result.kilometer.opinion).toBe(undefined);
		expect(result.meter.result).toBeCloseTo(3000);
		expect(result.meter.opinion).toBe(undefined);
		expect(result.centimeter.result).toBeCloseTo(300000);
		expect(result.centimeter.opinion).toBe(undefined);
		expect(result.millimeter.result).toBeCloseTo(3000000);
		expect(result.millimeter.opinion).toBe(undefined);
		expect(result.mile.result).toBeCloseTo(1.86454545);
		expect(result.mile.opinion).toBe(undefined);
		expect(result.yard.result).toBeCloseTo(3280.839895);
		expect(result.yard.opinion).toBe(undefined);
		expect(result.foot.result).toBeCloseTo(9842.519685);
		expect(result.foot.opinion).toBe(undefined);
		expect(result.inch.result).toBeCloseTo(118110.2362);
		expect(result.inch.opinion).toBe(undefined);
		expect(result.nautical_mile.result).toBeCloseTo(1.6198704);
		expect(result.nautical_mile.opinion).toBe(undefined);
	});

	it('converts time units from biblical', async () => {
		const result = await convertUnitsMulti({ type: 'time', unitFromId: 'shanah', amount: 1 });
		expect(result.yovel.result).toBeCloseTo(1 / 50);
		expect(result.yovel.opinion).toBe(undefined);
		expect(result.shmittah.result).toBeCloseTo(1 / 7.142857142857143);
		expect(result.shmittah.opinion).toBe(undefined);
		expect(result.shanah.result).toBeCloseTo(1);
		expect(result.shanah.opinion).toBe(undefined);
		expect(result.tekufah.result).toBeCloseTo(4);
		expect(result.tekufah.opinion).toBe(undefined);
		expect(result.chodesh.result).toBeCloseTo(12);
		expect(result.chodesh.opinion).toBe(undefined);
		expect(result.shavuah.result).toBeCloseTo(50.57142857);
		expect(result.shavuah.opinion).toBe(undefined);
		expect(result.yom.result).toBeCloseTo(354);
		expect(result.yom.opinion).toBe(undefined);
		expect(result.onah.result).toBeCloseTo(708);
		expect(result.onah.opinion).toBe(undefined);
		expect(result.shaah.result).toBeCloseTo(8496);
		expect(result.shaah.opinion).toBe(undefined);
		expect(result.hiluch_mil.result).toBeCloseTo(28320);
		expect(result.hiluch_mil.opinion).toBe(undefined);
		expect(result.hiluch_mil.unitOpinions).toStrictEqual(['Shulchan Aruch Harav (Hiluch Mil = 18 minutes)']);
		expect(result.kdei_achilas_pras.result).toBeCloseTo(254880);
		expect(result.kdei_achilas_pras.opinion).toBe(undefined);
		expect(result.kdei_achilas_pras.unitOpinions).toStrictEqual(["Chasam Sofer (K'dei Achilas Pras = 2 minutes)"]);
		expect(result.small_onah.result).toBeCloseTo(203904);
		expect(result.small_onah.opinion).toBe(undefined);
		expect(result.et.result).toBeCloseTo(4893696);
		expect(result.et.opinion).toBe(undefined);
		expect(result.chelek.result).toBeCloseTo(9175680);
		expect(result.chelek.opinion).toBe(undefined);
		expect(result.rega.result).toBeCloseTo(697351680);
		expect(result.rega.opinion).toBe(undefined);
		expect(result.century.result).toBeCloseTo(0.0096986302);
		expect(result.century.opinion).toBe(undefined);
		expect(result.decade.result).toBeCloseTo(0.0969863014);
		expect(result.decade.opinion).toBe(undefined);
		expect(result.year.result).toBeCloseTo(0.9698630137);
		expect(result.year.opinion).toBe(undefined);
		expect(result.month.result).toBeCloseTo(11.6383561644);
		expect(result.month.opinion).toBe(undefined);
		expect(result.week.result).toBeCloseTo(50.5714285714);
		expect(result.week.opinion).toBe(undefined);
		expect(result.day.result).toBeCloseTo(354);
		expect(result.day.opinion).toBe(undefined);
		expect(result.hour.result).toBeCloseTo(8496);
		expect(result.hour.opinion).toBe(undefined);
		expect(result.minute.result).toBeCloseTo(509760);
		expect(result.minute.opinion).toBe(undefined);
		expect(result.second.result).toBeCloseTo(30585600);
		expect(result.second.opinion).toBe(undefined);
		expect(result.millisecond.result).toBeCloseTo(30585600000);
		expect(result.millisecond.opinion).toBe(undefined);
	});
});
