import dayjs from 'dayjs';
import { gregorianToHebrew } from './dateconverter';
import { isHebrewLeapYear } from './leapyears';
import { calculateMolad } from './molad';
import { calculateOmer } from './omer';
import nearley from 'nearley';
import grammar from '$lib/grammars/generated/main.cjs';
import { convertUnits, convertUnitsMulti, convertUnitsMultiAll, getConverters, getOpinion, getOpinions, getUnit } from './unitconverter';

const INPUT_INTERPRETATION = 'Input Interpretation';
const RESULT = 'Result';

/**
 * @typedef {Object} InputOptions
 * @property {boolean} [timeFormat12Hour=true] Whether to use 12-hour or 24-hour time format.
 */

/**
 * Respond to a search query using all available tools.
 * @param {string} search The search query.
 * @param {InputOptions} [options] The options.
 * @returns {Promise<{ title: string, content: string }[]>} The response.
 */
export async function query(search, options = {}) {
	/** @type {Array<{ title: string, content: string }>} */
	const sections = [];

	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

	// convert input to lowercase
	search = search.toLowerCase();

	// run the parser
	parser.feed(search);

	if (parser.results.length === 0) {
		throw new Error('No results.');
	}

	// get the first result
	const results = [];

	// skip over invalid results
	for (const result of parser.results) {
		if (result.type === 'unitConversionQuery') {
			if (result?.fromUnit?.type !== result?.toUnit?.type) {
				continue;
			}
		}
		results.push(result);
	}

	// TODO: handle multiple interpretations
	const result = results[0];

	// Unit conversion query
	if (result.type === 'unitConversionQuery') {
		/** @param {import('./unitconverter').ConversionResult} result */
		const formatResult = (result) => {
			// set the precision and remove trailing zeroes
			const amount = result.result.toFixed(8).replace(/\.?0+$/, '');
			const resultAmountAndUnit = `${amount} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}`;
			return result.opinion ? `${resultAmountAndUnit} (${result.opinion})` : resultAmountAndUnit;
		};

		let resultValue = '';
		const unitType = result.fromUnit.type;
		const unitFrom = await getUnit(unitType, result.fromUnit.unitId);
		const unitTo = await getUnit(unitType, result.toUnit.unitId);
		sections.push({ title: INPUT_INTERPRETATION, content: `Convert ${result.amount} ${result.amount === 1 ? unitFrom.display : unitFrom.displayPlural} to ${unitTo.displayPlural}` });
		const converters = await getConverters();
		const opinions = getOpinions(converters)[unitType] ?? [];
		const params = { type: result.fromUnit.type, unitFromId: result.fromUnit.unitId, unitToId: result.toUnit.unitId, amount: result.amount };
		const conversionResult = await convertUnits(params);
		resultValue = formatResult(conversionResult);
		// if there are multiple opinions, show all of them
		/** @type Array<import('./unitconverter').ConversionResult>*/
		if (conversionResult.opinion) {
			const conversionResults = [];
			for (const opinionId of opinions) {
				conversionResults.push(await convertUnits({ ...params, opinionId }));
			}
			resultValue = conversionResults.map(formatResult).join('\n');
		}
		sections.push({ title: RESULT, content: resultValue });
	}
	// Conversion Chart query
	else if (result.type === 'conversionChartQuery') {
		const unitType = result.unit.type;
		const unitFrom = await getUnit(unitType, result.unit.unitId);
		sections.push({ title: INPUT_INTERPRETATION, content: `Show conversion chart for ${unitFrom.displayPlural}` });
		const params = { type: result.unit.type, unitFromId: result.unit.unitId, amount: result.amount };
		const conversionResults = await convertUnitsMultiAll(params);
		// output no-opinion results first
		let content = '';
		const noOpinionResults = conversionResults['no-opinion'];
		if (noOpinionResults) {
			content += '<ul>';
			for (const [unitId, result] of Object.entries(noOpinionResults)) {
				const unitTo = await getUnit(unitType, unitId);
				content += `<li>${result.result.toFixed(8).replace(/\.?0+$/, '')} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}</li>`;
			}
			content += '</ul>';
		}
		// output opinion results as a table where the first column is the opinion and the second column is the results for that opinion separated by newlines
		delete conversionResults['no-opinion'];
		content += '<table><tr><th>Opinion</th><th>Results</th></tr>';
		for (const [opinionId, opinionResults] of Object.entries(conversionResults)) {
			const opinion = await getOpinion(unitType, opinionId);
			content += `<tr><td>${opinion.name}</td><td><ul>`;
			for (const [unitId, result] of Object.entries(opinionResults)) {
				const unitTo = await getUnit(unitType, unitId);
				content += `<li>${result.result.toFixed(8).replace(/\.?0+$/, '')} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}</li>`;
			}
			content += '</ul></td></tr>';
		}
		content += '</table>';
		sections.push({ title: RESULT, content });
	}
	// Unsupported query type
	else {
		throw new Error(`This type of query is not yet supported: ${result.type}`);
	}

	return sections;
}
