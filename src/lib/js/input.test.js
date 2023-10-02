import { describe, expect, it } from 'vitest';
import { query } from './input';
import { units } from '$lib/grammars/units';
import { getUnit } from './unitconverter';

describe('test units are valid', () => {
	it('test units are valid', async () => {
		for (const [unitType, unitMapping] of Object.entries(units)) {
			for (const unitId of Object.values(unitMapping)) {
				const unit = await getUnit(unitType, unitId);
				expect(unit).toBeDefined();
			}
		}
	});
});

describe('test unitConversionQuery', () => {
	it('convert 3.5 amah to meter', async () => {
		const sections = await query('convert 3.5 amah to meter');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 3.5 Amos to meters');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe(
			[
				"1.68021 meters (Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה)",
				'1.8669 meters (Rabbi Yaakov Kamenetsky - הרב יעקב קמנצקי)',
				"1.889125 meters (Rabbi Moshe Feinstein - ר' משה פיינשטיין (Standard))",
				"2.0447 meters (Rabbi Moshe Feinstein - ר' משה פיינשטיין (Stringent))",
				'2.02019996 meters (Chazon Ish - חזון איש (Standard))',
				'2.1 meters (Chazon Ish - חזון איש (Stringent))',
			].join('\n')
		);
	});

	it('convert 1 amos to tefachim', async () => {
		const sections = await query('convert 1 amah to tefachim');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 1 Amah to Tefachim');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('6 Tefachim');
	});

	it('how many amos are in a parsah?', async () => {
		const sections = await query('how many amos are in a parsah');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 1 Parsah to Amos');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('8000 Amos');
	});

	it('40 seah to us liquid gallons', async () => {
		const sections = await query('40 seah to us liquid gallons');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 40 Seah to US liquid gallons');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe(
			[
				"87.6459468 US liquid gallons (Desert (Rabbi Avraham Chaim Naeh) - מדבריות (ר' אברהם חיים נאה)",
				'150.94579727 US liquid gallons (Desert (Chazon Ish) - מדבריות (חזון איש)',
				"89.01541472 US liquid gallons (Jerusalem (Rabbi Avraham Chaim Naeh) - ירושלמיות (ר' אברהם חיים נאה)",
				'181.78418596 US liquid gallons (Jerusalem (Chazon Ish) - ירושלמיות (חזון איש)',
				"126.59970093 US liquid gallons (Tzipori (Rabbi Avraham Chaim Naeh) - ציפוריות (ר' אברהם חיים נאה)",
				'217.49179391 US liquid gallons (Tzipori (Chazon Ish) - ציפוריות (חזון איש)',
			].join('\n')
		);
	});

	it('convert 1 us dollar to perutos', async () => {
		const sections = await query('convert 1 us dollar to perutos');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 1 US Dollar (USD) to Perutos');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(' Perutos (Shulchan Aruch / Rambam - שולחן ערוך / רמב״ם)');
		expect(sections[1].content).toContain(' Perutos (Rashi - רש״י)');
		expect(sections[1].content).toContain(' Perutos (Other authorities - פוסקים אחרים)');
	});

	it('how many chalakim are in an hour?', async () => {
		const sections = await query('how many chalakim are in an hour');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 1 hour to Chalakim');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('1080 Chalakim');
	});

	it('conversion chart for derech yom', async () => {
		const sections = await query('conversion chart for derech yom');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Show conversion chart for Derech Yom');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('1 Derech Yom');
		expect(sections[1].content).toContain("10 Parsa'os");
		expect(sections[1].content).toContain('40 Milin');
		expect(sections[1].content).toContain('Rabbi Avraham Chaim Naeh');
		expect(sections[1].content).toContain('38.4048 kilometers');
		expect(sections[1].content).toContain('Rabbi Yaakov Kamenetsky');
		expect(sections[1].content).toContain('42.672 kilometers');
		expect(sections[1].content).toContain('Rabbi Moshe Feinstein');
		expect(sections[1].content).toContain('43.18 kilometers');
		expect(sections[1].content).toContain('46.736 kilometers');
		expect(sections[1].content).toContain('Chazon Ish');
		expect(sections[1].content).toContain('46.17599909 kilometers');
		expect(sections[1].content).toContain('47.99999991 kilometers');
	});
});
