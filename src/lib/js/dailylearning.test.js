import { describe, expect, it } from 'vitest';
import { calculateDailyLearning } from './dailylearning';

describe('test calculateDailyLearning', () => {
	it('calculates daily learning', async () => {
		const result = calculateDailyLearning('2023-10-01');
		expect(result.dafYomi).toStrictEqual({
			name: 'Kiddushin 49',
			hebrewName: 'קידושין דף מ״ט',
			url: 'https://www.sefaria.org/Kiddushin.49a?lang=bi',
		});
		expect(result.nachYomi).toStrictEqual({
			name: 'Lamentations 5',
			hebrewName: 'אֵיכָה ה׳',
			url: 'https://www.sefaria.org/Lamentations.5?lang=bi',
		});
		expect(result.yerushalmiYomiVilna).toStrictEqual({
			name: 'Yerushalmi Maaser Sheni 21',
			hebrewName: 'יְרוּשַׁלְמִי מעשר שני דף כא',
			url: 'https://www.sefaria.org/Jerusalem_Talmud_Maaser_Sheni.4.1.4-7?lang=bi',
		});
		expect(result.yerushalmiYomiSchottenstein).toStrictEqual({
			name: 'Yerushalmi Kilayim 78',
			hebrewName: 'יְרוּשַׁלְמִי כלאים דף עח',
			url: undefined,
		});
		expect(result.chofetzChaim).toStrictEqual({
			name: 'Lavin 14-15',
			hebrewName: 'לאוין 14-15',
			url: 'https://www.sefaria.org/Chofetz_Chaim%2C_Introduction_to_the_Laws_of_the_Prohibition_of_Lashon_Hara_and_Rechilut%2C_Negative_Commandments.14?lang=bi',
		});
		expect(result.dailyRambam).toStrictEqual({
			name: 'Leavened and Unleavened Bread 5',
			hebrewName: 'הלכות חמץ ומצה פרק ה',
			url: 'https://www.sefaria.org/Mishneh_Torah%2C_Leavened_and_Unleavened_Bread.5?lang=bi',
		});
		expect(result.shemiratHaLashon).toStrictEqual({
			name: 'Book I, Shar Hazechira 2.9',
			hebrewName: 'Book I, שער הזכירה 2.9',
			url: 'https://www.sefaria.org/Shemirat_HaLashon%2C_Book_I%2C_The_Gate_of_Remembering.2.9?lang=bi',
		});
		expect(result.dafWeekly).toStrictEqual({
			name: 'Ketubot 56',
			hebrewName: 'כתובות דף נ״ו',
			url: 'https://www.sefaria.org/Ketubot.56a?lang=bi',
		});
		expect(result.dailyPsalms).toStrictEqual({
			name: 'Psalms 79-82',
			hebrewName: 'תְּהִלִּים ע״ט-פ״ב',
			url: 'https://www.sefaria.org/Psalms.79-82?lang=bi',
		});
		expect(result.kitzurShulchanAruchYomi).toStrictEqual({
			name: 'Kitzur Shulchan Aruch 98:8-13',
			hebrewName: 'קיצור שולחן ערוך צח:ח-יג',
			url: 'https://www.sefaria.org/Kitzur_Shulchan_Arukh.98.8-13?lang=bi',
		});
		expect(result.dailySeferHamitzvos).toStrictEqual({
			name: 'Day 162: Positive Commandment 66; Negative Commandment 147; Positive Commandment 67; Negative Commandment 102, 103, 138',
			hebrewName: 'Day 162: Positive Commandment 66; Negative Commandment 147; Positive Commandment 67; Negative Commandment 102, 103, 138',
			url: 'https://www.chabad.org/dailystudy/seferHamitzvos.asp?tdate=10/1/2023',
		});
	});

	it('returns null for daily learning before start', async () => {
		const result = calculateDailyLearning('1201-10-01');
		expect(result.chofetzChaim).toBeNull();
		expect(result.dafWeekly).toBeNull();
		expect(result.dafYomi).toBeNull();
		expect(result.mishnaYomi).toBeNull();
		expect(result.dailyPsalms).toStrictEqual({
			hebrewName: 'תְּהִלִּים קי״ג-קי״ח',
			name: 'Psalms 113-118',
			url: 'https://www.sefaria.org/Psalms.113-118?lang=bi',
		});
		expect(result.dailyRambam).toBeNull();
		expect(result.nachYomi).toBeNull();
		expect(result.shemiratHaLashon).toBeNull();
		expect(result.yerushalmiYomiSchottenstein).toBeNull();
		expect(result.yerushalmiYomiVilna).toBeNull();
	});
});
