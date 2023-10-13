import { describe, expect, it } from 'vitest';
import { calculateQuery } from './input';
import { formatNumberHTML } from './utils';

describe('test unit conversions', () => {
	it('convert 3.5 amah to meter', async () => {
		const sections = await calculateQuery('convert 3.5 amah to meter');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Convert ${formatNumberHTML(3.5)} Amos to meters`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(`${formatNumberHTML(1.68021)} meters`);
		expect(sections[1].content).toContain('Rabbi Avraham Chaim Naeh');
		expect(sections[1].content).toContain(`${formatNumberHTML(1.8669)} meters`);
		expect(sections[1].content).toContain('Rabbi Yaakov Kamenetsky');
		expect(sections[1].content).toContain(`${formatNumberHTML(1.889125)} meters`);
		expect(sections[1].content).toContain(`${formatNumberHTML(2.0447)} meters`);
		expect(sections[1].content).toContain('Rabbi Moshe Feinstein');
		expect(sections[1].content).toContain(`${formatNumberHTML(2.02019996)} meters`);
		expect(sections[1].content).toContain(`${formatNumberHTML(2.1)} meters`);
		expect(sections[1].content).toContain('Chazon Ish');
	});

	it('convert 1 amos to tefachim', async () => {
		const sections = await calculateQuery('convert 1 amah to tefachim');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Convert ${formatNumberHTML(1)} Amah to Tefachim`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe(`${formatNumberHTML(6)} Tefachim`);
	});

	it('how many amos are in a parsah?', async () => {
		const sections = await calculateQuery('how many amos are in a parsah');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Convert ${formatNumberHTML(1)} Parsah to Amos`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe(`${formatNumberHTML(8000)} Amos`);
	});

	it('40 seah to us liquid gallons', async () => {
		const sections = await calculateQuery('40 seah to us liquid gallons');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Convert ${formatNumberHTML(40)} Seah to US liquid gallons`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(`${formatNumberHTML(87.6459468)} US liquid gallons`);
		expect(sections[1].content).toContain(`${formatNumberHTML(150.94579727)} US liquid gallons`);
		expect(sections[1].content).toContain(`${formatNumberHTML(89.01541472)} US liquid gallons`);
		expect(sections[1].content).toContain(`${formatNumberHTML(181.78418596)} US liquid gallons`);
		expect(sections[1].content).toContain(`${formatNumberHTML(126.59970093)} US liquid gallons`);
		expect(sections[1].content).toContain(`${formatNumberHTML(217.49179391)} US liquid gallons`);
	});

	it('convert 1 us dollar to perutos', async () => {
		const sections = await calculateQuery('convert 1 us dollar to perutos');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Convert ${formatNumberHTML(1)} US Dollar to Perutos`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(' Perutos');
		expect(sections[1].content).toContain('Shulchan Aruch / Rambam - שולחן ערוך / רמב״ם');
		expect(sections[1].content).toContain('Rashi - רש״י');
		expect(sections[1].content).toContain('Other authorities - פוסקים אחרים');
	});

	it('how many chalakim are in an hour?', async () => {
		const sections = await calculateQuery('how many chalakim are in an hour');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Convert ${formatNumberHTML(1)} hour to Chalakim`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe(`${formatNumberHTML(1080)} Chalakim`);
	});

	it('1 min to kdei achilas peras', async () => {
		const sections = await calculateQuery('1 min to kdei achilas peras');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Convert ${formatNumberHTML(1)} minute to K'dei Achilas Peras`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(`${formatNumberHTML(0.5)} K'dei Achilas Peras`);
		expect(sections[1].content).toContain(`Chasam Sofer (K'dei Achilas Pras = 2 minutes)`);
		expect(sections[1].content).toContain(`${formatNumberHTML(0.0896861)} K'dei Achilas Peras`);
		expect(sections[1].content).toContain(`Darkei Hora'ah (K'dei Achilas Pras = 11 minutes and 9 seconds)`);
	});

	it('1 hiluch mil to kdei achilas peras', async () => {
		const sections = await calculateQuery('1 hiluch mil to kdei achilas peras');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Convert ${formatNumberHTML(1)} Hiluch Mil to K'dei Achilas Peras`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(`${formatNumberHTML(9)} K'dei Achilas Peras`);
		expect(sections[1].content).toContain("Shulchan Aruch Harav (Hiluch Mil = 18 minutes), Chasam Sofer (K'dei Achilas Pras = 2 minutes)");
		expect(sections[1].content).toContain(`${formatNumberHTML(2.15246637)} K'dei Achilas Peras`);
		expect(sections[1].content).toContain("Shulchan Aruch Harav (Hiluch Mil = 18 minutes), Darkei Hora'ah (K'dei Achilas Pras = 11 minutes and 9 seconds)");
	});
});

describe('test unit conversion charts', () => {
	it('conversion chart for derech yom', async () => {
		const sections = await calculateQuery('conversion chart for derech yom');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Show conversion chart for ${formatNumberHTML(1)} Derech Yom`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(`${formatNumberHTML(1)} Derech Yom`);
		expect(sections[1].content).toContain(`${formatNumberHTML(10)} Parsa'os`);
		expect(sections[1].content).toContain(`${formatNumberHTML(40)} Milin`);
		expect(sections[1].content).toContain('Rabbi Avraham Chaim Naeh');
		expect(sections[1].content).toContain(`${formatNumberHTML(38.4048)} kilometers`);
		expect(sections[1].content).toContain('Rabbi Yaakov Kamenetsky');
		expect(sections[1].content).toContain(`${formatNumberHTML(42.672)} kilometers`);
		expect(sections[1].content).toContain('Rabbi Moshe Feinstein');
		expect(sections[1].content).toContain(`${formatNumberHTML(43.18)} kilometers`);
		expect(sections[1].content).toContain(`${formatNumberHTML(46.736)} kilometers`);
		expect(sections[1].content).toContain('Chazon Ish');
		expect(sections[1].content).toContain(`${formatNumberHTML(46.17599909)} kilometers`);
		expect(sections[1].content).toContain(`${formatNumberHTML(47.99999991)} kilometers`);
	});

	it('chart for hiluch mil', async () => {
		const sections = await calculateQuery('chart for hiluch mil');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Show conversion chart for ${formatNumberHTML(1)} Hiluch Mil`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(`${formatNumberHTML(1)} Hiluch Mil`);
		expect(sections[1].content).toContain(`${formatNumberHTML(0.00000071)} Yovelos`);
		expect(sections[1].content).toContain(`${formatNumberHTML(0.00000088)} Yovelos`);
		expect(sections[1].content).toContain(`${formatNumberHTML(0.00000094)} Yovelos`);
	});
});

describe('test gematria calculation', () => {
	it('Calculate gematria of אברהם אבינו', async () => {
		const sections = await calculateQuery('Calculate gematria of אברהם אבינו');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Calculate Mispar Hechrachi (Standard Value) of "אברהם אבינו"');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(formatNumberHTML(317));
		expect(sections[1].content).toContain('Mispar Hechrachi (Standard Value)');
		expect(sections[2].title).toBe('Other Methods');
		expect(sections[2].content).toContain(formatNumberHTML(317));
		expect(sections[2].content).toContain(formatNumberHTML(877));
		expect(sections[2].content).toContain(formatNumberHTML(85));
		expect(sections[2].content).toContain(formatNumberHTML(29));
		expect(sections[2].content).toContain(formatNumberHTML(44271));
		expect(sections[2].content).toContain(formatNumberHTML(1780));
		expect(sections[2].content).toContain(formatNumberHTML(327));
		expect(sections[2].content).toContain(formatNumberHTML(1632));
		expect(sections[2].content).toContain(formatNumberHTML(604));
		expect(sections[2].content).toContain(formatNumberHTML(2052));
		expect(sections[2].content).toContain(formatNumberHTML(1234));
		expect(sections[2].content).toContain(formatNumberHTML(1463));
		expect(sections[2].content).toContain(formatNumberHTML(100489));
		expect(sections[2].content).toContain(formatNumberHTML(8190359));
		expect(sections[2].content).toContain(formatNumberHTML(1435));
		expect(sections[2].content).toContain(formatNumberHTML(4296));
		expect(sections[2].content).toContain(formatNumberHTML(2));
		expect(sections[2].content).toContain(formatNumberHTML(319));
		expect(sections[2].content).toContain(formatNumberHTML(625));
		expect(sections[2].content).toContain(formatNumberHTML(1383));
		expect(sections[2].content).toContain(formatNumberHTML(778));
		expect(sections[2].content).toContain(formatNumberHTML(1361));
		expect(sections[2].content).toContain(formatNumberHTML(690));
		expect(sections[2].content).toContain(formatNumberHTML(453));
		expect(sections[2].content).toContain(formatNumberHTML(990));
	});
});

describe('test gematria search', () => {
	it('What words have a gematria of 613?', async () => {
		const sections = await calculateQuery('What words have a gematria of 613?');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Find words and verses with the standard Gematria value equal to ${formatNumberHTML(613)}`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('אורות');
		expect(sections[1].content).toContain('תוארו');
		expect(sections[1].content).toContain('בראתי');
		expect(sections[1].content).toContain('ותראו');
	});

	it('What words have the same gematria as תורה?', async () => {
		const sections = await calculateQuery('What words have the same gematria as תורה?');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Find words and verses with the standard Gematria value equal to the Mispar Hechrachi (Standard Value) of "תורה"');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('אתרי');
		expect(sections[1].content).toContain('כמתאננים');
	});

	it('What pesukim have a gematria of 930?', async () => {
		const sections = await calculateQuery('What pesukim have a gematria of 930?');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe(`Find words and verses with the standard Gematria value equal to ${formatNumberHTML(930)}`);
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('לרשת');
		expect(sections[1].content).toContain('שמות לא:יב - ויאמר יהוה, אל-משה לאמר.');
		expect(sections[1].content).toContain('במדבר לא:כה - ויאמר יהוה, אל-משה לאמר.');
	});
});

describe('test gematria two-word match', () => {
	it('Gematria equivalences for תורה and משנה.', async () => {
		const sections = await calculateQuery('Gematria equivalences for תורה and משנה.');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Find gematria equivalences for "תורה" and "משנה"');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('53');
		expect(sections[1].content).toContain('Mispar Siduri (Ordinal Value) of "תורה"');
		expect(sections[1].content).toContain('Mispar Siduri (Ordinal Value) of "משנה"');
		expect(sections[1].content).toContain('8');
		expect(sections[1].content).toContain('Mispar Katan Mispari of "תורה"');
		expect(sections[1].content).toContain('Mispar Katan Mispari of "משנה"');
	});

	it('Gematria equivalences for תפילין and חיים with Mispar Kolel.', async () => {
		const sections = await calculateQuery('Gematria equivalences for תפילין and חיים with Mispar Kolel.');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Find gematria equivalences for "תפילין" and "חיים" with the Mispar Kolel method');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('69');
		expect(sections[1].content).toContain('Ofanim of "תפילין"');
		expect(sections[1].content).toContain('Mispar Kolel of "חיים"');
		expect(sections[1].content).not.toContain('Reverse Avgad of "תפילין"');
	});

	it('Gematria equivalences for תורה and משנה in the same method.', async () => {
		const sections = await calculateQuery('Gematria equivalences for תורה and משנה in the same method.');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Find gematria equivalences for "תורה" and "משנה" with the same method');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('53');
		expect(sections[1].content).toContain('Mispar Siduri (Ordinal Value) of "תורה"');
		expect(sections[1].content).toContain('Mispar Siduri (Ordinal Value) of "משנה"');
		expect(sections[1].content).toContain('8');
		expect(sections[1].content).toContain('Mispar Katan Mispari of "תורה"');
		expect(sections[1].content).toContain('Mispar Katan Mispari of "משנה"');
	});
});

describe('test hebrew calendar', () => {
	it('TODO: Not yet tested');
});

describe('test leap years', () => {
	it('TODO: Not yet tested');
});

describe('test molad', () => {
	it('TODO: Not yet tested');
});

describe('test sefiras haomer', () => {
	it('TODO: Not yet tested');
});

describe('test zmanim', () => {
	it('TODO: Not yet tested');
});

describe('test daily learning', () => {
	it('TODO: Not yet tested');
});
