import nearley from 'nearley';
import grammar from '$lib/grammars/generated/main.cjs';
import { convertUnits, convertUnitsMultiAll, getConverters, getDefaultOpinion, getOpinion, getOpinions, getUnit, getUnitOpinion } from './unitconverter';
import { dataToHtmlTable, formatDateObject, formatNumberHTML } from './utils';
import { METHOD_NAMES, calculateGematria } from './gematria';
import { ZMANIM_NAMES } from './zmanim';
import { HDate } from '@hebcal/core';
import { hebrewToGregorian } from './dateconverter';
import DOMPurify from 'dompurify';
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

	/** @type {Array<{ title: string, content: string }>} */
	let calculatedSections = [];
	try {
		const func = sectionFunctions[derivation.function];
		if (!func) {
			throw new InputError(`The ${derivation.function} function is not supported.`, JSON.stringify(derivations, null, 2));
		}
		const retval = func();
		/** @ts-ignore - @type {Array<{ title: string, content: string }>} */
		calculatedSections = retval instanceof Promise ? await retval : retval;
	} catch (e) {
		if (e instanceof InputError) {
			let errorHTML = DOMPurify.sanitize(e.message);
			if (e.details) {
				errorHTML += `<br /><details><summary>Details</summary><code><pre>${DOMPurify.sanitize(e.details)}</pre></code></details>`;
			}
			calculatedSections.push({ title: 'Error', content: errorHTML });
		} else {
			throw e;
		}
	}

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
				gregorianDate.year = gregorianDate.year ?? new Date().getFullYear();
				const dateObject = new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day);
				if (isNaN(dateObject.getTime())) {
					// skip interpretation if the date cannot be parsed
					continue;
				}
				derivation.disambiguation += ` on ${dayjs(dateObject).format('MMMM D, YYYY')}`;
				if (gregorianDate.year < 4000) {
					derivation.disambiguationScore += 1;
				}
				// prefer MDY format over DMY format
				if (gregorianDate.format === 'MDY' || gregorianDate.format === 'MD') {
					derivation.disambiguationScore += 1;
				}
				// prefer Gregorian dates over Hebrew dates
				derivation.disambiguationScore += 1;
			} else if (derivation?.date?.hebrewDate) {
				const hebrewDate = derivation.date.hebrewDate;
				hebrewDate.year = hebrewDate.year ?? new HDate().getFullYear();
				try {
					derivation.disambiguation += ` on ${new HDate(hebrewDate.day, hebrewDate.month, hebrewDate.year).render('en')}`;
				} catch (e) {
					// skip interpretation if the date cannot be parsed
					continue;
				}
				if (hebrewDate.year > 4000) {
					derivation.disambiguationScore += 1;
				}
				// prefer MDY format over DMY format
				if (hebrewDate.format === 'MDY' || hebrewDate.format === 'MD') {
					derivation.disambiguationScore += 1;
				}
			}
			if (derivation.location) {
				derivation.disambiguation += ` in ${derivation.location.trim()}`;
				derivation.disambiguationScore += 1;
				// skip interpretation if certain words are in the location
				if (/\b(?:in|on|for|yesterday|today|tomorrow|next|last)\b/.test(derivation.location)) {
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
		const data = conversionResults.map((result) => {
			const opinion = result.opinion || Object.values(result.unitOpinions ?? {}).join(', ');
			return { Opinion: opinion, Result: formatResult(result) };
		});
		resultValue = dataToHtmlTable(data, { headers: ['Opinion', 'Result'], class: 'table table-striped table-bordered' });
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
		const data = [];
		for (const [opinionId, opinionResults] of Object.entries(conversionResults)) {
			const opinion = (await getDefaultOpinion(unitType)) ? await getOpinion(unitType, opinionId) : await getUnitOpinion(unitType, opinionId);
			let results = '<ul>';
			for (const [unitId, result] of Object.entries(opinionResults)) {
				const unitTo = await getUnit(unitType, unitId);
				results += `<li>${formatNumberHTML(result.result)} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}</li>`;
				updatedDate = unitTo.updated ?? updatedDate;
			}
			results += '</ul>';
			data.push({ Opinion: opinion.name, Results: results });
		}
		content += dataToHtmlTable(data, { headers: ['Opinion', 'Results'], class: 'table table-striped table-bordered', html: true });
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
	const data = Object.entries(gematriaResult).map(([gematriaMethod, result]) => {
		const method = METHOD_NAMES[gematriaMethod];
		return { Method: method.name, Result: formatNumberHTML(result) };
	});
	const gematriaTable = dataToHtmlTable(data, { headers: ['Method', 'Result'], class: 'table table-striped table-bordered' });
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

	/** @type {{ timezone: string, location?: string, latitude?: number, longitude?: number, zmanim: { [key: string]: import('./zmanim').Zman }, events: { [key: string]: import('./zmanim').Zman }, durations: { [key: string]: import('./zmanim').Zman } }} */
	const zmanimResult = zmanimResponse.data;

	if (zmanimResult.location) {
		location = `${zmanimResult.location} (${zmanimResult.latitude}, ${zmanimResult.longitude})`;
	}

	const resultLatitude = zmanimResult.latitude ?? params.latitude ?? '';
	const resultLongitude = zmanimResult.longitude ?? params.longitude ?? '';

	/**
	 * Format a zman time
	 * @param {string} time - The time to format
	 * @param {string} timezone - The timezone to format the time in
	 * @returns {string} The formatted time
	 */
	const formatZmanTime = (time, timezone) => {
		return dayjs(time).tz(timezone).format('h:mm A').replace(' ', '&nbsp;');
	};

	/**
	 * Format a zman name and description in a table row
	 * @param {import('./zmanim').Zman} zman - The zman to format
	 * @returns {string} The formatted time
	 */
	const formatZmanCell = (zman) => {
		let row = `<div class="d-flex align-items-center gap-2 justify-content-start">`;
		if (zman.icon) {
			const [width, height, , , svgPathData] = zman.icon.icon;
			row += `<svg fill="currentColor" height="1em" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><path d="${svgPathData}" /></svg>`;
		}
		row += `<span class="fw-bold">${zman.name}</span></div>`;
		if (zman.description && zman.name !== zman.description) {
			row += `<div class="small text-muted">${zman.description}</div>`;
		}
		return row;
	};

	// get the zmanim result
	if (derivation.zman) {
		// @ts-ignore - assume key exists
		const zmanResult = zmanimResult.zmanim[derivation.zman] ?? zmanimResult.events[derivation.zman] ?? zmanimResult.durations[derivation.zman];
		if (!zmanResult) {
			throw new InputError(`The ${derivation.zman} zman is not supported.`);
		}
		sections.push({
			title: INPUT_INTERPRETATION,
			content: `Calculate ${zmanResult.name} on ${formatDateObject(dateObject)} in ${location.trim()}
						<img class="mt-3 img-fluid d-block" src="/input/maps?location=${resultLatitude},${resultLongitude}" />`,
		});
		if (zmanimResult.durations[derivation.zman]) {
			sections.push({ title: RESULT, content: `The ${zmanResult.name} length is ${zmanResult.time}` });
		} else {
			sections.push({ title: RESULT, content: `${zmanResult.name} is at ${formatZmanTime(zmanResult.time, zmanimResult.timezone)}` });
		}
	} else {
		// show all zmanim in tables
		const zmanimTables = [];
		const eventsData = Object.entries(zmanimResult.events).map(([zmanId, result]) => {
			// @ts-ignore - assume key exists
			const zman = zmanimResult.events[zmanId];
			return { Event: formatZmanCell(zman), Time: formatZmanTime(result.time, zmanimResult.timezone) };
		});
		if (eventsData.length > 0) {
			let eventsSection = "<div class='border rounded px-3 my-3'><ul class='list-unstyled'>";
			eventsSection += eventsData.map((event) => `<li class="my-3">${event.Event}${event.Time}</li>`).join('');
			eventsSection += '</ul></div>';
			zmanimTables.push(eventsSection);
		}
		const zmanimData = Object.entries(zmanimResult.zmanim).map(([zmanId, result]) => {
			// @ts-ignore - assume key exists
			const zman = zmanimResult.zmanim[zmanId];
			return { Zman: formatZmanCell(zman), Time: formatZmanTime(result.time, zmanimResult.timezone) };
		});
		if (zmanimData.length > 0) {
			const zmanimTable = dataToHtmlTable(zmanimData, { headers: ['Zman', 'Time'], class: 'table table-striped table-bordered' });
			zmanimTables.push(zmanimTable);
		}
		const durationsData = Object.entries(zmanimResult.durations).map(([zmanId, result]) => {
			// @ts-ignore - assume key exists
			const zman = zmanimResult.durations[zmanId];
			return { Measurement: formatZmanCell(zman), Length: result.time };
		});
		if (durationsData.length > 0) {
			const durationsTable = dataToHtmlTable(durationsData, { headers: ['Measurement', 'Length'], class: 'table table-striped table-bordered' });
			zmanimTables.push(durationsTable);
		}
		sections.push({
			title: INPUT_INTERPRETATION,
			content: `Calculate Zmanim on ${formatDateObject(dateObject)} in ${location.trim()}
						<img class="mt-3 img-fluid d-block" src="/input/maps?location=${resultLatitude},${resultLongitude}" />`,
		});
		sections.push({ title: RESULT, content: zmanimTables.join('') });
	}
	sections.push({
		title: SOURCES,
		content: `Zmanim are from the <a href="https://www.hebcal.com/home/1663/zmanim-halachic-times-api" target="_blank">Hebcal API</a>. Times are shown for the timezone <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank">${zmanimResult.timezone}</a>.`,
	});
	sections.push({
		title: 'Disclaimer',
		content: 'Due to imprecision and multiple algorithms, zmanim calculations can vary slightly from one source to another. Please do not rely on any calculations on any site to the last minute.',
	});

	return sections;
}
