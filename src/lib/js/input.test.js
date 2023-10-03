import { describe, expect, it } from 'vitest';
import { calculateQuery } from './input';
import { units } from '$lib/grammars/units';
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
		expect(sections[0].content).toBe('Convert <span class="number">3.5</span> Amos to meters');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('<span class="number">1.68021</span> meters');
		expect(sections[1].content).toContain('Rabbi Avraham Chaim Naeh');
		expect(sections[1].content).toContain('<span class="number">1.8669</span> meters');
		expect(sections[1].content).toContain('Rabbi Yaakov Kamenetsky');
		expect(sections[1].content).toContain('<span class="number">1.889125</span> meters');
		expect(sections[1].content).toContain('<span class="number">2.0447</span> meters');
		expect(sections[1].content).toContain('Rabbi Moshe Feinstein');
		expect(sections[1].content).toContain('<span class="number">2.02019996</span> meters');
		expect(sections[1].content).toContain('<span class="number">2.1</span> meters');
		expect(sections[1].content).toContain('Chazon Ish');
	});

	it('convert 1 amos to tefachim', async () => {
		const sections = await calculateQuery('convert 1 amah to tefachim');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert <span class="number">1</span> Amah to Tefachim');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('<span class="number">6</span> Tefachim');
	});

	it('how many amos are in a parsah?', async () => {
		const sections = await calculateQuery('how many amos are in a parsah');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert <span class="number">1</span> Parsah to Amos');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('<span class="number">8\u2009000</span> Amos');
	});

	it('40 seah to us liquid gallons', async () => {
		const sections = await calculateQuery('40 seah to us liquid gallons');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert <span class="number">40</span> Seah to US liquid gallons');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('<span class="number">87.6459468</span> US liquid gallons');
		expect(sections[1].content).toContain('<span class="number">150.94579727</span> US liquid gallons');
		expect(sections[1].content).toContain('<span class="number">89.01541472</span> US liquid gallons');
		expect(sections[1].content).toContain('<span class="number">181.78418596</span> US liquid gallons');
		expect(sections[1].content).toContain('<span class="number">126.59970093</span> US liquid gallons');
		expect(sections[1].content).toContain('<span class="number">217.49179391</span> US liquid gallons');
	});

	it('convert 1 us dollar to perutos', async () => {
		const sections = await calculateQuery('convert 1 us dollar to perutos');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert <span class="number">1</span> US Dollar to Perutos');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(' Perutos');
		expect(sections[1].content).toContain('Shulchan Aruch / Rambam - שולחן ערוך / רמב״ם');
		expect(sections[1].content).toContain('Rashi - רש״י');
		expect(sections[1].content).toContain('Other authorities - פוסקים אחרים');
	});

	it('how many chalakim are in an hour?', async () => {
		const sections = await calculateQuery('how many chalakim are in an hour');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert <span class="number">1</span> hour to Chalakim');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('<span class="number">1\u2009080</span> Chalakim');
	});

	it('1 min to kdei achilas peras', async () => {
		const sections = await calculateQuery('1 min to kdei achilas peras');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Convert <span class="number">1</span> minute to K'dei Achilas Peras`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(`<span class="number">0.5</span> K'dei Achilas Peras`);
		expect(sections[1].content).toContain(`Chasam Sofer (K'dei Achilas Pras = 2 minutes)`);
		expect(sections[1].content).toContain(`<span class="number">0.0896861</span> K'dei Achilas Peras`);
		expect(sections[1].content).toContain(`Darkei Hora'ah (K'dei Achilas Pras = 11 minutes and 9 seconds)`);
	});

	it('1 hiluch mil to kdei achilas peras', async () => {
		const sections = await calculateQuery('1 hiluch mil to kdei achilas peras');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Convert <span class="number">1</span> Hiluch Mil to K'dei Achilas Peras`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(`<span class="number">9</span> K'dei Achilas Peras`);
		expect(sections[1].content).toContain("Shulchan Aruch Harav (Hiluch Mil = 18 minutes), Chasam Sofer (K'dei Achilas Pras = 2 minutes)");
		expect(sections[1].content).toContain(`<span class="number">2.15246637</span> K'dei Achilas Peras`);
		expect(sections[1].content).toContain("Shulchan Aruch Harav (Hiluch Mil = 18 minutes), Darkei Hora'ah (K'dei Achilas Pras = 11 minutes and 9 seconds)");
	});

	it('conversion chart for derech yom', async () => {
		const sections = await calculateQuery('conversion chart for derech yom');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Show conversion chart for <span class="number">1</span> Derech Yom');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('<span class="number">1</span> Derech Yom');
		expect(sections[1].content).toContain(`<span class="number">10</span> Parsa'os`);
		expect(sections[1].content).toContain('<span class="number">40</span> Milin');
		expect(sections[1].content).toContain('Rabbi Avraham Chaim Naeh');
		expect(sections[1].content).toContain('<span class="number">38.4048</span> kilometers');
		expect(sections[1].content).toContain('Rabbi Yaakov Kamenetsky');
		expect(sections[1].content).toContain('<span class="number">42.672</span> kilometers');
		expect(sections[1].content).toContain('Rabbi Moshe Feinstein');
		expect(sections[1].content).toContain('<span class="number">43.18</span> kilometers');
		expect(sections[1].content).toContain('<span class="number">46.736</span> kilometers');
		expect(sections[1].content).toContain('Chazon Ish');
		expect(sections[1].content).toContain('<span class="number">46.17599909</span> kilometers');
		expect(sections[1].content).toContain('<span class="number">47.99999991</span> kilometers');
	});

	it('chart for hiluch mil', async () => {
		const sections = await calculateQuery('chart for hiluch mil');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Show conversion chart for <span class="number">1</span> Hiluch Mil');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('<span class="number">1</span> Hiluch Mil');
		expect(sections[1].content).toContain('<span class="number">0.00000071</span> Yovelos');
		expect(sections[1].content).toContain('<span class="number">0.00000088</span> Yovelos');
		expect(sections[1].content).toContain('<span class="number">0.00000094</span> Yovelos');
	});
});
