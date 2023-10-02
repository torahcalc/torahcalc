/**
 * Script that runs before the grammar is compiled
 */

import { writeFileSync } from 'fs';
import { units } from './units.js';

generateUnitsGrammar('./src/lib/grammars/generated/units.ne');

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
				if (typeof unitMapping[unitInput] !== 'string') {
					return (
						unitMapping[unitInput]
							// @ts-ignore - unitMapping[unitInput] is an array
							.map((unitId) => `"${unitInput}" {% d => ({ type: '${unitType}', unitId: '${unitId}' }) %}`)
							.join('\n | ')
					);
				}
				return `"${unitInput}" {% d => ({ type: '${unitType}', unitId: '${unitMapping[unitInput]}' }) %}`;
			})
			.join('\n | ');
	}

	grammar += '\n\nunit -> ' + unitTypes.map((unitType) => `${unitType}Unit {% d => d[0] %}`).join('\n | ');

	writeFileSync(outputPath, grammar);
}
