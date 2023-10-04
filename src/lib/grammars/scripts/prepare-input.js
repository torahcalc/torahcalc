/**
 * Script that runs before the grammar is compiled
 */

import { writeFileSync } from 'fs';
import { units } from '../inputs/unit-inputs.js';
import { gematriaMethods } from '../inputs/gematria-inputs.js';
import { zmanimInputs } from '../inputs/zmanim-inputs.js';

generateUnitsGrammar('./src/lib/grammars/generated/units.ne');
generateGematriaGrammar('./src/lib/grammars/generated/gematria.ne');
generateZmanimGrammar('./src/lib/grammars/generated/zmanim.ne');

/**
 * Generates the units grammar
 *
 * @param {string} outputPath - The path to the output file with .ne extension
 */
function generateUnitsGrammar(outputPath) {
	const unitTypes = Object.keys(units);

	let grammar = '# Grammar of unit names\n# Generated automatically from units.js in src/lib/grammars/scripts/prepare-input.js';

	for (const unitType of unitTypes) {
		grammar += `\n\n${unitType}Unit -> `;
		const unitMapping = units[unitType];
		grammar += Object.keys(unitMapping)
			.map((unitInput) => {
				return unitMapping[unitInput].map((unitId) => `"${unitInput}" {% d => ({ type: '${unitType}', unitId: '${unitId}' }) %}`).join('\n | ');
			})
			.join('\n | ');
	}

	grammar += '\n\nunit -> ' + unitTypes.map((unitType) => `${unitType}Unit {% d => d[0] %}`).join('\n | ');

	writeFileSync(outputPath, grammar);
}

/**
 * Generates the gematria grammar
 *
 * @param {string} outputPath - The path to the output file with .ne extension
 */
function generateGematriaGrammar(outputPath) {
	let grammar = '# Grammar of gematria\n# Generated automatically from gematria-methods.js in src/lib/grammars/scripts/prepare-input.js';

	grammar += '\n\ngematriaMethod -> ';
	grammar += Object.keys(gematriaMethods)
		.map((methodInput) => {
			return gematriaMethods[methodInput].map((value) => `"${methodInput.replace(/"/g, '\\"')}" {% d => '${value}' %}`).join('\n | ');
		})
		.join('\n | ');

	writeFileSync(outputPath, grammar);
}

/**
 * Generates the zmanim grammar
 *
 * @param {string} outputPath - The path to the output file with .ne extension
 */
function generateZmanimGrammar(outputPath) {
	let grammar = '# Grammar of zmanim\n# Generated automatically from zmanim-inputs.js in src/lib/grammars/scripts/prepare-input.js';

	const zmanim = {...zmanimInputs.zmanim, ...zmanimInputs.events};
	const durations = zmanimInputs.durations;

	grammar += '\n\nzman -> ';
	grammar += Object.keys(zmanim)
		.map((zmanInput) => {
			return zmanim[zmanInput].map((value) => `"${zmanInput.replace(/"/g, '\\"')}" {% d => '${value}' %}`).join('\n | ');
		})
		.join('\n | ');

	grammar += '\n\nduration -> ';
	grammar += Object.keys(durations)
		.map((durationInput) => {
			return durations[durationInput].map((value) => `"${durationInput.replace(/"/g, '\\"')}" {% d => '${value}' %}`).join('\n | ');
		})
		.join('\n | ');

	writeFileSync(outputPath, grammar);
}