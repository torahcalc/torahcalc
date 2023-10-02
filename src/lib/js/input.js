import nearley from 'nearley';
import grammar from '$lib/grammars/generated/main.cjs';
import { convertUnits, convertUnitsMultiAll, getConverters, getOpinion, getOpinions, getUnit, getUnitOpinions } from './unitconverter';

const INPUT_INTERPRETATION = 'Input Interpretation';
const RESULT = 'Result';
const SOURCES = 'Sources';

/**
 * Custom Error class for input errors
 * @extends Error
 */
export class InputError extends Error {
	/**
	 * @param {string} message - The error message
	 * @param {string} [details] - The details of the error
	 */
	constructor(message, details) {
		super(message);
		this.details = details;
	}
}

/**
 * @typedef {Object} InputOptions
 * @property {string} [disambiguation] - The disambiguation to use to interpret the input
 */

/**
 * Respond to a search query using all available tools.
 * @param {string} search The search query.
 * @param {InputOptions} [options] The options.
 * @returns {Promise<{ title: string, content: string }[]>} The response.
 */
export async function calculateQuery(search, options = {}) {
	/** @type {Array<{ title: string, content: string }>} */
	const sections = [];

	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

	// convert input to lowercase
	search = search.toLowerCase();

	// run the parser
	try {
		parser.feed(search);
	} catch (e) {
		throw new InputError('TorahCalc could not understand your input, please word it differently or try one of the examples.', `${e}`);
	}

	/** @type {Record<string, any>} */
	const derivations = {};

	// determine disambiguations and skip invalid derivations
	for (const derivation of parser.results) {
		derivation.disambiguation = derivation.function;
		if (derivation.function === 'unitConversionQuery') {
			// skip derivation if unit types do not match
			if (derivation.unitFrom.type !== derivation.unitTo.type) {
				continue;
			}
			// units are disambiguated by unit type
			const unitType = derivation.unitFrom.type;
			const fromUnit = await getUnit(unitType, derivation.unitFrom.unitId);
			const toUnit = await getUnit(unitType, derivation.unitTo.unitId);
			derivation.disambiguation = `${unitType} (${fromUnit.displayPlural} to ${toUnit.displayPlural})`;
		} else if (derivation.function === 'conversionChartQuery') {
			// units are disambiguated by unit type
			const unitType = derivation.unit.type;
			const unit = await getUnit(unitType, derivation.unit.unitId);
			derivation.disambiguation = `${unitType} (${unit.displayPlural})`;
		}
		derivations[derivation.disambiguation] = derivation;
	}

	if (Object.keys(derivations).length === 0) {
		throw new InputError('TorahCalc could not understand your input, please word it differently or try one of the examples.');
	}

	const derivation = derivations[options.disambiguation ?? ''] ?? Object.values(derivations)[0];

	if (Object.keys(derivations).length > 1) {
		// create a section that allows switching to other interpretations (eg. interpreting as coins, interpret instead as [weight]())
		const otherDerivations = Object.values(derivations).filter((other) => other.disambiguation !== derivation.disambiguation);
		const otherInterpretations = otherDerivations.map((other) => other.disambiguation);
		sections.push({
			title: '',
			content: `Interpreting as <b>${derivation.disambiguation}</b>. Interpret instead as ${otherInterpretations
				.map((other) => `<a href="?q=${encodeURIComponent(search)}&disambiguation=${encodeURIComponent(other)}">${other}</a>`)
				.join(', ')}.`,
		});
	}

	/** @type {Record<string, () => Promise<{ title: string, content: string }[]> | { title: string, content: string }[]>} */
	const sectionFunctions = {
		unitConversionQuery: async () => await unitConversionQuery(derivation),
		conversionChartQuery: async () => await conversionChartQuery(derivation),
	};

	const func = sectionFunctions[derivation.function]();
	const calculatedSections = func instanceof Promise ? await func : func;
	return [...sections, ...calculatedSections];
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
		if (result.opinion) {
			return `${resultAmountAndUnit} - <span class="opinion">${result.opinion}</span>`;
		} else if (result.unitOpinions) {
			return `${resultAmountAndUnit} - <span class="opinion">${Object.entries(result.unitOpinions)
				.map((opinion) => opinion[1])
				.join(', ')}</span>`;
		}
		return resultAmountAndUnit;
	};

	let resultValue = '';
	const unitType = derivation.unitFrom.type;
	const unitFrom = await getUnit(unitType, derivation.unitFrom.unitId);
	const unitTo = await getUnit(unitType, derivation.unitTo.unitId);
	sections.push({ title: INPUT_INTERPRETATION, content: `Convert ${derivation.amount} ${derivation.amount === 1 ? unitFrom.display : unitFrom.displayPlural} to ${unitTo.displayPlural}` });
	const converters = await getConverters();
	const opinions = getOpinions(converters)[unitType] ?? [];
	const unitOpinionsForType = converters[unitType].unitOpinions ?? {};
	const fromUnitOpinionIds = Object.keys(unitOpinionsForType[derivation.unitFrom.unitId] ?? {}).map((opinionId) => `${derivation.unitFrom.unitId}.${opinionId}`);
	const toUnitOpinionIds = Object.keys(unitOpinionsForType[derivation.unitTo.unitId] ?? {}).map((opinionId) => `${derivation.unitTo.unitId}.${opinionId}`);
	const params = { type: unitType, unitFromId: derivation.unitFrom.unitId, unitToId: derivation.unitTo.unitId, amount: derivation.amount };
	const conversionResult = await convertUnits(params);
	resultValue = formatResult(conversionResult);
	// if there are multiple opinions, show all of them
	/** @type Array<import('./unitconverter').ConversionResult>*/
	if (conversionResult.opinion || conversionResult.unitOpinions) {
		const conversionResults = [];
		for (const opinionId of opinions) {
			conversionResults.push(await convertUnits({ ...params, opinionId }));
		}
		if (fromUnitOpinionIds.length > 0 && toUnitOpinionIds.length > 0) {
			for (const fromUnitOpinionId of fromUnitOpinionIds) {
				for (const toUnitOpinionId of toUnitOpinionIds) {
					conversionResults.push(await convertUnits({ ...params, unitOpinionIds: [fromUnitOpinionId, toUnitOpinionId] }));
				}
			}
		} else if (fromUnitOpinionIds.length > 0 || toUnitOpinionIds.length > 0) {
			for (const unitOpinionId of [...fromUnitOpinionIds, ...toUnitOpinionIds]) {
				conversionResults.push(await convertUnits({ ...params, unitOpinionIds: [unitOpinionId] }));
			}
		}
		resultValue = conversionResults.map(formatResult).join('\n');
	}
	sections.push({ title: RESULT, content: resultValue });
	const updatedDate = unitTo.updated ?? unitFrom.updated ?? null;
	if (updatedDate) {
		sections.push({ title: SOURCES, content: `Based on <a href="https://apilayer.com/marketplace/exchangerates_data-api">exchange rates</a> as of ${updatedDate}` });
	}
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
	sections.push({ title: INPUT_INTERPRETATION, content: `Show conversion chart for ${derivation.amount} ${derivation.amount === 1 ? unitFrom.display : unitFrom.displayPlural}` });
	const params = { type: unitType, unitFromId: derivation.unit.unitId, amount: derivation.amount };
	const conversionResults = await convertUnitsMultiAll(params);
	// output no-opinion results first
	let content = '';
	let updatedDate = null;
	const noOpinionResults = conversionResults['no-opinion'];
	if (noOpinionResults) {
		content += '<ul>';
		for (const [unitId, result] of Object.entries(noOpinionResults)) {
			const unitTo = await getUnit(unitType, unitId);
			content += `<li>${result.result.toFixed(8).replace(/\.?0+$/, '')} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}</li>`;
			updatedDate = unitTo.updated ?? updatedDate;
		}
		content += '</ul>';
	}
	// output opinion results as a table where the first column is the opinion and the second column is the results for that opinion separated by newlines
	delete conversionResults['no-opinion'];
	if (Object.keys(conversionResults).length > 0) {
		content += '<table class="table table-striped"><tr><th>Opinion</th><th>Results</th></tr>';
		for (const [opinionId, opinionResults] of Object.entries(conversionResults)) {
			const opinion = await getOpinion(unitType, opinionId);
			content += `<tr><td>${opinion.name}</td><td><ul>`;
			for (const [unitId, result] of Object.entries(opinionResults)) {
				const unitTo = await getUnit(unitType, unitId);
				content += `<li>${result.result.toFixed(8).replace(/\.?0+$/, '')} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}</li>`;
				updatedDate = unitTo.updated ?? updatedDate;
			}
			content += '</ul></td></tr>';
		}
		content += '</table>';
	}
	sections.push({ title: RESULT, content });
	if (updatedDate) {
		sections.push({ title: SOURCES, content: `Based on <a href="https://apilayer.com/marketplace/exchangerates_data-api">exchange rates</a> as of ${updatedDate}` });
	}
	return sections;
}
