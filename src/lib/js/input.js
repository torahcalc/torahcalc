import nearley from 'nearley';
import grammar from '$lib/grammars/generated/main.cjs';
import { convertUnits, convertUnitsMultiAll, getConverters, getOpinion, getOpinions, getUnit } from './unitconverter';

const INPUT_INTERPRETATION = 'Input Interpretation';
const RESULT = 'Result';

/**
 * Respond to a search query using all available tools.
 * @param {string} search The search query.
 * @returns {Promise<{ title: string, content: string }[]>} The response.
 */
export async function query(search) {
	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

	// convert input to lowercase
	search = search.toLowerCase();

	// run the parser
	parser.feed(search);

	if (parser.results.length === 0) {
		throw new Error('No results.');
	}

	// get the first result
	const derivations = [];

	// skip over invalid results
	for (const derivation of parser.results) {
		if (derivation.function === 'unitConversionQuery') {
			if (derivation?.fromUnit?.type !== derivation?.toUnit?.type) {
				continue;
			}
		}
		derivations.push(derivation);
	}

	// TODO: handle multiple interpretations
	const derivation = derivations[0];

	/** @type {Record<string, () => Promise<{ title: string, content: string }[]> | { title: string, content: string }[]>} */
	const sectionFunctions = {
		"unitConversionQuery": async () => await unitConversionQuery(derivation),
		"conversionChartQuery": async () => await conversionChartQuery(derivation),
	};

	const func = sectionFunctions[derivation.function]();
	return func instanceof Promise ? await func : func;
}

/**
 * Generate sections for a unit conversion query
 *
 * @param {{ function: string, unitFrom: { type: string, unitId: string }, unitTo: { type: string, unitId: string }, amount: number }} derivation
 * @returns {Promise<{ title: string, content: string }[]>} The response.
 */
async function unitConversionQuery(derivation) {
	/** @type {Array<{ title: string, content: string }>} */
	const sections = [];
	/** @param {import('./unitconverter').ConversionResult} result */
	const formatResult = (result) => {
		// set the precision and remove trailing zeroes
		const amount = result.result.toFixed(8).replace(/\.?0+$/, '');
		const resultAmountAndUnit = `${amount} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}`;
		return result.opinion ? `${resultAmountAndUnit} (${result.opinion})` : resultAmountAndUnit;
	};

	let resultValue = '';
	const unitType = derivation.unitFrom.type;
	const unitFrom = await getUnit(unitType, derivation.unitFrom.unitId);
	const unitTo = await getUnit(unitType, derivation.unitTo.unitId);
	sections.push({ title: INPUT_INTERPRETATION, content: `Convert ${derivation.amount} ${derivation.amount === 1 ? unitFrom.display : unitFrom.displayPlural} to ${unitTo.displayPlural}` });
	const converters = await getConverters();
	const opinions = getOpinions(converters)[unitType] ?? [];
	const params = { type: unitType, unitFromId: derivation.unitFrom.unitId, unitToId: derivation.unitTo.unitId, amount: derivation.amount };
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
	return sections;
}

/**
 * Generate sections for a conversion chart query
 *
 * @param {{ function: string, unit: { type: string, unitId: string }, amount: number }} derivation
 * @returns {Promise<{ title: string, content: string }[]>} The response.
 */
async function conversionChartQuery(derivation) {
	/** @type {Array<{ title: string, content: string }>} */
	const sections = [];
	const unitType = derivation.unit.type;
	const unitFrom = await getUnit(unitType, derivation.unit.unitId);
	sections.push({ title: INPUT_INTERPRETATION, content: `Show conversion chart for ${unitFrom.displayPlural}` });
	const params = { type: unitType, unitFromId: derivation.unit.unitId, amount: derivation.amount };
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
	return sections;
}
