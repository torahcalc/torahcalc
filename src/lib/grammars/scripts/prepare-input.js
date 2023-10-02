/**
 * Script that runs before the grammar is compiled
 *
 * - Generates units.ne grammar from units.js
 */

import { writeFileSync } from 'fs';
import { units } from './units.js';

const unitTypes = Object.keys(units);

let grammar = '# Grammar of unit names\n# Generated automatically from units.js in src/lib/grammars/scripts/prepare-input.js';

for (const unitType of unitTypes) {
	grammar += `\n\n${unitType}Unit -> `;
	const unitMapping = units[unitType];
	grammar += Object.keys(unitMapping)
		.map((unitInput) => `"${unitInput}" {% d => ({ type: '${unitType}', unitId: '${unitMapping[unitInput]}' }) %}`)
		.join('\n | ');
}

grammar += '\n\nunit -> ' + unitTypes.map((unitType) => `${unitType}Unit {% d => d[0] %}`).join('\n | ');

writeFileSync('./src/lib/grammars/generated/units.ne', grammar);
