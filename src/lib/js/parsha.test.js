import { describe, expect, it } from 'vitest';
import { calculateParsha } from './parsha';

describe('test calculateParsha', () => {
	it('calculates the parsha for a Saturday', () => {
		const result = calculateParsha('2026-07-11');
		expect(result).toStrictEqual({
			date: '2026-07-11',
			formattedDate: 'Sat, July 11, 2026',
			hebrewDate: '26th of Tammuz, 5786',
			parsha: 'Matot-Masei',
			hebrewParsha: 'מַטּוֹת־מַסְעֵי',
			parshaNames: ['Matot', 'Masei'],
			num: [42, 43],
			isDoubled: true,
			isHoliday: false,
			il: false,
		});
	});

	it('calculates a single (non-doubled) parsha', () => {
		const result = calculateParsha('2026-06-06');
		expect(result.parsha).toBe("Beha'alotcha");
		expect(result.hebrewParsha).toBe('בְּהַעֲלֹתְךָ');
		expect(result.num).toBe(36);
		expect(result.isDoubled).toBe(false);
		expect(result.date).toBe('2026-06-06');
	});

	it('uses the following Shabbat when the date is not a Saturday', () => {
		// Thursday, June 4, 2026 -> Shabbat June 6, 2026 (Beha'alotcha in the Diaspora)
		const result = calculateParsha('2026-06-04');
		expect(result.date).toBe('2026-06-06');
		expect(result.parsha).toBe("Beha'alotcha");
	});

	it('returns the holiday reading when a holiday falls on Shabbat in the Diaspora', () => {
		// Shavuot fell on Shabbat (7 Sivan) in the Diaspora in 2026 - show the holiday reading
		const result = calculateParsha('2026-05-23', false);
		expect(result.parsha).toBe('Shavuot');
		expect(result.hebrewParsha).toBe('שָׁבוּעוֹת');
		expect(result.isHoliday).toBe(true);
		expect(result.date).toBe('2026-05-23');
	});

	it('returns the regular parsha in Israel when only the Diaspora has a holiday that Shabbat', () => {
		// In Israel, Shavuot is only one day (Friday), so Shabbat reads the regular parsha Nasso
		const result = calculateParsha('2026-05-23', true);
		expect(result.parsha).toBe('Nasso');
		expect(result.isHoliday).toBe(false);
		expect(result.date).toBe('2026-05-23');
	});

	it('returns different parshas for Israel and the Diaspora when they diverge', () => {
		const diaspora = calculateParsha('2026-06-06', false);
		const israel = calculateParsha('2026-06-06', true);
		expect(diaspora.parsha).toBe("Beha'alotcha");
		expect(israel.parsha).toBe("Sh'lach");
		expect(diaspora.il).toBe(false);
		expect(israel.il).toBe(true);
	});

	it('returns the same parsha for Israel and the Diaspora when they match', () => {
		const diaspora = calculateParsha('2026-07-11', false);
		const israel = calculateParsha('2026-07-11', true);
		expect(diaspora.parsha).toBe(israel.parsha);
		expect(diaspora.parsha).toBe('Matot-Masei');
	});
});
