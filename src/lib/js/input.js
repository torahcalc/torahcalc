import nearley from 'nearley';
import grammar from '$lib/grammars/generated/main.cjs';
import { convertUnits, convertUnitsMultiAll, getConverters, getDefaultOpinion, getOpinion, getOpinions, getUnit, getUnitOpinion } from './unitconverter';
import { formatDateObject, formatNumberHTML } from './utils';
import { METHOD_NAMES, calculateGematria } from './gematria';
import { ZMANIM_NAMES } from './zmanim';
import { HDate } from '@hebcal/core';
import { hebrewToGregorian } from './dateconverter';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(timezone);
dayjs.extend(utc);

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
	const startSections = [];

	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

	// convert input to lowercase
	search = search.toLowerCase();

	// run the parser
	try {
		parser.feed(search);
	} catch (e) {
		throw new InputError('TorahCalc could not understand your input, please word it differently or try one of the examples below.', `${e}`);
	}

	const derivations = await getValidDerivations(parser.results);

	if (Object.keys(derivations).length === 0) {
		throw new InputError('TorahCalc could not understand your input, please word it differently or try one of the examples below.');
	}

	const derivation = derivations[options.disambiguation ?? ''] ?? Object.values(derivations).sort((a, b) => b.disambiguationScore - a.disambiguationScore)[0];

	if (Object.keys(derivations).length > 1) {
		// create a section that allows switching to other interpretations (eg. interpreting as coins, interpret instead as [weight]())
		const otherDerivations = Object.values(derivations).filter((other) => other.disambiguation !== derivation.disambiguation);
		const otherInterpretations = otherDerivations.map((other) => other.disambiguation);
		startSections.push({
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
		gematriaQuery: () => gematriaQuery(derivation),
		zmanimQuery: async () => await zmanimQuery(derivation),
	};

	const func = sectionFunctions[derivation.function];
	if (!func) {
		throw new InputError(`The ${derivation.function} function is not supported.`, JSON.stringify(derivations, null, 2));
	}
	const retval = func();
	/** @ts-ignore - @type {Array<{ title: string, content: string }>} */
	const calculatedSections = retval instanceof Promise ? await retval : retval;

	return [...startSections, ...calculatedSections];
}

/**
 * Filter the results of the parser to only the ones that are valid and add disambiguation information
 *
 * @param {any[]} results The results of the parser
 * @returns {Promise<Record<string, any>>} The filtered results
 */
async function getValidDerivations(results) {
	/** @type {Record<string, any>} */
	const derivations = {};
	// determine disambiguations and skip invalid derivations
	for (const derivation of results) {
		derivation.disambiguation = Object.values(derivation).join(', ');
		derivation.disambiguationScore = 0;
		if (derivation.function === 'unitConversionQuery') {
			// skip derivation if unit types do not match
			if (derivation.unitFrom.type !== derivation.unitTo.type) {
				continue;
			}
			// units are disambiguated by unit type, from unit name, and to unit name
			const unitType = derivation.unitFrom.type;
			const fromUnit = await getUnit(unitType, derivation.unitFrom.unitId);
			const toUnit = await getUnit(unitType, derivation.unitTo.unitId);
			derivation.disambiguation = `${unitType} (${fromUnit.displayPlural} to ${toUnit.displayPlural})`;
		} else if (derivation.function === 'conversionChartQuery') {
			// units are disambiguated by unit type and unit name
			const unitType = derivation.unit.type;
			const unit = await getUnit(unitType, derivation.unit.unitId);
			derivation.disambiguation = `${unitType} (${unit.displayPlural})`;
		} else if (derivation.function === 'gematriaQuery') {
			// gematria methods are disambiguated by method
			const method = METHOD_NAMES[derivation.gematriaMethod];
			derivation.disambiguation = `${method.name}`;
		} else if (derivation.function === 'zmanimQuery') {
			// zmanim are disambiguated by zman, date, and location
			// @ts-ignore - assume key exists
			derivation.disambiguation = 'Zmanim';
			if (derivation.zman) {
				// @ts-ignore - assume key exists
				const zman = ZMANIM_NAMES.zmanim[derivation.zman] ?? ZMANIM_NAMES.events[derivation.zman] ?? ZMANIM_NAMES.durations[derivation.zman];
				derivation.disambiguation = `${zman.name}`;
				derivation.disambiguationScore += 1;
			}
			if (derivation?.date?.gregorianDate) {
				const gregorianDate = derivation.date.gregorianDate;
				derivation.disambiguation += ` on ${dayjs(new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day)).format('MMMM D, YYYY')}`;
				if (gregorianDate.year < 4000) {
					derivation.disambiguationScore += 1;
				}
			} else if (derivation?.date?.hebrewDate) {
				const hebrewDate = derivation.date.hebrewDate;
				derivation.disambiguation += ` on ${new HDate(hebrewDate.day, hebrewDate.month, hebrewDate.year).render('en')}`;
				if (hebrewDate.year > 4000) {
					derivation.disambiguationScore += 1;
				}
			}
			if (derivation.location) {
				derivation.disambiguation += ` in ${derivation.location.trim()}`;
				derivation.disambiguationScore += 1;
				// skip interpretation if certain words are in the location
				if (/\b(?:in|on|for)\b/.test(derivation.location)) {
					continue;
				}
			}
			derivation.disambiguation = derivation.disambiguation.trim();
		}
		derivations[derivation.disambiguation] = derivation;
	}
	return derivations;
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
		const amount = formatNumberHTML(result.result);
		const resultAmountAndUnit = `${amount} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}`;
		return resultAmountAndUnit;
	};

	let resultValue = '';
	const unitType = derivation.unitFrom.type;
	const unitFrom = await getUnit(unitType, derivation.unitFrom.unitId);
	const unitTo = await getUnit(unitType, derivation.unitTo.unitId);
	sections.push({
		title: INPUT_INTERPRETATION,
		content: `Convert ${formatNumberHTML(derivation.amount)} ${derivation.amount === 1 ? unitFrom.display : unitFrom.displayPlural} to ${unitTo.displayPlural}`,
	});
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
		resultValue = "<table class='table table-striped'><tr><th>Opinion</th><th>Result</th></tr>";
		for (const result of conversionResults) {
			const opinion = result.opinion || Object.values(result.unitOpinions ?? {}).join(', ');
			resultValue += `<tr><td>${opinion}</td><td>${formatResult(result)}</td></tr>`;
		}
		resultValue += '</table>';
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
	sections.push({ title: INPUT_INTERPRETATION, content: `Show conversion chart for ${formatNumberHTML(derivation.amount)} ${derivation.amount === 1 ? unitFrom.display : unitFrom.displayPlural}` });
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
			content += `<li>${formatNumberHTML(result.result)} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}</li>`;
			updatedDate = unitTo.updated ?? updatedDate;
		}
		content += '</ul>';
	}
	// output opinion results as a table where the first column is the opinion and the second column is the results for that opinion separated by newlines
	delete conversionResults['no-opinion'];
	if (Object.keys(conversionResults).length > 0) {
		content += '<table class="table table-striped"><tr><th>Opinion</th><th>Results</th></tr>';
		for (const [opinionId, opinionResults] of Object.entries(conversionResults)) {
			const opinion = (await getDefaultOpinion(unitType)) ? await getOpinion(unitType, opinionId) : await getUnitOpinion(unitType, opinionId);
			content += `<tr><td>${opinion.name}</td><td><ul>`;
			for (const [unitId, result] of Object.entries(opinionResults)) {
				const unitTo = await getUnit(unitType, unitId);
				content += `<li>${formatNumberHTML(result.result)} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}</li>`;
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

/**
 * Generate sections for a gematria query
 *
 * @param {{ function: string, gematriaMethod: string, text: string }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function gematriaQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];
	const gematriaResult = calculateGematria({ text: derivation.text });
	const primaryResult = gematriaResult[derivation.gematriaMethod];
	if (!primaryResult) {
		throw new InputError(`The ${derivation.gematriaMethod} gematria method is not supported.`);
	}
	const method = METHOD_NAMES[derivation.gematriaMethod];
	sections.push({ title: INPUT_INTERPRETATION, content: `Calculate ${method.name} of "${derivation.text}"` });
	sections.push({ title: RESULT, content: `${formatNumberHTML(primaryResult)} in ${method.name}` });
	// show all gematria methods in a table
	let gematriaTable = '<table class="table table-striped"><tr><th>Method</th><th>Result</th></tr>';
	for (const [gematriaMethod, result] of Object.entries(gematriaResult)) {
		const method = METHOD_NAMES[gematriaMethod];
		gematriaTable += `<tr><td>${method.name}</td><td>${formatNumberHTML(result)}</td></tr>`;
	}
	gematriaTable += '</table>';
	sections.push({ title: 'Other Methods', content: gematriaTable });
	return sections;
}

/**
 * Generate sections for a zmanim query
 *
 * @param {{ function: string, zman?: string, date?: { gregorianDate?: { year: number, month: number, day: number }, hebrewDate?: { year: number, month: number, day: number } }, location?: string }} derivation
 * @returns {Promise<{ title: string, content: string }[]>} The response.
 */
export async function zmanimQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	let dateObject = new Date();
	if (derivation?.date?.gregorianDate) {
		const obj = derivation.date.gregorianDate;
		dateObject = new Date(obj.year, obj.month - 1, obj.day);
	} else if (derivation?.date?.hebrewDate) {
		const obj = derivation.date.hebrewDate;
		dateObject = hebrewToGregorian({ year: obj.year, month: obj.month, day: obj.day }).date;
	}
	let date = dayjs(dateObject).format('YYYY-MM-DD');

	let location = derivation.location ?? '';

	// TODO: support getting the user's location automatically
	if (location.trim() === '') {
		throw new InputError('Please specify a location (city or latitude, longitude).');
	}

	/** @type {{ date: string, latitude?: string, longitude?: string, location?: string }} */
	const params = { date };
	const latLongMatch = location.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
	if (latLongMatch) {
		params.latitude = latLongMatch[1];
		params.longitude = latLongMatch[3];
	} else {
		params.location = location;
	}

	// get the zmanim
	let url = `/api/zmanim?${new URLSearchParams(params).toString()}`;
	const zmanimResponse = await fetch(url).then((r) => r.json());

	if (zmanimResponse.success === false || !zmanimResponse.data) {
		throw new InputError('Could not get zmanim for the provided location.', JSON.stringify(zmanimResponse, null, 2));
	}

	/** @type {{ timezone: string, location?: string, zmanim: { [key: string]: import('./zmanim').Zman }, events: { [key: string]: import('./zmanim').Zman }, durations: { [key: string]: import('./zmanim').Zman } }} */
	const zmanimResult = zmanimResponse.data;

	location = zmanimResult.location ?? location;

	/**
	 * Format a zman time
	 * @param {string} time - The time to format
	 * @param {string} timezone - The timezone to format the time in
	 * @returns {string} The formatted time
	 */
	const formatZmanTime = (time, timezone) => {
		return `${dayjs(time).tz(timezone).format('h:mm A')} (${timezone})`;
	};

	// get the zmanim result
	if (derivation.zman) {
		// @ts-ignore - assume key exists
		const zmanResult = zmanimResult.zmanim[derivation.zman] ?? zmanimResult.events[derivation.zman] ?? zmanimResult.durations[derivation.zman];
		if (!zmanResult) {
			throw new InputError(`The ${derivation.zman} zman is not supported.`);
		}
		sections.push({ title: INPUT_INTERPRETATION, content: `Calculate ${zmanResult.name} on ${formatDateObject(dateObject)} in ${location.trim()}` });
		if (zmanimResult.durations[derivation.zman]) {
			sections.push({ title: RESULT, content: `The ${zmanResult.name} length is ${zmanResult.time}` });
		} else {
			sections.push({ title: RESULT, content: `${zmanResult.name} is at ${formatZmanTime(zmanResult.time, zmanimResult.timezone)}` });
		}
	} else {
		// show all zmanim in a table
		let zmanimTable = '<table class="table table-striped"><tr><th>Zman</th><th>Result</th></tr>';
		for (const [zmanId, result] of Object.entries(zmanimResult.zmanim)) {
			// @ts-ignore - assume key exists
			const zman = ZMANIM_NAMES.zmanim[zmanId];
			zmanimTable += `<tr><td>${zman.name}</td><td>${formatZmanTime(result.time, zmanimResult.timezone)}</td></tr>`;
		}
		for (const [zmanId, result] of Object.entries(zmanimResult.events)) {
			// @ts-ignore - assume key exists
			const zman = ZMANIM_NAMES.events[zmanId];
			zmanimTable += `<tr><td>${zman.name}</td><td>${formatZmanTime(result.time, zmanimResult.timezone)}</td></tr>`;
		}
		for (const [zmanId, result] of Object.entries(zmanimResult.durations)) {
			// @ts-ignore - assume key exists
			const zman = ZMANIM_NAMES.durations[zmanId];
			zmanimTable += `<tr><td>${zman.name}</td><td>${result.time}</td></tr>`;
		}
		zmanimTable += '</table>';
		sections.push({ title: INPUT_INTERPRETATION, content: `Calculate Zmanim on ${formatDateObject(dateObject)} in ${location.trim()}` });
		sections.push({ title: RESULT, content: zmanimTable });
	}

	return sections;
}
