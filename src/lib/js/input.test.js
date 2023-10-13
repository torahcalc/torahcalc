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
	it('Convert 21 Kislev, 5730 to Gregorian calendar', async () => {
		const sections = await calculateQuery('Convert 21 Kislev, 5730 to Gregorian calendar');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert 21st of Kislev, 5730 to Gregorian calendar');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('Mon, December 1, 1969');
	});

	it('Convert December 1, 1969 to Hebrew calendar', async () => {
		const sections = await calculateQuery('Convert December 1, 1969 to Hebrew calendar');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert Mon, December 1, 1969 to Hebrew calendar');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('21st of Kislev, 5730 / כ״א כִּסְלֵו תש״ל');
	});

	it('Convert December 1, 1969 after sunset', async () => {
		const sections = await calculateQuery('Convert December 1, 1969 after sunset');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Convert Mon, December 1, 1969 (after sunset) to Hebrew calendar');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toBe('22nd of Kislev, 5730 / כ״ב כִּסְלֵו תש״ל');
	});

	it('Convert 5780 to Gregorian calendar', async () => {
		const sections = await calculateQuery('Convert 5780 to Gregorian calendar');
		expect(sections[0].title).toBe('');
		expect(sections[0].content).toContain('Convert Hebrew year 5780 to Gregorian calendar');
		expect(sections[0].content).toContain('Convert Gregorian year 5780 to Hebrew calendar');
		expect(sections[1].title).toBe('Input Interpretation');
		expect(sections[1].content).toBe(`Convert Hebrew year ${formatNumberHTML(5780, -1)} to Gregorian calendar`);
		expect(sections[2].title).toBe('Result');
		expect(sections[2].content).toBe(`Hebrew year ${formatNumberHTML(5780, -1)} starts in the Gregorian year ${formatNumberHTML(2019, -1)} and ends in ${formatNumberHTML(2020, -1)}`);
	});

	it('When will 14 Nissan fall in 5784', async () => {
		const sections = await calculateQuery('When will 14 Nissan fall in 5784');
		expect(sections[0].title).toBe('');
		expect(sections[0].content).toContain('Convert 14th of Nissan, 5784 to Gregorian calendar');
		expect(sections[0].content).toContain('Convert 14th of Nissan, 9544 to Gregorian calendar');
		expect(sections[1].title).toBe('Input Interpretation');
		expect(sections[1].content).toBe('Convert 14th of Nissan, 5784 to Gregorian calendar');
		expect(sections[2].title).toBe('Result');
		expect(sections[2].content).toBe('Mon, April 22, 2024');
	});

	it('When will 14 Nissan fall next year', async () => {
		const sections = await calculateQuery('When will 14 Nissan fall next year');
		expect(sections[0].title).toBe('');
		expect(sections[1].title).toBe('Input Interpretation');
		expect(sections[1].content).toContain('Convert 14th of Nissan, ');
		expect(sections[1].content).toContain(' to Gregorian calendar');
	});

	it("Today's date on Hebrew calendar", async () => {
		const sections = await calculateQuery("Today's date on Hebrew calendar");
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toContain('Convert ');
		expect(sections[0].content).toContain(' to Hebrew calendar');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain(' / ');
	});
});

describe('test leap years', () => {
	it('Is this year a leap year', async () => {
		const sections = await calculateQuery('Is this year a leap year');
		expect(sections[0].title).toBe('');
		expect(sections[0].content).toContain('a leap year on the Hebrew calendar');
		expect(sections[0].content).toContain('a leap year on the Gregorian calendar');
	});

	it('Was 5775 a leap year', async () => {
		const sections = await calculateQuery('Was 5775 a leap year');
		expect(sections[0].title).toBe('');
		expect(sections[0].content).toContain('Is 5775 a leap year on the Hebrew calendar');
		expect(sections[0].content).toContain('Is 5775 a leap year on the Gregorian calendar');
		expect(sections[1].title).toBe('Input Interpretation');
		expect(sections[1].content).toBe('Is 5775 a leap year on the Hebrew calendar?');
		expect(sections[2].title).toBe('Result');
		expect(sections[2].content).toBe('No, 5775 is not a leap year');
		expect(sections[3].title).toBe('Reason');
		expect(sections[3].content).toBe('5775 is the 18th year of the 19-year Metonic cycle and is therefore not a leap year.');
		expect(sections[4].title).toBe('Next Leap Year');
		expect(sections[4].content).toContain('5776');
	});

	it('Will 5790 be a leap year', async () => {
		const sections = await calculateQuery('Will 5790 be a leap year');
		expect(sections[1].title).toBe('Input Interpretation');
		expect(sections[1].content).toBe('Is 5790 a leap year on the Hebrew calendar?');
		expect(sections[2].title).toBe('Result');
		expect(sections[2].content).toBe('Yes, 5790 is a leap year');
		expect(sections[3].title).toBe('Reason');
		expect(sections[3].content).toBe('5790 is the 14th year of the 19-year Metonic cycle and is therefore a leap year.');
		expect(sections[4].title).toBe('Next Leap Year');
		expect(sections[4].content).toContain('5793');
	});

	it('Is Gregorian year 2023 a leap year', async () => {
		const sections = await calculateQuery('Is Gregorian year 2023 a leap year');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Is 2023 a leap year on the Gregorian calendar?');
	});

	it('Is Hebrew year 5784 a leap year', async () => {
		const sections = await calculateQuery('Is Hebrew year 5784 a leap year');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Is 5784 a leap year on the Hebrew calendar?');
	});
});

describe('test molad', () => {
	it('Calculate the molad of Sivan 5781.', async () => {
		const sections = await calculateQuery('Calculate the molad of Sivan 5781.');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Calculate the molad of Sivan 5781');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('Tuesday, May 11, 2021, 8:31 pm and 7 chalakim');
		expect(sections[1].content).toContain('Tuesday evening, 31 minutes and 7 chalakim after 8:00 pm');
		expect(sections[1].content).toContain('29th of Iyar, 5781, 8:31 pm and 7 chalakim');
		expect(sections[2].title).toBe('Rosh Chodesh and Shabbos Mevarchim');
		expect(sections[2].content).toContain('Sat, May 8, 2021');
		expect(sections[2].content).toContain('Wed, May 12, 2021');
	});

	it('When will the molad of Elul be?', async () => {
		const sections = await calculateQuery('When will the molad of Elul be?');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toContain('Calculate the molad of Elul ');
	});

	it('When is the next molad?', async () => {
		const sections = await calculateQuery('When is the next molad?');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toContain('Calculate the molad of ');
	});

	it('Calculate molados for 5781.', async () => {
		const sections = await calculateQuery('Calculate molados for 5781.');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Calculate the molados for Hebrew year 5781');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('Nissan 5781');
		expect(sections[1].content).toContain('Saturday, March 13, 2021');
		expect(sections[1].content).toContain('Adar 5781');
		expect(sections[1].content).toContain('Friday, February 12, 2021');
	});
});

describe('test sefiras haomer', () => {
	it('Day of Omer on May 12, 2023', async () => {
		const sections = await calculateQuery('Day of Omer on May 12, 2023');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Calculate the omer on Fri, May 12, 2023');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).toContain('day 36');
		expect(sections[1].content).toContain('day 37');
	});

	it('Day of Omer on April 17, 2023 at night', async () => {
		const sections = await calculateQuery('Day of Omer on April 17, 2023 at night');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toBe('Calculate the omer on Mon, April 17, 2023 at night');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).not.toContain('day 11');
		expect(sections[1].content).toContain('day 12');
		expect(sections[1].content).not.toContain('day 13');
	});

	it('Day of Omer on 18 Iyar', async () => {
		const sections = await calculateQuery('Day of Omer on 18 Iyar');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toContain('Calculate the omer on 18th of Iyar, ');
		expect(sections[1].title).toBe('Result');
		expect(sections[1].content).not.toContain('day 32');
		expect(sections[1].content).toContain('day 33');
		expect(sections[1].content).not.toContain('day 34');
	});

	it('Sefiras Haomer for tonight', async () => {
		const sections = await calculateQuery('Sefiras Haomer for tonight');
		expect(sections[0].title).toBe('Input Interpretation');
		expect(sections[0].content).toContain('Calculate the omer on ');
		expect(sections[1].title).toBe('Result');
	});
});

describe('test zmanim', () => {
	it('What time is Chatzos in New York?');

	it('Zmanim for Denver');

	it('Zmanim for 1 Teves 5784 in Jerusalem');

	it('What time is sunset on 12/25/2023 in Los Angeles?');

	it('How long is a Shaah Zmanis in 31.776, 35.23?');
});

describe('test daily learning', () => {
	it("What is today's Daf Yomi?");

	it('What is the Daf Yomi for tomorrow?');

	it('What is the Nach Yomi for May 12, 2023?');

	it('What are the daily psalms for tomorrow?');

	it('What is the Weekly Daf for 18 Iyar?');
});
