import { describe, expect, it } from 'vitest';
import { calculateQuery } from './input';
import { units } from '$lib/grammars/scripts/units';
import { getUnit } from './unitconverter';

describe('test units are valid', () => {
	it('test units are valid', async () => {
		for (const [unitType, unitMapping] of Object.entries(units)) {
			for (const unitIds of Object.values(unitMapping)) {
				for (const unitId of unitIds) {
					const unit = await getUnit(unitType, unitId);
					expect(unit).toBeDefined();
				}
			}
		}
	});

	it('test that the unit id with underscores replaced with spaces is in the mapping', async () => {
		for (const unitMapping of Object.values(units)) {
			for (const unitIds of Object.values(unitMapping)) {
				for (const unitId of unitIds) {
					expect(unitMapping).toHaveProperty(unitId.replace(/_/g, ' '));
				}
			}
		}
	});
});

describe('test unitConversionQuery', () => {
	it('convert 3.5 amah to meter', async () => {
		const sections = await calculateQuery('convert 3.5 amah to meter');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 3.5 Amos to meters');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe(
			[
				`1.68021 meters - <span class="opinion">Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה</span>`,
				`1.8669 meters - <span class="opinion">Rabbi Yaakov Kamenetsky - הרב יעקב קמנצקי</span>`,
				`1.889125 meters - <span class="opinion">Rabbi Moshe Feinstein - ר' משה פיינשטיין (Standard)</span>`,
				`2.0447 meters - <span class="opinion">Rabbi Moshe Feinstein - ר' משה פיינשטיין (Stringent)</span>`,
				`2.02019996 meters - <span class="opinion">Chazon Ish - חזון איש (Standard)</span>`,
				`2.1 meters - <span class="opinion">Chazon Ish - חזון איש (Stringent)</span>`,
			].join('\n')
		);
	});

	it('convert 1 amos to tefachim', async () => {
		const sections = await calculateQuery('convert 1 amah to tefachim');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 1 Amah to Tefachim');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('6 Tefachim');
	});

	it('how many amos are in a parsah?', async () => {
		const sections = await calculateQuery('how many amos are in a parsah');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 1 Parsah to Amos');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('8000 Amos');
	});

	it('40 seah to us liquid gallons', async () => {
		const sections = await calculateQuery('40 seah to us liquid gallons');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 40 Seah to US liquid gallons');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe(
			[
				`87.6459468 US liquid gallons - <span class="opinion">Desert (Rabbi Avraham Chaim Naeh) - (מדבריות (ר' אברהם חיים נאה</span>`,
				`150.94579727 US liquid gallons - <span class="opinion">Desert (Chazon Ish) - (מדבריות (חזון איש</span>`,
				`89.01541472 US liquid gallons - <span class="opinion">Jerusalem (Rabbi Avraham Chaim Naeh) - (ירושלמיות (ר' אברהם חיים נאה</span>`,
				`181.78418596 US liquid gallons - <span class="opinion">Jerusalem (Chazon Ish) - (ירושלמיות (חזון איש</span>`,
				`126.59970093 US liquid gallons - <span class="opinion">Tzipori (Rabbi Avraham Chaim Naeh) - (ציפוריות (ר' אברהם חיים נאה</span>`,
				`217.49179391 US liquid gallons - <span class="opinion">Tzipori (Chazon Ish) - (ציפוריות (חזון איש</span>`,
			].join('\n')
		);
	});

	it('convert 1 us dollar to perutos', async () => {
		const sections = await calculateQuery('convert 1 us dollar to perutos');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 1 US Dollar to Perutos');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(' Perutos');
		expect(sections[1].content).toContain('Shulchan Aruch / Rambam - שולחן ערוך / רמב״ם');
		expect(sections[1].content).toContain('Rashi - רש״י');
		expect(sections[1].content).toContain('Other authorities - פוסקים אחרים');
	});

	it('how many chalakim are in an hour?', async () => {
		const sections = await calculateQuery('how many chalakim are in an hour');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 1 hour to Chalakim');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('1080 Chalakim');
	});

	it('1 min to kdei achilas peras', async () => {
		const sections = await calculateQuery('1 min to kdei achilas peras');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe("Convert 1 minute to K'dei Achilas Peras");
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(`0.5 K'dei Achilas Peras - <span class="opinion">Chasam Sofer (K'dei Achilas Pras = 2 minutes)</span>`);
		expect(sections[1].content).toContain(`0.0896861 K'dei Achilas Peras - <span class="opinion">Darkei Hora'ah (K'dei Achilas Pras = 11 minutes and 9 seconds)</span>`);
	});

	it('1 hiluch mil to kdei achilas peras', async () => {
		const sections = await calculateQuery('1 hiluch mil to kdei achilas peras');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe("Convert 1 Hiluch Mil to K'dei Achilas Peras");
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(`9 K'dei Achilas Peras - <span class="opinion">Shulchan Aruch Harav (Hiluch Mil = 18 minutes), Chasam Sofer (K'dei Achilas Pras = 2 minutes)</span>`);
		expect(sections[1].content).toContain(
			`2.15246637 K'dei Achilas Peras - <span class="opinion">Shulchan Aruch Harav (Hiluch Mil = 24 minutes), Darkei Hora'ah (K'dei Achilas Pras = 11 minutes and 9 seconds)</span>`
		);
	});

	it('conversion chart for derech yom', async () => {
		const sections = await calculateQuery('conversion chart for derech yom');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Show conversion chart for 1 Derech Yom');
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

	it('chart for hiluch mil', async () => {
		const sections = await calculateQuery('chart for hiluch mil');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Show conversion chart for 1 Hiluch Mil');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('1 Hiluch Mil');
		expect(sections[1].content).toContain('0.00000071 Yovelos');
		expect(sections[1].content).toContain('0.00000088 Yovelos');
		expect(sections[1].content).toContain('0.00000094 Yovelos');
	});
});
