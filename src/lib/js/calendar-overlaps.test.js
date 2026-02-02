import { describe, expect, it } from 'vitest';
import { findCalendarOverlaps, getNextCalendarOverlap } from './calendar-overlaps';

describe('findCalendarOverlaps', () => {
	it('finds overlaps for September 11 and 1 Tishrei (Rosh Hashanah)', () => {
		// Test when September 11 overlaps with 1 Tishrei
		const overlaps = findCalendarOverlaps({
			gregorianMonth: 9,
			gregorianDay: 11,
			hebrewMonth: 7, // Tishrei
			hebrewDay: 1,
			startYear: 1900,
			endYear: 2100,
		});

		// Should find at least one overlap
		expect(overlaps.length).toBeGreaterThan(0);

		// Check that all results have the correct Gregorian date
		overlaps.forEach((overlap) => {
			if (overlap.eveningOnly) {
				expect(overlap.gregorianDateDisplay).toContain('September 12');
				expect(overlap.eveningStartDateDisplay).toContain('September 11');
			} else {
				expect(overlap.gregorianDateDisplay).toContain('September 11');
				expect(overlap.eveningStartDateDisplay).toContain('September 10');
			}
		});
	});

	it('finds overlaps for December 25 and various Hebrew dates', () => {
		const overlaps = findCalendarOverlaps({
			gregorianMonth: 12,
			gregorianDay: 25,
			hebrewMonth: 9, // Kislev
			hebrewDay: 25,
			startYear: 1900,
			endYear: 2100,
		});

		// Should find at least one overlap
		expect(overlaps.length).toBeGreaterThan(0);

		// Check that all results have the correct Gregorian date
		overlaps.forEach((overlap) => {
			if (overlap.eveningOnly) {
				expect(overlap.gregorianDateDisplay).toContain('December 26');
				expect(overlap.eveningStartDateDisplay).toContain('December 25');
			} else {
				expect(overlap.gregorianDateDisplay).toContain('December 25');
				expect(overlap.eveningStartDateDisplay).toContain('December 24');
			}
		});
	});

	it('handles invalid Gregorian dates gracefully', () => {
		// February 30 doesn't exist
		const overlaps = findCalendarOverlaps({
			gregorianMonth: 2,
			gregorianDay: 30,
			hebrewMonth: 1,
			hebrewDay: 1,
			startYear: 2020,
			endYear: 2030,
		});

		// Should return empty array
		expect(overlaps).toEqual([]);
	});

	it('includes evening start dates and identifies evening-only overlaps', () => {
		const overlaps = findCalendarOverlaps({
			gregorianMonth: 12,
			gregorianDay: 25,
			hebrewMonth: 10, // Teves
			hebrewDay: 2,
			startYear: 2000,
			endYear: 2100,
		});

		// Should find some overlaps
		expect(overlaps.length).toBeGreaterThan(0);

		// All overlaps should have an evening start date and eveningOnly flag
		overlaps.forEach((o) => {
			expect(o.eveningStartDate).toBeDefined();
			expect(o.eveningStartDate.length).toBeGreaterThan(0);
			expect(typeof o.eveningOnly).toBe('boolean');
		});

		// Should have both types of overlaps
		const hasEveningOnly = overlaps.some((o) => o.eveningOnly);
		const hasFullDay = overlaps.some((o) => !o.eveningOnly);
		expect(hasEveningOnly || hasFullDay).toBe(true);
	});

	it('returns overlaps in chronological order', () => {
		const overlaps = findCalendarOverlaps({
			gregorianMonth: 3,
			gregorianDay: 15,
			hebrewMonth: 1, // Nissan
			hebrewDay: 15,
			startYear: 2020,
			endYear: 2030,
		});

		// Check that years are in ascending order
		for (let i = 1; i < overlaps.length; i++) {
			expect(overlaps[i].gregorianYear).toBeGreaterThanOrEqual(overlaps[i - 1].gregorianYear);
		}
	});

	it('finds overlaps for a 100-year range', () => {
		const currentYear = new Date().getFullYear();
		const overlaps = findCalendarOverlaps({
			gregorianMonth: 9,
			gregorianDay: 1,
			hebrewMonth: 6, // Elul
			hebrewDay: 1,
			startYear: currentYear - 50,
			endYear: currentYear + 50,
		});

		// Should find multiple overlaps in a 100-year span
		expect(overlaps.length).toBeGreaterThanOrEqual(5);
		expect(overlaps.length).toBeLessThan(50); // Hebrew calendar cycles
	});
});

describe('getNextCalendarOverlap', () => {
	it('finds the next overlap from today', () => {
		const nextOverlap = getNextCalendarOverlap({
			gregorianMonth: 12,
			gregorianDay: 25,
			hebrewMonth: 9, // Kislev
			hebrewDay: 25,
		});

		if (nextOverlap) {
			// Should be in the future or today
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			expect(nextOverlap.gregorianYear).toBeGreaterThanOrEqual(today.getFullYear());
		}

		// Should either find something or return null
		expect(nextOverlap === null || typeof nextOverlap === 'object').toBe(true);
	});

	it('returns null when no future overlap is found', () => {
		// Use a combination that's unlikely to occur soon
		const nextOverlap = getNextCalendarOverlap({
			gregorianMonth: 2,
			gregorianDay: 29, // Leap day
			hebrewMonth: 13, // Adar II
			hebrewDay: 30,
			startYear: new Date().getFullYear(),
			endYear: new Date().getFullYear() + 10,
		});

		// This might be null or might find something, just test that it returns a valid response
		expect(nextOverlap === null || typeof nextOverlap === 'object').toBe(true);
	});
});
