import { units } from '$lib/grammars/inputs/unit-inputs';
import { getUnit } from '$lib/js/unitconverter';
import { describe, expect, it } from 'vitest';

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
