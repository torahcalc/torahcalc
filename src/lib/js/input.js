import { PUBLIC_ADAPTER, PUBLIC_BASE_URL } from '$env/static/public';
import grammar from '$lib/grammars/generated/main.cjs';
import { HDate } from '@hebcal/core';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import nearley from 'nearley';
import { LEARNING_TYPE_NAMES, calculateDailyLearning } from './dailylearning';
import { formatHebrewDateEn, gregorianToHebrew, hebrewToGregorian } from './dateconverter';
import { METHOD_NAMES, WORD_LIST_NAMES, calculateGematria, getListOfGematriasInCommon, searchGematria } from './gematria';
import { nextBirkasHachama, previousBirkasHachama } from './hachama';
import { HOLIDAY_DETAILS, getHolidays } from './holidays';
import { isGregorianLeapYear, isHebrewLeapYear } from './leapyears';
import { calculateMolad } from './molad';
import { calculateOmerDate, calculateOmerHebrew } from './omer';
import { isShmitaYear, nextShmita, previousShmita } from './shmita';
import { convertUnits, convertUnitsMultiAll, getConverters, getDefaultOpinion, getOpinion, getOpinions, getUnit, getUnitOpinion } from './unitconverter';
import { dataToHtmlTable, formatDate, formatDateObject, formatNumberHTML, getCurrentHebrewMonth, getNextHebrewMonth, getPrevHebrewMonth, logQuery, properCase, sanitize, translate } from './utils';
import { ZMANIM_NAMES } from './zmanim';
import { calculateZodiac, calculateZodiacHebrewDate } from './zodiac';
dayjs.extend(timezone);
dayjs.extend(utc);

export const INPUT_INTERPRETATION = 'Input Interpretation';
export const RESULT = 'Result';
export const SOURCES = 'Sources';
export const OPINION_DETAILS = 'Opinion Details';
export const STRINGENCY_NOTE =
	'* The ranges in parentheses denote values for stringencies. For opinion sources where only a larger number was provided for stringencies, a lower value was inferred by reflecting the number around the standard value. In all situations, the stricter of the two values should be used.';

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

	let parserResults = parseQuery(search);

	// if it fails, try translating the input to English and running the parser again
	if (parserResults.success === false) {
		const translation = await translate(search);
		parserResults = parseQuery(translation);
	}

	// if it still fails, throw an error
	if (parserResults.success === false) {
		logQuery('❌: ' + search);
		throw new InputError('TorahCalc could not understand your input, please word it differently or try one of the examples below.', parserResults.data);
	}

	// @ts-ignore - The parser results are always an array at this point
	const derivations = await getValidDerivations(search, parserResults.data);

	if (Object.keys(derivations).length === 0) {
		logQuery('❌: ' + search);
		throw new InputError('TorahCalc could not understand your input, please word it differently or try one of the examples below.', JSON.stringify(parserResults.data, null, 2));
	}

	logQuery('✅: ' + search);

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
		gematriaSearchQuery: () => gematriaSearchQuery(derivation),
		gematriaTwoWordMatchQuery: () => gematriaTwoWordMatchQuery(derivation),
		zmanimQuery: async () => await zmanimQuery(derivation),
		hebrewCalendarQuery: () => hebrewCalendarQuery(derivation),
		moladQuery: () => moladQuery(derivation),
		sefirasHaOmerQuery: () => sefirasHaOmerQuery(derivation),
		leapYearQuery: () => leapYearQuery(derivation),
		dailyLearningQuery: () => dailyLearningQuery(derivation),
		jewishHolidayQuery: () => jewishHolidayQuery(derivation),
		zodiacQuery: () => zodiacQuery(derivation),
		birkasHachamaQuery: () => birkasHachamaQuery(derivation),
		shmitaQuery: () => shmitaQuery(derivation),
		shmitaCheckQuery: () => shmitaCheckQuery(derivation),
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
			let errorHTML = sanitize(e.message);
			if (e.details) {
				errorHTML += `<br /><details><summary>Details</summary><code><pre>${sanitize(e.details)}</pre></code></details>`;
			}
			calculatedSections.push({ title: 'Error', content: errorHTML });
		} else {
			throw e;
		}
	}

	return [...startSections, ...calculatedSections];
}

/**
 * Normalize and parse a query using the grammar
 * @param {string} search - The search query
 * @returns {{ success: true, data: any[] }|{ success: false, data: string }} The parsed query or an error message
 */
function parseQuery(search) {
	// create the parser
	let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

	// convert input to lowercase and add spaces at the end to make word boundaries easier to parse
	const normalized = `${search.toLowerCase().replace(/[.?]+$/, '')} `;

	// run the parser
	try {
		parser.feed(normalized);
	} catch (e) {
		return { success: false, data: `${e}` };
	}

	return { success: true, data: parser.results };
}

/**
 * Format a parse result date
 * @param {{ gregorianDate?: { year: number, month: number, day: number, format: string, afterSunset: boolean }, hebrewDate?: { year: number, month: number, day: number, format: string }}} date - The date to format
 * @returns {string} The formatted date
 */
function formatParseResultDate(date) {
	if (date.gregorianDate) {
		date.gregorianDate.year = date.gregorianDate.year ?? new Date().getFullYear();
		date.gregorianDate.month = date.gregorianDate.month ?? 1;
		date.gregorianDate.day = date.gregorianDate.day ?? 1;
		return formatDate(date.gregorianDate.year, date.gregorianDate.month, date.gregorianDate.day) + (date.gregorianDate.afterSunset ? ' after sunset' : '');
	} else if (date.hebrewDate) {
		date.hebrewDate.year = date.hebrewDate.year ?? new HDate().getFullYear();
		date.hebrewDate.month = date.hebrewDate.month ?? 1;
		date.hebrewDate.day = date.hebrewDate.day ?? 1;
		return formatHebrewDateEn(new HDate(date.hebrewDate.day, date.hebrewDate.month, date.hebrewDate.year));
	}
	throw new Error('Invalid date');
}

/**
 * Filter the results of the parser to only the ones that are valid and add disambiguation information
 *
 * @param {string} search The original search query
 * @param {any[]} results The results of the parser
 * @returns {Promise<Record<string, any>>} The filtered results
 */
async function getValidDerivations(search, results) {
	/** @type {Record<string, any>} */
	const derivations = {};
	// determine disambiguations and skip invalid derivations
	for (const derivation of results) {
		derivation.disambiguation = Object.values(derivation)
			.map((value) => (`${value}` === '[object Object]' ? JSON.stringify(value) : `${value}`))
			.join(', ');
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
		} else if (derivation.function === 'gematriaTwoWordMatchQuery') {
			derivation.disambiguation = `Gematria equivalences for "${derivation.word1}" and "${derivation.word2}"`;
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
			if (derivation?.date?.gregorianDate !== undefined) {
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
			} else if (derivation?.date?.hebrewDate !== undefined) {
				const hebrewDate = derivation.date.hebrewDate;
				hebrewDate.year = hebrewDate.year ?? new HDate().getFullYear();
				try {
					derivation.disambiguation += ` on ${formatHebrewDateEn(new HDate(hebrewDate.day, hebrewDate.month, hebrewDate.year))}`;
				} catch (e) {
					// skip interpretation if the date cannot be parsed
					continue;
				}
				if (hebrewDate.year > 4000 && hebrewDate.year < 7000) {
					derivation.disambiguationScore += 1;
				}
				// prefer MDY format over DMY format
				if (hebrewDate.format === 'MDY' || hebrewDate.format === 'MD') {
					derivation.disambiguationScore += 1;
				}
			}
			if (derivation.location) {
				derivation.disambiguationScore += 1;
				// skip interpretation if certain words are in the location
				if (/\b(?:in|on|at|for|yesterday|today|tomorrow|next|last|zmanis|zmanit)\b/.test(derivation.location)) {
					continue;
				}
				// extract the location from the search query
				const regexEscapedDerivedLocation = derivation.location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
				// find the location in the search query ignoring case and check that is followed by a non-word character or the end of the string
				const regex = new RegExp(`\\b${regexEscapedDerivedLocation}\\b(?=\\W|$)`, 'i');
				const match = search.match(regex);
				if (!match) {
					// skip interpretation if the location cannot be found in the search query
					continue;
				} else {
					// add the location to the disambiguation using the case from the search query
					derivation.disambiguation += ` in "${match[0]}"`;
				}
				derivation.disambiguation = derivation.disambiguation.trim();
			}
		} else if (derivation.function === 'hebrewCalendarQuery') {
			// if there is a year and no date, convert just the year
			if (derivation.date === undefined && derivation.year !== undefined) {
				if (derivation.year.calendar === 'hebrew') {
					derivation.date = { hebrewDate: { year: derivation.year.value, format: 'Y' } };
					derivation.disambiguation = `Convert Hebrew year ${derivation.year.value} to Gregorian calendar`;
					if (derivation.year.value > 4000 && derivation.year.value < 7000) {
						derivation.disambiguationScore += 1;
					}
				} else if (derivation.year.calendar === 'gregorian') {
					derivation.date = { gregorianDate: { year: derivation.year.value, format: 'Y' } };
					derivation.disambiguation = `Convert Gregorian year ${derivation.year.value} to Hebrew calendar`;
					if (derivation.year.value < 4000) {
						derivation.disambiguationScore += 1;
					}
				}
			}
			// converting gregorian to hebrew
			else if (derivation.date?.gregorianDate !== undefined) {
				let gregorianYear = derivation.date.gregorianDate.year ?? new Date().getFullYear();
				if (derivation.year?.calendar === 'hebrew') {
					// convert the hebrew year to gregorian
					gregorianYear = derivation.year.value - (derivation.year.value <= 3761 ? 3762 : 3761);
				} else if (derivation.year?.calendar === 'gregorian') {
					gregorianYear = derivation.year.value;
				}
				derivation.date = { gregorianDate: { ...derivation.date.gregorianDate, year: gregorianYear } };
				const gregorianDate = derivation.date.gregorianDate;
				const dateObject = new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day);
				if (isNaN(dateObject.getTime())) {
					// skip interpretation if the date cannot be parsed
					continue;
				}
				const afterSunsetText = derivation.date.gregorianDate.afterSunset ? '(after sunset) ' : '';
				derivation.disambiguation = `Convert ${dayjs(dateObject).format('MMMM D, YYYY')} ${afterSunsetText}to Hebrew calendar`;
				if (gregorianDate.year < 4000) {
					derivation.disambiguationScore += 1;
				}
				// prefer MDY format over DMY format
				if (gregorianDate.format === 'MDY' || gregorianDate.format === 'MD') {
					derivation.disambiguationScore += 1;
				}
			}
			// converting hebrew to gregorian
			else if (derivation.date?.hebrewDate !== undefined) {
				let hebrewYear = derivation.date.hebrewDate.year ?? new HDate().getFullYear();
				if (derivation.year?.calendar === 'hebrew') {
					hebrewYear = derivation.year.value;
				} else if (derivation.year?.calendar === 'gregorian') {
					// convert the gregorian year to hebrew
					hebrewYear = derivation.year.value + (derivation.year.value < 0 ? 3761 : 3760);
				}
				derivation.date = { hebrewDate: { ...derivation.date.hebrewDate, year: hebrewYear } };
				const hebrewDate = derivation.date.hebrewDate;
				try {
					derivation.disambiguation = `Convert ${formatHebrewDateEn(new HDate(hebrewDate.day, hebrewDate.month, hebrewDate.year))} to Gregorian calendar`;
				} catch (e) {
					// skip interpretation if the date cannot be parsed
					continue;
				}
				if (hebrewDate.year > 4000 && hebrewDate.year < 7000) {
					derivation.disambiguationScore += 1;
				}
				// prefer MDY format over DMY format
				if (hebrewDate.format === 'MDY' || hebrewDate.format === 'MD') {
					derivation.disambiguationScore += 1;
				}
			}
		} else if (derivation.function === 'leapYearQuery' || derivation.function === 'shmitaCheckQuery') {
			derivation.disambiguation = `Is ${derivation.year} a ${derivation.function === 'leapYearQuery' ? 'leap' : 'shmita'} year`;
			if (derivation.calendar === 'hebrew') {
				derivation.disambiguation += ' on the Hebrew calendar';
				derivation.disambiguationScore += 1;
				if (derivation.year > 4000 && derivation.year < 7000) {
					derivation.disambiguationScore += 1;
				}
			} else if (derivation.calendar === 'gregorian') {
				derivation.disambiguation += ' on the Gregorian calendar';
				if (derivation.year <= 4000) {
					derivation.disambiguationScore += 1;
				}
			}
		} else if (derivation.function === 'dailyLearningQuery') {
			derivation.disambiguation = `${LEARNING_TYPE_NAMES[derivation.dailyLearningType]} for ${formatParseResultDate(derivation.date)}`;
		} else if (derivation.function === 'jewishHolidayQuery') {
			const holiday = derivation.holiday ? HOLIDAY_DETAILS[derivation.holiday] : null;
			const holidayName = holiday ? holiday.name : 'Jewish holidays';
			if (derivation.year?.calendar === 'hebrew') {
				derivation.disambiguation = `${holidayName} in Hebrew year ${derivation.year.value}`;
				if (derivation.year.value > 4000 && derivation.year.value < 7000) {
					derivation.disambiguationScore += 1;
				}
			} else if (derivation.year?.calendar === 'gregorian') {
				derivation.disambiguation = `${holidayName} in Gregorian year ${derivation.year.value}`;
				if (derivation.year.value < 4000) {
					derivation.disambiguationScore += 1;
				}
			} else if (derivation.upcoming === true) {
				derivation.disambiguation = `Next ${holidayName}`;
				// prefer upcoming rosh chodesh over other months
				// TODO: skip derivations with wrong rosh chodesh (adar i and adar ii in a non-leap year / adar in a leap year)
				if (holiday?.type === 'roshChodesh' && getRoshChodeshId(1) === derivation.holiday) {
					derivation.disambiguationScore += 1;
				}
			} else if (derivation.upcoming === false) {
				derivation.disambiguation = `Last ${holidayName}`;
				// prefer last rosh chodesh over other months
				if (holiday?.type === 'roshChodesh' && getRoshChodeshId(0) === derivation.holiday) {
					derivation.disambiguationScore += 1;
				}
			} else {
				derivation.disambiguation = 'Upcoming Jewish holidays';
			}
		} else if (derivation.function === 'zodiacQuery') {
			derivation.disambiguation = `Zodiac sign for ${formatParseResultDate(derivation.date)}`;
		} else if (derivation.function === 'birkasHachamaQuery' || derivation.function === 'shmitaQuery') {
			let disambiguation = derivation.direction === 1 ? 'Next' : 'Last';
			disambiguation += derivation.function === 'birkasHachamaQuery' ? ' Birkas Hachama' : ' Shmita';
			if (derivation.year?.calendar === 'hebrew') {
				disambiguation += derivation.direction === 1 ? ' after' : ' before';
				disambiguation += ` Hebrew year ${derivation.year.value}`;
				if (derivation.year.value > 4000 && derivation.year.value < 7000) {
					derivation.disambiguationScore += 1;
				}
			} else if (derivation.year?.calendar === 'gregorian') {
				disambiguation += derivation.direction === 1 ? ' after' : ' before';
				disambiguation += ` Gregorian year ${derivation.year.value}`;
				if (derivation.year.value < 4000) {
					derivation.disambiguationScore += 1;
				}
			}
			derivation.disambiguation = disambiguation;
		}
		derivations[derivation.disambiguation] = derivation;
	}
	return derivations;
}

/**
 * Get the id of the upcoming or last rosh chodesh
 *
 * @param {number} direction - The direction to search for the rosh chodesh (1 for upcoming, 0 for current, -1 for last)
 * @returns {string} The id of the rosh chodesh
 */
function getRoshChodeshId(direction) {
	const roshChodeshIds = {
		1: 'rosh_chodesh_nissan',
		2: 'rosh_chodesh_iyar',
		3: 'rosh_chodesh_sivan',
		4: 'rosh_chodesh_tammuz',
		5: 'rosh_chodesh_av',
		6: 'rosh_chodesh_elul',
		7: 'rosh_hashanah',
		8: 'rosh_chodesh_cheshvan',
		9: 'rosh_chodesh_kislev',
		10: 'rosh_chodesh_teves',
		11: 'rosh_chodesh_shevat',
		12: 'rosh_chodesh_adar_i',
		13: 'rosh_chodesh_adar_ii',
	};
	let month;
	if (direction === 1) {
		month = getNextHebrewMonth();
	} else if (direction === -1) {
		month = getPrevHebrewMonth();
	} else {
		month = getCurrentHebrewMonth();
	}
	// if it's not a leap year, return regular adar
	if (month.month === 12 && !isHebrewLeapYear(month.year).isLeapYear) {
		return 'rosh_chodesh_adar';
	}
	// @ts-ignore - assume key exists
	return roshChodeshIds[month.month];
}

/**
 * Format a unit conversion result
 * @param {import('./unitconverter').ConversionResult|import('./unitconverter').MultiConversionUnit} result - The result to format
 * @param {import('./unitconverter').Unit} unitTo - The unit to convert to
 */
const formatUnitResult = (result, unitTo) => {
	// set the precision and remove trailing zeroes
	const amount = formatNumberHTML(result.result);
	let resultAmountAndUnit = `${amount} ${result.result === 1 ? unitTo.display : unitTo.displayPlural}`;
	if (result.min || result.max) {
		resultAmountAndUnit += ' (';
		if (result.min) {
			resultAmountAndUnit += `${formatNumberHTML(result.min)}`;
		}
		resultAmountAndUnit += ' &ndash; ';
		if (result.max) {
			resultAmountAndUnit += `${formatNumberHTML(result.max)}`;
		}
		resultAmountAndUnit += `)`;
	}
	return resultAmountAndUnit;
};

/**
 * Format unit sources
 * @param {string} [updatedDate] - The date the exchange rates were updated
 * @returns {string} The formatted sources
 */
const formatUnitSources = (updatedDate) => {
	let sources = `<a href="/info/biblical-units">Information about Biblical Units and Sources</a>`;
	if (updatedDate) {
		sources += `<br /><br />Using <a href="https://apilayer.com/marketplace/exchangerates_data-api">exchange rates</a> as of ${updatedDate}`;
	}
	return sources;
};

/**
 * Generate sections for a unit conversion query
 *
 * @param {{ function?: string, unitFrom: { type: string, unitId: string }, unitTo: { type: string, unitId: string }, amount: number }} derivation
 * @returns {Promise<{ title: string, content: string }[]>} The response.
 */
export async function unitConversionQuery(derivation) {
	/** @type {Array<{ title: string, content: string }>} */
	const sections = [];

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
	// if there are multiple opinions, show all of them
	/** @type Array<import('./unitconverter').ConversionResult>*/
	if (conversionResult.opinion || conversionResult.unitOpinions) {
		let lowestOpinion = Infinity;
		let highestOpinion = -Infinity;
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
			if (result.result <= lowestOpinion) {
				lowestOpinion = result.result;
			}
			if (result.result >= highestOpinion) {
				highestOpinion = result.result;
			}
			return { Opinion: opinion, Result: formatUnitResult(result, unitTo) };
		});
		// show the lowest and highest opinions as a range for the result
		sections.push({ title: RESULT, content: `${formatNumberHTML(lowestOpinion)} &ndash; ${formatNumberHTML(highestOpinion)} ${unitTo.displayPlural}` });
		let opinionTable = dataToHtmlTable(data, { headers: ['Opinion', 'Result'], class: 'table table-striped table-bordered' });
		if (Object.values(converters[unitType].opinions || {}).some((opinion) => opinion.stringent)) {
			opinionTable += STRINGENCY_NOTE;
		}
		sections.push({ title: OPINION_DETAILS, content: opinionTable });
	}
	// otherwise, show the single result
	else {
		sections.push({ title: RESULT, content: formatUnitResult(conversionResult, unitTo) });
	}
	const updatedDate = unitTo.updated ?? unitFrom.updated;
	sections.push({ title: SOURCES, content: formatUnitSources(updatedDate) });
	return sections;
}

/**
 * Generate sections for a conversion chart query
 *
 * @param {{ function?: string, unit: { type: string, unitId: string }, amount: number }} derivation
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
	let updatedDate;
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
	let hasStringencyFactors = false;
	if (Object.keys(conversionResults).length > 0) {
		const data = [];
		for (const [opinionId, opinionResults] of Object.entries(conversionResults)) {
			const opinion = (await getDefaultOpinion(unitType)) ? await getOpinion(unitType, opinionId) : await getUnitOpinion(unitType, opinionId);
			let results = '<ul>';
			for (const [unitId, result] of Object.entries(opinionResults)) {
				const unitTo = await getUnit(unitType, unitId);
				results += `<li>${formatUnitResult(result, unitTo)}</li>`;
				updatedDate = unitTo.updated ?? updatedDate;
				if (result.min || result.max) {
					hasStringencyFactors = true;
				}
			}
			results += '</ul>';
			data.push({ Opinion: opinion.name, Results: results });
		}
		content += dataToHtmlTable(data, { headers: ['Opinion', 'Results'], class: 'table table-striped table-bordered', html: true });
	}
	if (hasStringencyFactors) {
		content += STRINGENCY_NOTE;
	}
	sections.push({ title: RESULT, content });
	sections.push({ title: SOURCES, content: formatUnitSources(updatedDate) });
	return sections;
}

/**
 * Generate sections for a gematria query
 *
 * @param {{ function?: string, gematriaMethod: string, text: string }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function gematriaQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];
	const gematriaResult = calculateGematria({ text: derivation.text });
	const primaryResult = gematriaResult[derivation.gematriaMethod];
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
 * Generate sections for a gematria search query
 * @param {{ function?: string, gematriaMethod: string, value?: number, text?: string }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function gematriaSearchQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	const methodName = METHOD_NAMES[derivation.gematriaMethod].name;
	if (derivation.gematriaMethod !== 'standard') {
		throw new InputError('The Gematria search function currently only supports the standard Gematria method.');
	}

	let value = 0;
	if (derivation.text) {
		const gematriaResult = calculateGematria({ text: derivation.text });
		const primaryResult = gematriaResult[derivation.gematriaMethod];
		value = primaryResult;
		sections.push({ title: INPUT_INTERPRETATION, content: `Find words and verses with the standard Gematria value equal to the ${methodName} of "${derivation.text}"` });
	} else if (derivation.value) {
		value = derivation.value;
		sections.push({ title: INPUT_INTERPRETATION, content: `Find words and verses with the standard Gematria value equal to ${formatNumberHTML(value)}` });
	} else {
		throw new InputError('The value or text parameter must be specified.');
	}

	const matches = searchGematria(value);
	let gematriaWordLists = '';
	for (const [wordListKey, words] of Object.entries(matches)) {
		const listName = WORD_LIST_NAMES[wordListKey];
		let wordList = '<ul>';
		for (const word of words) {
			wordList += `<li>${word}</li>`;
		}
		wordList += '</ul>';
		if (words.length > 0) {
			gematriaWordLists += `<h4>${listName}</h4>${wordList}`;
		}
	}
	sections.push({ title: RESULT, content: gematriaWordLists });

	return sections;
}

/**
 * Generate sections for a gematria two-word match query
 * @param {{ function?: string, gematriaMethod?: string, word1: string, word2: string, sameMethod?: boolean }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function gematriaTwoWordMatchQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	const gematriaMethodName = derivation.gematriaMethod ? METHOD_NAMES[derivation.gematriaMethod].name : '';

	if (derivation.gematriaMethod) {
		sections.push({ title: INPUT_INTERPRETATION, content: `Find gematria equivalences for "${derivation.word1}" and "${derivation.word2}" with the ${gematriaMethodName} method` });
	} else if (derivation.sameMethod) {
		sections.push({ title: INPUT_INTERPRETATION, content: `Find gematria equivalences for "${derivation.word1}" and "${derivation.word2}" with the same method` });
	} else {
		sections.push({ title: INPUT_INTERPRETATION, content: `Find gematria equivalences for "${derivation.word1}" and "${derivation.word2}"` });
	}

	const results = getListOfGematriasInCommon(derivation.word1, derivation.word2);

	// filter results
	const filteredResults = results.filter((result) => {
		return !(
			(gematriaMethodName && result.method1.name !== gematriaMethodName && result.method2.name !== gematriaMethodName) ||
			(derivation.sameMethod && result.method1.name !== result.method2.name)
		);
	});

	if (filteredResults.length === 0) {
		sections.push({ title: RESULT, content: 'No gematria values in common were found.' });
	} else {
		let resultTable = '<div style="display: grid; grid-template-columns: 1fr 1fr 5fr 1fr 5fr; text-align: center; grid-row-gap: 0.5rem; grid-column-gap: 0rem; align-items: center;">';
		for (const result of filteredResults) {
			resultTable += `<div class="border rounded p-2">${formatNumberHTML(result.value)}</div>`;
			resultTable += `<div>=</div>`;
			resultTable += `<div class="border rounded p-2">${result.method1.name} of "${derivation.word1}"</div>`;
			resultTable += `<div>=</div>`;
			resultTable += `<div class="border rounded p-2">${result.method2.name} of "${derivation.word2}"</div>`;
		}
		resultTable += '</div>';
		sections.push({ title: RESULT, content: resultTable });
	}

	sections.push({
		title: 'About',
		content: `<p class="small m-0">Javascript adaptation by TorahCalc. Original code in Kotlin by <a href="ssternbach@torahdownloads.com">ssternbach@torahdownloads.com</a>.
					Check out <a href="https://torahdownloads.com/">TorahDownloads.com</a> to find tens of thousands of shiurim on hundreds of topics, all available for free to stream or download!</p>`,
	});
	return sections;
}

/**
 * Generate sections for a zmanim query
 *
 * @param {{ function?: string, zman?: string, date?: { gregorianDate?: { year: number, month: number, day: number }, hebrewDate?: { year: number, month: number, day: number } }, location?: string }} derivation
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
	if (PUBLIC_ADAPTER === 'static') {
		url = PUBLIC_BASE_URL + url;
	}
	const zmanimResponse = await fetch(url)
		.then((response) => response.json())
		.catch((error) => {
			throw new InputError(`Failed to fetch zmanim. Make sure you are connected to the internet.`, error.toString());
		});

	if (zmanimResponse.success === false || !zmanimResponse.data) {
		throw new InputError(`Could not get zmanim for the provided location: "${location}".`, JSON.stringify(zmanimResponse, null, 2));
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
		let row = `<span class="fw-bold d-inline-flex align-items-center gap-2" style="font-size: 1.25em">${zman.icon || ''} ${zman.name}</span>`;
		if (zman.description && zman.name !== zman.description) {
			row += `<div class="small text-muted">${zman.description}</div>`;
		}
		return row;
	};

	let mapUrl = `/input/maps?location=${resultLatitude},${resultLongitude}`;
	if (PUBLIC_ADAPTER === 'static') {
		mapUrl = PUBLIC_BASE_URL + mapUrl;
	}

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
						<img class="mt-3 img-fluid d-block" src="${mapUrl}" />`,
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
			eventsSection += eventsData.map((event) => `<li class="my-3 d-flex flex-column gap-1">${event.Event}${event.Time}</li>`).join('');
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
						<img class="mt-3 img-fluid d-block" src="${mapUrl}" />`,
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

/**
 * Generate sections for a Hebrew calendar query
 *
 * @param {{ function?: string, date?: { gregorianDate?: { year?: number, month?: number, day?: number, afterSunset?: boolean }, hebrewDate?: { year?: number, month?: number, day?: number } }, year?: number }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function hebrewCalendarQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	// convert the gregorian date to a Hebrew date
	if (derivation.date?.gregorianDate) {
		const gregorianDate = derivation.date.gregorianDate;
		// if there is only a year, show the year in Hebrew
		if (gregorianDate?.year && !gregorianDate.month && !gregorianDate.day) {
			const afterSunsetText = derivation.date.gregorianDate.afterSunset ? '(after sunset) ' : '';
			sections.push({ title: INPUT_INTERPRETATION, content: `Convert Gregorian year ${formatNumberHTML(gregorianDate.year, -1)} ${afterSunsetText}to Hebrew calendar` });
			const startHebrewYear = gregorianDate.year + (gregorianDate.year < 0 ? 3761 : 3760);
			const endHebrewYear = startHebrewYear + 1;
			sections.push({
				title: RESULT,
				content: `Gregorian year ${formatNumberHTML(gregorianDate.year, -1)} starts in the Hebrew year ${formatNumberHTML(startHebrewYear, -1)} and ends in ${formatNumberHTML(endHebrewYear, -1)}`,
			});
		}
		//  convert the gregorian date to a Hebrew date
		else {
			gregorianDate.year = gregorianDate.year ?? new Date().getFullYear();
			gregorianDate.month = gregorianDate.month ?? 1;
			gregorianDate.day = gregorianDate.day ?? 1;
			const dateObject = new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day);
			if (isNaN(dateObject.getTime())) {
				throw new InputError(`The date ${gregorianDate.year}-${gregorianDate.month}-${gregorianDate.day} is invalid.`);
			}
			const hebrewDate = gregorianToHebrew({ year: gregorianDate.year, month: gregorianDate.month, day: gregorianDate.day, afterSunset: gregorianDate.afterSunset || false });
			const afterSunsetText = derivation.date.gregorianDate.afterSunset ? '(after sunset) ' : '';
			sections.push({ title: INPUT_INTERPRETATION, content: `Convert ${formatDateObject(dateObject)} ${afterSunsetText}to Hebrew calendar` });
			sections.push({ title: RESULT, content: `${hebrewDate.displayEn} / ${hebrewDate.displayGematriya}` });
		}
	}
	// convert the Hebrew date to a gregorian date
	else if (derivation.date?.hebrewDate) {
		const hebrewDate = derivation.date.hebrewDate;
		// if there is only a year, show the year in Hebrew
		if (hebrewDate.year && !hebrewDate.month && !hebrewDate.day) {
			sections.push({ title: INPUT_INTERPRETATION, content: `Convert Hebrew year ${formatNumberHTML(hebrewDate.year, -1)} to Gregorian calendar` });
			const startGregorianYear = hebrewDate.year - (hebrewDate.year <= 3761 ? 3762 : 3761);
			const endGregorianYear = startGregorianYear + 1;
			sections.push({
				title: RESULT,
				content: `Hebrew year ${formatNumberHTML(hebrewDate.year, -1)} starts in the Gregorian year ${formatNumberHTML(startGregorianYear, -1)} and ends in ${formatNumberHTML(endGregorianYear, -1)}`,
			});
		}
		//  convert the Hebrew date to a gregorian date
		else {
			hebrewDate.year = hebrewDate.year ?? new HDate().getFullYear();
			hebrewDate.month = hebrewDate.month ?? 1;
			hebrewDate.day = hebrewDate.day ?? 1;
			const dateObject = hebrewToGregorian({ year: hebrewDate.year, month: hebrewDate.month, day: hebrewDate.day }).date;
			sections.push({ title: INPUT_INTERPRETATION, content: `Convert ${formatHebrewDateEn(new HDate(hebrewDate.day, hebrewDate.month, hebrewDate.year))} to Gregorian calendar` });
			sections.push({ title: RESULT, content: `${formatDateObject(dateObject)}` });
		}
	}
	// unknown query
	else {
		throw new InputError('TorahCalc could not understand your input, please word it differently or try one of the examples below.', JSON.stringify(derivation, null, 2));
	}

	return sections;
}

/**
 * Generate sections for a Molad query
 * @param {{ function?: string, month?: number, year: number }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function moladQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	const timeFormat = '12Hr'; // TODO: support 24Hr format

	// month and year are specified
	if (derivation.month !== undefined) {
		const molad = calculateMolad(derivation.year, derivation.month);

		sections.push({ title: INPUT_INTERPRETATION, content: `Calculate the molad of ${molad.monthName}` });
		sections.push({ title: RESULT, content: `<ul><li>${molad.timeFormat[timeFormat]}</li><li>${molad.dayOfWeekFormat[timeFormat]}</li><li>${molad.hebrewDateFormat[timeFormat]}</li></ul>` });
		if (!molad.shabbosMevarchim.roshHashanah) {
			sections.push({
				title: 'Rosh Chodesh and Shabbos Mevarchim',
				content: `<ul><li>Shabbos Mevarchim ${molad.monthName} is on <strong>${molad.shabbosMevarchim.shabbosMevarchim}</strong></li><li>Rosh Chodesh ${molad.monthName} is on <strong>${molad.shabbosMevarchim.roshChodesh}</strong> (${molad.shabbosMevarchim.roshChodeshDayOfWeekDisplayEn} / ${molad.shabbosMevarchim.roshChodeshDayOfWeekDisplayHe})</li></ul>`,
			});
		}
	}
	// only the year is specified
	else {
		const monthsInYear = isHebrewLeapYear(derivation.year).isLeapYear ? 13 : 12;
		const data = Array.from({ length: monthsInYear }, (_, i) => {
			const molad = calculateMolad(derivation.year, ((i + 6) % monthsInYear) + 1);
			return { Month: molad.monthName, Molad: `<ul><li>${molad.timeFormat[timeFormat]}</li><li>${molad.dayOfWeekFormat[timeFormat]}</li><li>${molad.hebrewDateFormat[timeFormat]}</li></ul>` };
		});
		const moladTable = dataToHtmlTable(data, { headers: ['Month', 'Molad'], class: 'table table-striped table-bordered', html: true });
		sections.push({ title: INPUT_INTERPRETATION, content: `Calculate the molados for Hebrew year ${derivation.year}` });
		sections.push({ title: RESULT, content: moladTable });
	}

	return sections;
}

/**
 * Generate sections for a Sefiras HaOmer query
 * @param {{ function?: string, date?: { gregorianDate?: { year?: number, month?: number, day?: number, afterSunset?: boolean }, hebrewDate?: { year?: number, month?: number, day?: number } } }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function sefirasHaOmerQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	// calculate the omer from a gregorian date
	if (derivation.date?.gregorianDate) {
		/**
		 * Format night count
		 * @param {{ nightCount: import('./omer').Omer | null }} omer - The omer to format
		 * @returns {string}
		 */
		const formatNightCount = (omer) =>
			omer.nightCount
				? `${omer.nightCount.night} count day ${omer.nightCount.dayOfOmer}<br />"${omer.nightCount.formulaEn}"<br />"${omer.nightCount.formulaHe}"<br />${omer.nightCount.sefiraEn} / ${omer.nightCount.sefiraHe}`
				: 'There is no night count for this date';

		/**
		 * Format day count
		 * @param {{ dayCount: import('./omer').Omer | null }} omer - The omer to format
		 * @returns {string}
		 */
		const formatDayCount = (omer) =>
			omer.dayCount
				? `In the day of ${omer.dayCount.day} count day ${omer.dayCount.dayOfOmer}<br />"${omer.dayCount.formulaEn}"<br />"${omer.dayCount.formulaHe}"<br />${omer.dayCount.sefiraEn} / ${omer.dayCount.sefiraHe}`
				: 'There is no day count for this date';

		const gregorianDate = derivation.date.gregorianDate;
		gregorianDate.year = gregorianDate.year ?? new Date().getFullYear();
		gregorianDate.month = gregorianDate.month ?? 1;
		gregorianDate.day = gregorianDate.day ?? 1;
		const dateObject = new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day);
		const omer = calculateOmerDate(dayjs(dateObject).format('YYYY-MM-DD'));
		const nightCountOnly = gregorianDate.afterSunset ?? false;
		sections.push({ title: INPUT_INTERPRETATION, content: `Calculate the omer on ${formatDateObject(dateObject)}${nightCountOnly ? ' at night' : ''}` });

		if (nightCountOnly && omer.nightCount) {
			sections.push({ title: RESULT, content: formatNightCount(omer) });
		} else if (omer.dayCount && omer.nightCount) {
			sections.push({ title: RESULT, content: `${formatDayCount(omer)}<br /><br />${formatNightCount(omer)}` });
		} else if (omer.dayCount) {
			sections.push({ title: RESULT, content: `${formatDayCount(omer)}<br /><br />Shavuos starts at night` });
		} else if (omer.nightCount) {
			sections.push({ title: RESULT, content: formatNightCount(omer) });
		} else {
			sections.push({ title: RESULT, content: 'There is no omer count for this date' });
		}
	}
	// calculate the omer from a Hebrew date
	else if (derivation.date?.hebrewDate) {
		/**
		 * Format Hebrew day count
		 * @param {{ count: import('./omer').Omer | null }} omer - The omer to format
		 * @returns {string}
		 */
		const formatHebrewDayCount = (omer) =>
			omer.count
				? `On ${omer.count.hebrewDate} (${omer.count.night}) count day ${omer.count.dayOfOmer}<br />"${omer.count.formulaEn}"<br />"${omer.count.formulaHe}"<br />${omer.count.sefiraEn} / ${omer.count.sefiraHe}`
				: 'There is no day count for this date';

		const hebrewDate = derivation.date.hebrewDate;
		hebrewDate.year = hebrewDate.year ?? new HDate().getFullYear();
		hebrewDate.month = hebrewDate.month ?? 1;
		hebrewDate.day = hebrewDate.day ?? 1;
		const omer = calculateOmerHebrew(hebrewDate.year, hebrewDate.month, hebrewDate.day);
		sections.push({ title: INPUT_INTERPRETATION, content: `Calculate the omer on ${formatHebrewDateEn(new HDate(hebrewDate.day, hebrewDate.month, hebrewDate.year))}` });
		if (omer.count) {
			sections.push({ title: RESULT, content: formatHebrewDayCount(omer) });
		} else {
			sections.push({ title: RESULT, content: 'There is no omer count for this date' });
		}
	}

	return sections;
}

/**
 * Generate sections for a Leap Year query
 * @param {{ function?: string, year: number, calendar: "hebrew" | "gregorian" }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function leapYearQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	const result = derivation.calendar === 'hebrew' ? isHebrewLeapYear(derivation.year) : isGregorianLeapYear(derivation.year);

	sections.push({ title: INPUT_INTERPRETATION, content: `Is ${derivation.year} a leap year on the ${properCase(derivation.calendar)} calendar?` });
	sections.push({ title: RESULT, content: `${result.isLeapYear ? 'Yes' : 'No'}, ${result.reason}` });
	sections.push({ title: 'Next Leap Year', content: result.nextLeapYearReason });

	return sections;
}

/**
 * Generate sections for a Daily Learning query
 * @param {{ function?: string, date?: { gregorianDate?: { year?: number, month?: number, day?: number, afterSunset?: boolean }, hebrewDate?: { year?: number, month?: number, day?: number } }, dailyLearningType: string }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function dailyLearningQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	let date = new Date();
	if (derivation?.date?.gregorianDate) {
		const gregorianDate = derivation.date.gregorianDate;
		gregorianDate.year = gregorianDate.year ?? new Date().getFullYear();
		gregorianDate.month = gregorianDate.month ?? 1;
		gregorianDate.day = gregorianDate.day ?? 1;
		date = new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day);
	} else if (derivation?.date?.hebrewDate) {
		const hebrewDate = derivation.date.hebrewDate;
		hebrewDate.year = hebrewDate.year ?? new HDate().getFullYear();
		hebrewDate.month = hebrewDate.month ?? 1;
		hebrewDate.day = hebrewDate.day ?? 1;
		date = hebrewToGregorian({ year: hebrewDate.year, month: hebrewDate.month, day: hebrewDate.day }).date;
	}

	const results = calculateDailyLearning(dayjs(date).format('YYYY-MM-DD'));

	/** @type {import('./dailylearning').DailyLearning | null} */
	// @ts-ignore - assume type is DailyLearning
	const learningResult = results[derivation.dailyLearningType];

	const learningTypeName = LEARNING_TYPE_NAMES[derivation.dailyLearningType];

	sections.push({ title: INPUT_INTERPRETATION, content: `Calculate the ${learningTypeName} for ${formatDateObject(date)}` });
	if (learningResult !== null) {
		sections.push({ title: RESULT, content: `${learningResult.name} / ${learningResult.hebrewName}` });
		if (learningResult.url) {
			sections.push({ title: SOURCES, content: `Read online at <a href="${learningResult.url}" target="_blank">${learningResult.url}</a>` });
		}
	} else {
		sections.push({ title: RESULT, content: `There is no ${learningTypeName} for this date` });
	}

	return sections;
}

/**
 * Generate sections for a Jewish Holiday query
 * @param {{ function?: string, holiday: string, upcoming?: boolean, year?: { value: number, calendar: "hebrew" | "gregorian" } }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function jewishHolidayQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	let gregorianYear;
	let hebrewYear;
	let startDate;

	if (derivation.year?.calendar === 'hebrew') {
		hebrewYear = derivation.year.value;
	} else if (derivation.year?.calendar === 'gregorian') {
		gregorianYear = derivation.year.value;
	} else if (derivation.upcoming === true) {
		startDate = new HDate();
	} else if (derivation.upcoming === false) {
		startDate = new HDate().add(-1, 'year');
	} else {
		startDate = new HDate();
	}

	// get the holidays
	const holidays = getHolidays({ gregorianYear, hebrewYear, startDate });

	if (derivation.holiday) {
		/** @type {string} */
		// @ts-ignore - assume key exists
		const holidayName = HOLIDAY_DETAILS[derivation.holiday].name;
		// find the holiday in the list of holidays by name
		const holidayResult = holidays.find((holiday) => holiday.name === holidayName);
		if (!holidayResult) {
			throw new InputError(`The holiday "${holidayName}" was not found.`, JSON.stringify({ gregorianYear, hebrewYear, startDate, holidays }, null, 2));
		}
		sections.push({ title: INPUT_INTERPRETATION, content: `When ${derivation.upcoming ? 'is' : 'was'} ${holidayName} ${holidayResult.gregorianYear} / ${holidayResult.hebrewYear}?` });
		sections.push({ title: RESULT, content: `<h6>On the Gregorian calendar</h6>${holidayResult.gregorianDateHTML}<br /><br /><h6>On the Hebrew calendar</h6>${holidayResult.hebrewDateHTML}` });
	} else {
		if (derivation.year) {
			sections.push({
				title: INPUT_INTERPRETATION,
				content: `Calculate Jewish holidays for ${derivation.year?.calendar === 'hebrew' ? 'Hebrew year ' + hebrewYear : 'Gregorian year ' + gregorianYear}`,
			});
		} else {
			sections.push({ title: INPUT_INTERPRETATION, content: 'Calculate Jewish holidays for the upcoming year' });
		}
		// show all holidays in tables
		const holidayData = holidays.map((holiday) => {
			return { Holiday: holiday.titleHTML, 'Gregorian Date': holiday.gregorianDateHTML, 'Hebrew Date': holiday.hebrewDateHTML };
		});
		const holidayTable = dataToHtmlTable(holidayData, {
			headers: ['Holiday', 'Gregorian Date', 'Hebrew Date'],
			class: 'table table-striped table-bordered',
			thStyles: ['width: 200px', 'min-width: 200px', 'min-width: 200px'],
		});
		sections.push({ title: RESULT, content: `${holidayTable}` });
	}

	return sections;
}

/**
 * Generate sections for a Zodiac query
 *
 * @param {{ function?: string, date?: { gregorianDate?: { year?: number, month?: number, day?: number, afterSunset?: boolean }, hebrewDate?: { year?: number, month?: number, day?: number } } }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function zodiacQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	// get date in format YYYY-MM-DD
	let zodiac = calculateZodiac(dayjs().format('YYYY-MM-DD'));
	let response = '';
	if (derivation?.date?.gregorianDate) {
		const gregorianDate = derivation.date.gregorianDate;
		gregorianDate.year = gregorianDate.year ?? new Date().getFullYear();
		gregorianDate.month = gregorianDate.month ?? 1;
		gregorianDate.day = gregorianDate.day ?? 1;
		const date = new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day);
		let formattedDate = formatDateObject(date);
		if (gregorianDate.afterSunset) {
			formattedDate += ' (after sunset)';
			date.setDate(date.getDate() + 1);
		}
		zodiac = calculateZodiac(dayjs(date).format('YYYY-MM-DD'));
		sections.push({ title: INPUT_INTERPRETATION, content: `Calculate the Hebrew zodiac for ${formattedDate}` });
		response += `The Hebrew date is ${zodiac.hebrewDate}<br/><br/>`;
	} else if (derivation?.date?.hebrewDate) {
		const hebrewDate = derivation.date.hebrewDate;
		hebrewDate.year = hebrewDate.year ?? new HDate().getFullYear();
		hebrewDate.month = hebrewDate.month ?? 1;
		hebrewDate.day = hebrewDate.day ?? 1;
		const hDate = new HDate(hebrewDate.day, hebrewDate.month, hebrewDate.year);
		zodiac = calculateZodiacHebrewDate(hDate);
		sections.push({ title: INPUT_INTERPRETATION, content: `Calculate the Hebrew zodiac for ${formatHebrewDateEn(hDate)}` });
	}

	response += `The Hebrew zodiac sign for ${zodiac.month} is ${zodiac.symbol} <b>${zodiac.latin} / ${zodiac.hebrewTransliterated} / ${zodiac.hebrew}</b>`;

	sections.push({ title: RESULT, content: response });

	return sections;
}

/**
 * Generate sections for a Birkas HaChama or Shmita query
 *
 * @param {{ function?: string, direction: 1 | -1, year?: { value: number, calendar: "hebrew" | "gregorian" } }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function birkasHachamaShmitaEventQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	const event = derivation.function === 'birkasHachamaQuery' ? 'Birkas HaChama' : 'Shmita year';

	let gregorianYear = new Date().getFullYear();
	if (derivation.year?.calendar === 'hebrew') {
		const gregorianDate = hebrewToGregorian({ year: derivation.year.value, month: 1, day: 1 }).date;
		gregorianYear = gregorianDate.getFullYear() + derivation.direction;
		sections.push({
			title: INPUT_INTERPRETATION,
			content: derivation.direction === 1 ? `When is the next ${event} after Hebrew year ${derivation.year.value}?` : `When was the last ${event} before Hebrew year ${derivation.year.value}?`,
		});
	} else if (derivation.year?.calendar === 'gregorian') {
		gregorianYear = derivation.year.value + derivation.direction;
		sections.push({
			title: INPUT_INTERPRETATION,
			content: derivation.direction === 1 ? `When is the next ${event} after Gregorian year ${derivation.year.value}?` : `When was the last ${event} before Gregorian year ${derivation.year.value}?`,
		});
	} else if (derivation.direction === 1) {
		sections.push({ title: INPUT_INTERPRETATION, content: `When is the next ${event}?` });
	} else {
		sections.push({ title: INPUT_INTERPRETATION, content: `When was the last ${event}?` });
	}

	if (derivation.function === 'birkasHachamaQuery') {
		const hachama = derivation.direction === 1 ? nextBirkasHachama(gregorianYear) : previousBirkasHachama(gregorianYear);
		sections.push({ title: RESULT, content: `${hachama.gregorianDate.display} / ${hachama.hebrewDate.displayEn}` });
	} else {
		const shmitaHebrewYear = derivation.direction === 1 ? nextShmita(gregorianYear, true) : previousShmita(gregorianYear, true);
		const shmitaGregorianYear = hebrewToGregorian({ year: shmitaHebrewYear, month: 1, day: 1 }).date.getFullYear();
		const gregorianRange = `${formatNumberHTML(shmitaGregorianYear - 1, -1)}&ndash;${formatNumberHTML(shmitaGregorianYear, -1)}`;
		sections.push({ title: RESULT, content: `Hebrew year ${formatNumberHTML(shmitaHebrewYear, -1)}, which corresponds to ${gregorianRange} on the Gregorian calendar` });
	}

	return sections;
}

/**
 * Generate sections for a Birkas HaChama query
 *
 * @param {{ function?: string, direction: 1 | -1, year?: { value: number, calendar: "hebrew" | "gregorian" } }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function birkasHachamaQuery(derivation) {
	return birkasHachamaShmitaEventQuery(derivation);
}

/**
 * Generate sections for a Shmita query
 *
 * @param {{ function?: string, direction: 1 | -1, year?: { value: number, calendar: "hebrew" | "gregorian" } }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function shmitaQuery(derivation) {
	return birkasHachamaShmitaEventQuery(derivation);
}

/**
 * Generate sections for a Shmita query for checking a year
 *
 * @param {{ function?: string, year: number }} derivation
 * @returns {{ title: string, content: string }[]} The response.
 */
function shmitaCheckQuery(derivation) {
	/** @type {{ title: string, content: string }[]} */
	const sections = [];

	const result = isShmitaYear(derivation.year);

	sections.push({ title: INPUT_INTERPRETATION, content: `Is ${derivation.year} a Shmita year on the Hebrew calendar?` });
	sections.push({ title: RESULT, content: `${result ? 'Yes' : 'No'}, Hebrew year ${formatNumberHTML(derivation.year, -1)} is ${result ? '' : 'not '}a Shmita year` });

	return sections;
}
