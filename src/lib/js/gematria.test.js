import { describe, it, expect } from 'vitest';
import { calculateGematria, getNumberOfWords, METHODS } from './gematria';

describe('test METHODS', () => {
	it('has 27 numbers in each method', () => {
		for (const method of Object.values(METHODS)) {
			expect(method.length).toBe(27);
		}
	});
});

describe('test getNumberOfWords', () => {
	it('counts words', () => {
		expect(getNumberOfWords('')).toBe(0);
		expect(getNumberOfWords('תורה')).toBe(1);
		expect(getNumberOfWords('תורה שבכתב')).toBe(2);
		expect(getNumberOfWords('א-ב')).toBe(2);
		expect(getNumberOfWords('א-ב ג-ד')).toBe(4);
	});
});

describe('test calculateGematria', () => {
	it('calculates single word gematria', () => {
		const gematria = calculateGematria({ text: 'אבגדוזחטיכךלמםנןסעפףצץקרשת' });
		expect(gematria.standard).toBe(1770);
		expect(gematria.gadol).toBe(4990);
		expect(gematria.siduri).toBe(373);
		expect(gematria.katan).toBe(123);
		expect(gematria.perati).toBe(347760);
		expect(gematria.shemi).toBe(4694);
		expect(gematria.musafi).toBe(1796);
		expect(gematria.atbash).toBe(1465);
		expect(gematria.albam).toBe(1843);
		expect(gematria.boneeh).toBe(9790);
		expect(gematria.kidmi).toBe(7500);
		expect(gematria.neelam).toBe(2924);
		expect(gematria.hamerubah_haklali).toBe(3132900);
		expect(gematria.meshulash).toBe(103464900);
		expect(gematria.haachor).toBe(38000);
		expect(gematria.mispari).toBe(13747);
		expect(gematria.katan_mispari).toBe(6);
		expect(gematria.kolel).toBe(1771);
		expect(gematria.achbi).toBe(2139);
		expect(gematria.atbach).toBe(4990);
		expect(gematria.ayakbakar).toBe(4945);
		expect(gematria.ofanim).toBe(2642);
		expect(gematria.achasbeta).toBe(2062);
		expect(gematria.avgad).toBe(1819);
		expect(gematria.reverse_avgad).toBe(1721);
	});

	it('calculates multiple word gematria', () => {
		const gematria = calculateGematria({ text: 'תורה תנ"ך' });
		expect(gematria.standard).toBe(1081);
		expect(gematria.gadol).toBe(1561);
		expect(gematria.siduri).toBe(112);
		expect(gematria.katan).toBe(28);
		expect(gematria.perati).toBe(362961);
		expect(gematria.shemi).toBe(1546);
		expect(gematria.musafi).toBe(1088);
		expect(gematria.atbash).toBe(214);
		expect(gematria.albam).toBe(602);
		expect(gematria.boneeh).toBe(5176);
		expect(gematria.kidmi).toBe(4091);
		expect(gematria.neelam).toBe(465);
		expect(gematria.hamerubah_haklali).toBe(1168561);
		expect(gematria.meshulash).toBe(136133341);
		expect(gematria.haachor).toBe(3472);
		expect(gematria.mispari).toBe(3917);
		expect(gematria.katan_mispari).toBe(1);
		expect(gematria.kolel).toBe(1084);
		expect(gematria.achbi).toBe(324);
		expect(gematria.atbach).toBe(2559);
		expect(gematria.ayakbakar).toBe(625);
		expect(gematria.ofanim).toBe(449);
		expect(gematria.achasbeta).toBe(1266);
		expect(gematria.avgad).toBe(405);
		expect(gematria.reverse_avgad).toBe(759);
	});

	it('calculates gematria with milui options', () => {
		const gematria = calculateGematria({
			text: 'תורה',
			miluiInput: {
				tav: 407,
				vav: 22,
				resh: 500,
			},
		});
		expect(gematria.standard).toBe(611);
		expect(gematria.shemi).toBe(935);
		expect(gematria.neelam).toBe(324);
	});
});
