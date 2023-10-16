/**
 * Script that runs before the grammar is compiled
 */

import { writeFileSync } from 'fs';
import { units } from '../inputs/unit-inputs.js';
import { gematriaMethods } from '../inputs/gematria-inputs.js';
import { zmanimInputs } from '../inputs/zmanim-inputs.js';
import { dailyLearningTypes } from '../inputs/daily-learning-inputs.js';
import { holidays } from '../inputs/holiday-inputs.js';

generateUnitsGrammar('./src/lib/grammars/generated/units.ne');
generateZmanimGrammar('./src/lib/grammars/generated/zmanim.ne');
generateGrammar('gematriaMethod', gematriaMethods, 'gematria-methods.js', './src/lib/grammars/generated/gematria.ne');
generateGrammar('dailyLearningType', dailyLearningTypes, 'daily-learning-inputs.js', './src/lib/grammars/generated/daily-learning.ne');
generateGrammar('holiday', holidays, 'holiday-inputs.js', './src/lib/grammars/generated/holidays.ne');

/**
 * Convert a one-level deep object mapping to a grammar rule and return the result
 * 
 * @param {string} nonTerminal - The non-terminal to use for the rule
 * @param {Record<string, string[]>} mapping - The mapping of input to output
 * @returns {string} The grammar rule
 */
function convertMappingToGrammarRule(nonTerminal, mapping) {
	return `\n\n${nonTerminal} -> ` + Object.keys(mapping)
		.map((input) => {
			return mapping[input].map((value) => `"${input.replace(/"/g, '\\"')}" {% d => '${value}' %}`).join('\n | ');
		})
		.join('\n | ');
}

/**
 * Generic function to generate a grammar from a one-level deep object mapping
 * 
 * @param {string} nonTerminal - The non-terminal to use for the rule
 * @param {Record<string, string[]>} mapping - The mapping of input to output
 * @param {string} inputPath - The path to the input file
 * @param {string} outputPath - The path to the output file with .ne extension
 */
function generateGrammar(nonTerminal, mapping, inputPath, outputPath) {
	let grammar = `# Grammar of ${nonTerminal}\n# Generated automatically from ${inputPath} in src/lib/grammars/scripts/prepare-input.js`;

	grammar += convertMappingToGrammarRule(nonTerminal, mapping);

	writeFileSync(outputPath, grammar);
}

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
 * Generates the zmanim grammar
 *
 * @param {string} outputPath - The path to the output file with .ne extension
 */
function generateZmanimGrammar(outputPath) {
	let grammar = '# Grammar of zmanim\n# Generated automatically from zmanim-inputs.js in src/lib/grammars/scripts/prepare-input.js';

	grammar += convertMappingToGrammarRule('zman', { ...zmanimInputs.zmanim, ...zmanimInputs.events });
	grammar += convertMappingToGrammarRule('duration', zmanimInputs.durations);

	writeFileSync(outputPath, grammar);
}
