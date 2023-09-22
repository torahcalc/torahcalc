/**
 * @type {{ [key: string]: number }|null} - Cached exchange rates for currencies and commodities.
 */
let EXCHANGE_RATES = null;

// Fallback exchange rates for 1 USD from 2023-09-14
const FALLBACK_EXCHANGE_RATES_DATE = '2023-09-14';
const FALLBACK_EXCHANGE_RATES = {
	updateTimestamp: new Date(FALLBACK_EXCHANGE_RATES_DATE).getTime(),
	CAD: 1.351149,
	EUR: 0.940176,
	GBP: 0.806046,
	ILS: 3.821849,
	XAG: 0.044896,
};

/**
 * Return the price of currencies and commodities.
 * @returns {Promise<{ [key: string]: number }>}} - The price of currencies and commodities as currency codes and prices compared to 1 USD.
 */
async function getExchangeRates() {
	if (EXCHANGE_RATES !== null) {
		return EXCHANGE_RATES;
	}
	const API_URL = 'https://api.exchangerate.host/latest?base=USD';
	let response = null;
	try {
		response = await fetch(API_URL);
	} catch (error) {
		// if the global fetch function is not defined (e.g. in testing, use node-fetch)
		if (error instanceof ReferenceError) {
			response = await (await import('node-fetch')).default(API_URL);
		}
	}
	try {
		if (response === null) {
			throw new Error('Failed to fetch exchange rates');
		}
		/** @type {{ rates: { [key: string]: number } }} - The price of currencies and commodities as currency codes and prices compared to 1 USD. */
		// @ts-ignore - ignore response.json() being 'unknown' type
		const data = await response.json();
		if (!data.rates) {
			throw new Error('Exchange rates not found');
		}
		EXCHANGE_RATES = data.rates;
		// @ts-ignore - data.rates is not null
		EXCHANGE_RATES.updateTimestamp = new Date().getTime();
		console.log('Exchange rates updated');
		return data.rates;
	} catch (error) {
		console.error(error);
		return FALLBACK_EXCHANGE_RATES;
	}
}

/**
 * @typedef {{ name: string, value: number, type: "BIBLICAL"|"STANDARD", updated?: number }} Unit
 * @typedef {{ name: string, factor: number }} Opinion
 * @typedef {{ name: string, units: { [key: string]: Unit }, opinions?: { [key: string]: Opinion } }} Converter
 * @typedef {{[key: string]: Converter}} Converters
 */

/**
 * Return the converters for all unit types.
 * @param {boolean} [fetchExchangeRates=true] - Whether to fetch exchange rates for currencies and commodities.
 * @returns {Promise<Converters>} - The converters for all unit types.
 */
export async function getConverters(fetchExchangeRates = true) {
	// Get the value of 1 kikar shel kodesh (1777.7664 troy ounces) of silver in USD, NIS, EUR, CAD, and GBP.
	const exchangeRates = fetchExchangeRates ? await getExchangeRates() : FALLBACK_EXCHANGE_RATES;
	const kikarKodeshTroyOz = 1777.7664;
	const kikarKodeshUSD = (1 / exchangeRates.XAG) * kikarKodeshTroyOz;
	const kikarKodeshNIS = kikarKodeshUSD * exchangeRates.ILS;
	const kikarKodeshEUR = kikarKodeshUSD * exchangeRates.EUR;
	const kikarKodeshCAD = kikarKodeshUSD * exchangeRates.CAD;
	const kikarKodeshGBP = kikarKodeshUSD * exchangeRates.GBP;
	const updateTimestamp = exchangeRates.updateTimestamp;
	return {
		length: {
			name: 'Length',
			units: {
				derech_yom: { name: 'Derech Yom / Mahalach Yom - דרך יום / מהלך יום', value: 1, type: 'BIBLICAL' },
				parsah: { name: 'Parsah - פרסה', value: 10, type: 'BIBLICAL' },
				mil: { name: 'Mil - מיל', value: 40, type: 'BIBLICAL' },
				ris: { name: 'Ris - ריס', value: 300, type: 'BIBLICAL' },
				kaneh: { name: 'Kaneh - קנה', value: 40000 / 3, type: 'BIBLICAL' },
				amah: { name: 'Amah - אמה', value: 8e4, type: 'BIBLICAL' },
				short_amah: { name: 'Short Amah - אמה בת חמשה', value: 96e3, type: 'BIBLICAL' },
				zeret: { name: 'Zeret - זרת', value: 16e4, type: 'BIBLICAL' },
				tefach: { name: 'Tefach - טפח', value: 48e4, type: 'BIBLICAL' },
				etzbah: { name: 'Etzbah - אצבע', value: 192e4, type: 'BIBLICAL' },
				kilometer: { name: 'Kilometer', value: 38.4048, type: 'STANDARD' },
				meter: { name: 'Meter', value: 38404.8, type: 'STANDARD' },
				centimeter: { name: 'Centimeter', value: 3840480, type: 'STANDARD' },
				millimeter: { name: 'Millimeter', value: 38404800, type: 'STANDARD' },
				mile: { name: 'Mile', value: 23.86363636, type: 'STANDARD' },
				yard: { name: 'Yard', value: 42e3, type: 'STANDARD' },
				foot: { name: 'Foot', value: 126e3, type: 'STANDARD' },
				inch: { name: 'Inch', value: 1512e3, type: 'STANDARD' },
				nautical_mile: { name: 'Nautical mile', value: 20.73693305, type: 'STANDARD' },
			},
			opinions: {
				rabbi_avraham_chaim_naeh: { name: "Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה", factor: 1 },
				rabbi_yaakov_kamenetsky: { name: 'Rabbi Yaakov Kamenetsky - הרב יעקב קמנצקי', factor: 10 / 9 },
				rabbi_moshe_feinstein_standard: { name: "Rabbi Moshe Feinstein - ר' משה פיינשטיין (Standard)", factor: 21.25 / 18.9 },
				rabbi_moshe_feinstein_stringent: { name: "Rabbi Moshe Feinstein - ר' משה פיינשטיין (Stringent)", factor: 23 / 18.9 },
				chazon_ish_standard: { name: 'Chazon Ish - חזון איש (Standard)', factor: 22.724409 / 18.9 },
				chazon_ish_stringent: { name: 'Chazon Ish - חזון איש (Stringent)', factor: 23.6220472 / 18.9 },
			},
		},
		area: {
			name: 'Area',
			units: {
				beit_kor: { name: 'Beit kor - בית כור', value: 1, type: 'BIBLICAL' },
				beit_seasayim: { name: 'Beit seasayim - בית סאתים', value: 15, type: 'BIBLICAL' },
				beit_seah: { name: 'Beit seah - בית סאה', value: 30, type: 'BIBLICAL' },
				beit_kav: { name: 'Beit kav - בית קב', value: 180, type: 'BIBLICAL' },
				beit_rova: { name: 'Beit rova - בית רובע', value: 720, type: 'BIBLICAL' },
				amah_merubaas: { name: 'Amah merubaas - אמה מרובעת', value: 75e3, type: 'BIBLICAL' },
				tefach_merubah: { name: 'Tefach merubah - טפח מרובע', value: 27e5, type: 'BIBLICAL' },
				etzbah_merubaas: { name: 'Etzbah merubaas - אצבע מרובעת', value: 432e5, type: 'BIBLICAL' },
				gris: { name: 'Gris - גריס', value: 53333333.333333336, type: 'BIBLICAL' },
				adashah: { name: 'Adashah - עדשה', value: 48e7, type: 'BIBLICAL' },
				searah: { name: 'Searah - שערה', value: 192e7, type: 'BIBLICAL' },
				square_kilometer: { name: 'Square kilometer', value: 0.01728432027, type: 'STANDARD' },
				square_meter: { name: 'Square meter', value: 17284.32027, type: 'STANDARD' },
				square_centimeter: { name: 'Square centimeter', value: 172843202.7, type: 'STANDARD' },
				square_mile: { name: 'Square mile', value: 0.006673513365186, type: 'STANDARD' },
				square_yard: { name: 'Square yard', value: 20671.875, type: 'STANDARD' },
				square_foot: { name: 'Square foot', value: 186046.875, type: 'STANDARD' },
				square_inch: { name: 'Square inch', value: 26790750, type: 'STANDARD' },
				hectare: { name: 'Hectare', value: 1.728432027, type: 'STANDARD' },
				acre: { name: 'Acre', value: 4.271048553719, type: 'STANDARD' },
			},
			opinions: {
				rabbi_avraham_chaim_naeh: { name: "Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה", factor: 1 },
				rabbi_yaakov_kamenetsky: { name: 'Rabbi Yaakov Kamenetsky - הרב יעקב קמנצקי', factor: 441 / 357.21 },
				rabbi_moshe_feinstein_standard: { name: "Rabbi Moshe Feinstein - ר' משה פיינשטיין (Standard)", factor: 1.26413734442 },
				rabbi_moshe_feinstein_stringent: { name: "Rabbi Moshe Feinstein - ר' משה פיינשטיין (Stringent)", factor: 529 / 357.21 },
				chazon_ish_standard: { name: 'Chazon Ish - חזון איש (Standard)', factor: (22.724409 * 22.724409) / 357.21 },
				chazon_ish_stringent: { name: 'Chazon Ish - חזון איש (Stringent)', factor: (23.6220472 * 23.6220472) / 357.21 },
			},
		},
		volume: {
			name: 'Volume',
			units: {
				kor: { name: 'Kor / Chomer - כור / חומר', value: 1, type: 'BIBLICAL' },
				letech: { name: 'Letech / Adriv - לתך / אדריב', value: 2, type: 'BIBLICAL' },
				ephah: { name: 'Ephah / Bat - איפה / בת', value: 10, type: 'BIBLICAL' },
				seah: { name: 'Seah - סאה', value: 30, type: 'BIBLICAL' },
				tarkav: { name: 'Tarkav / Hin - תרקב / הין', value: 60, type: 'BIBLICAL' },
				issaron: { name: 'Issaron / Omer - עשרון / עומר', value: 100, type: 'BIBLICAL' },
				kav: { name: 'Kav - קב', value: 180, type: 'BIBLICAL' },
				rova: { name: 'Rova / Log - רובע / לוג', value: 720, type: 'BIBLICAL' },
				tomen: { name: 'Tomen - תומן', value: 1440, type: 'BIBLICAL' },
				reviis: { name: "Revi'is - רביעית", value: 2880, type: 'BIBLICAL' },
				uchlah: { name: 'Uchlah / Klah - עוכלא / כלה', value: 3600, type: 'BIBLICAL' },
				beitzah: { name: 'Beitzah - ביצה', value: 4320, type: 'BIBLICAL' },
				kezayis: { name: 'Kezayis - כזית', value: 8640, type: 'BIBLICAL' },
				grogeres: { name: 'Grogeres - גרוגרת', value: 14400, type: 'BIBLICAL' },
				mesurah: { name: 'Mesurah - משורה', value: 25920, type: 'BIBLICAL' },
				kortov: { name: 'Kortov - קורטוב', value: 46080, type: 'BIBLICAL' },
				us_liquid_gallon: { name: 'US liquid gallon', value: 65.7344601, type: 'STANDARD' },
				us_liquid_quart: { name: 'US liquid quart ', value: 262.937841, type: 'STANDARD' },
				us_liquid_pint: { name: 'US liquid pint', value: 525.875681, type: 'STANDARD' },
				us_legal_cup: { name: 'US legal cup', value: 1036.8, type: 'STANDARD' },
				us_fluid_ounce: { name: 'US fluid ounce', value: 8414.0109, type: 'STANDARD' },
				us_tablespoon: { name: 'US tablespoon', value: 16828.0218, type: 'STANDARD' },
				us_teaspoon: { name: 'US teaspoon', value: 50484.0817, type: 'STANDARD' },
				cubic_meter: { name: 'Cubic meter', value: 0.248832, type: 'STANDARD' },
				liter: { name: 'Liter', value: 248.832, type: 'STANDARD' },
				milliliter: { name: 'Milliliter', value: 248832, type: 'STANDARD' },
				imperial_gallon: { name: 'Imperial gallon', value: 54.735388, type: 'STANDARD' },
				imperial_quart: { name: 'Imperial quart', value: 218.941552, type: 'STANDARD' },
				imperial_pint: { name: 'Imperial pint', value: 437.883104, type: 'STANDARD' },
				imperial_cup: { name: 'Imperial cup', value: 875.766285, type: 'STANDARD' },
				imperial_fluid_ounce: { name: 'Imperial fluid ounce', value: 8757.66208, type: 'STANDARD' },
				imperial_tablespoon: { name: 'Imperial tablespoon', value: 14012.2535, type: 'STANDARD' },
				imperial_teaspoon: { name: 'Imperial teaspoon', value: 42036.7606, type: 'STANDARD' },
				cubic_foot: { name: 'Cubic foot', value: 8.78741915, type: 'STANDARD' },
				cubic_inch: { name: 'Cubic inch', value: 15184.6603, type: 'STANDARD' },
			},
			opinions: {
				desert_rabbi_avraham_chaim_naeh: { name: "Desert (Rabbi Avraham Chaim Naeh) - מדבריות (ר' אברהם חיים נאה", factor: 1 },
				desert_chazon_ish: { name: 'Desert (Chazon Ish) - מדבריות (חזון איש', factor: 31 / 18 },
				jerusalem_rabbi_avraham_chaim_naeh: { name: "Jerusalem (Rabbi Avraham Chaim Naeh) - ירושלמיות (ר' אברהם חיים נאה", factor: 65 / 64 },
				jerusalem_chazon_ish: { name: 'Jerusalem (Chazon Ish) - ירושלמיות (חזון איש', factor: 56 / 27 },
				tzipori_rabbi_avraham_chaim_naeh: { name: "Tzipori (Rabbi Avraham Chaim Naeh) - ציפוריות (ר' אברהם חיים נאה", factor: 13 / 9 },
				tzipori_chazon_ish: { name: 'Tzipori (Chazon Ish) - ציפוריות (חזון איש', factor: 67 / 27 },
			},
		},
		weight: {
			name: 'Mass / Weight',
			units: {
				kikar: { name: 'Kikar - כיכר', value: 1, type: 'BIBLICAL' },
				mane: { name: 'Maneh / Litra - מנה / ליטרא', value: 60, type: 'BIBLICAL' },
				tartimar: { name: 'Tartimar - תרטימר', value: 120, type: 'BIBLICAL' },
				unkeya: { name: 'Unkeya - אונקיא', value: 750, type: 'BIBLICAL' },
				sela: { name: 'Sela - סלע', value: 1500, type: 'BIBLICAL' },
				shekel: { name: 'Shekel - שקל', value: 3e3, type: 'BIBLICAL' },
				dinar: { name: 'Dinar / Zuz / Zin - דינר / זוז / זין', value: 6e3, type: 'BIBLICAL' },
				kilogram: { name: 'Kilogram', value: 27, type: 'STANDARD' },
				gram: { name: 'Gram', value: 27e3, type: 'STANDARD' },
				milligram: { name: 'Milligram', value: 27e6, type: 'STANDARD' },
				stone: { name: 'Stone', value: 4.2517722, type: 'STANDARD' },
				pound: { name: 'Pound', value: 59.524811, type: 'STANDARD' },
				ounce: { name: 'Ounce', value: 952.39697, type: 'STANDARD' },
			},
		},
		coins: {
			name: 'Coins',
			units: {
				kikar_shel_kodesh: { name: 'Kikar shel kodesh - כיכר של קודש', value: 1, type: 'BIBLICAL' },
				kikar: { name: 'Kikar - כיכר', value: 2, type: 'BIBLICAL' },
				mane_shel_kodesh: { name: 'Maneh shel kodesh - מנה של קודש', value: 60, type: 'BIBLICAL' },
				mane: { name: 'Maneh - מנה', value: 120, type: 'BIBLICAL' },
				dinar_zahav: { name: 'Dinar zahav - דינר זהב', value: 480, type: 'BIBLICAL' },
				sela: { name: 'Sela - סלע', value: 3e3, type: 'BIBLICAL' },
				shekel: { name: 'Shekel - שקל', value: 6e3, type: 'BIBLICAL' },
				dinar: { name: 'Dinar / Zuz - דינר / זוז', value: 12e3, type: 'BIBLICAL' },
				istera: { name: 'Istera / Tarpik - אסתרא / טרפעיק', value: 24e3, type: 'BIBLICAL' },
				maah: { name: 'Maah - מעה', value: 72e3, type: 'BIBLICAL' },
				pundyon: { name: 'Pundyon - פונדיון', value: 144e3, type: 'BIBLICAL' },
				issar: { name: 'Issar - איסר', value: 288e3, type: 'BIBLICAL' },
				mesimas: { name: 'Mesimas - מסימס', value: 576e3, type: 'BIBLICAL' },
				kontrank: { name: 'Kontrank - קונטרק', value: 1152e3, type: 'BIBLICAL' },
				perutah: { name: 'Perutah - פרוטה', value: 2304e3, type: 'BIBLICAL' },
				usd: { name: 'US Dollars (USD)', value: kikarKodeshUSD, type: 'STANDARD', updated: updateTimestamp },
				nis: { name: 'Israeli New Sheqels (NIS)', value: kikarKodeshNIS, type: 'STANDARD', updated: updateTimestamp },
				eur: { name: 'European Euro (EUR)', value: kikarKodeshEUR, type: 'STANDARD', updated: updateTimestamp },
				cad: { name: 'Canadian Dollars (CAD)', value: kikarKodeshCAD, type: 'STANDARD', updated: updateTimestamp },
				gbp: { name: 'Pound sterling (GBP)', value: kikarKodeshGBP, type: 'STANDARD', updated: updateTimestamp },
				grams_of_silver: { name: 'Grams of silver', value: 55296, type: 'STANDARD' },
				ounces_of_silver: { name: 'Ounces of silver', value: kikarKodeshTroyOz, type: 'STANDARD', updated: updateTimestamp },
			},
			opinions: {
				shulchan_aruch_rambam: { name: 'Shulchan Aruch / Rambam - שולחן ערוך / רמב״ם', factor: 1 },
				rashi: { name: 'Rashi - רש״י', factor: 5 / 6 },
				other: { name: 'Other authorities - פוסקים אחרים', factor: 1.13 },
			},
		},
		time: {
			name: 'Time',
			units: {
				yovel: { name: 'Yovel - יובל', value: 1, type: 'BIBLICAL' },
				shmittah: { name: 'Shmittah - שמיטה', value: 7.142857142857143, type: 'BIBLICAL' },
				shanah: { name: 'Shanah - שנה', value: 50, type: 'BIBLICAL' },
				tekufah: { name: 'Tekufah - תקופה', value: 200, type: 'BIBLICAL' },
				chodesh: { name: 'Chodesh - חודש', value: 600, type: 'BIBLICAL' },
				shavuah: { name: 'Shavuah - שבוע', value: 2528.57142857, type: 'BIBLICAL' },
				yom: { name: 'Yom - יום', value: 17700, type: 'BIBLICAL' },
				onah: { name: 'Onah - עונה', value: 35400, type: 'BIBLICAL' },
				shaah: { name: 'Shaah - שעה', value: 424800, type: 'BIBLICAL' },
				small_onah: { name: 'Small Onah - עונה', value: 10195200, type: 'BIBLICAL' },
				et: { name: 'Et - עת', value: 244684800, type: 'BIBLICAL' },
				chelek: { name: 'Chelek - חלק', value: 458784e3, type: 'BIBLICAL' },
				rega: { name: 'Rega - רגע', value: 34867584e3, type: 'BIBLICAL' },
				century: { name: 'Century', value: 0.48493151, type: 'STANDARD' },
				decade: { name: 'Decade', value: 4.8460994, type: 'STANDARD' },
				year: { name: 'Year', value: 48.493151, type: 'STANDARD' },
				month: { name: 'Month', value: 581.91717, type: 'STANDARD' },
				week: { name: 'Week', value: 2528.5714, type: 'STANDARD' },
				day: { name: 'Day', value: 17700, type: 'STANDARD' },
				hour: { name: 'Hour', value: 424800, type: 'STANDARD' },
				minute: { name: 'Minute', value: 25488e3, type: 'STANDARD' },
				second: { name: 'Second', value: 152928e4, type: 'STANDARD' },
				millisecond: { name: 'Millisecond', value: 152928e7, type: 'STANDARD' },
			},
		},
	};
}

/**
 * Return a mapping of unit types to lists of units.
 * @param {Converters} converters
 * @returns {{[key: string]: string[]}} The units in a mapping of type to list of units
 */
export function getUnits(converters) {
	/** @type {{[key: string]: string[]}} */
	const units = {};
	for (const [type, converter] of Object.entries(converters)) {
		units[type] = Object.keys(converter.units);
	}
	return units;
}

/**
 * Return a mapping of unit types to lists of opinions.
 * @param {Converters} converters
 * @returns {{[key: string]: string[]}} The opinions in a mapping of type to list of opinions
 */
export function getOpinions(converters) {
	/** @type {{[key: string]: string[]}} */
	const opinions = {};
	for (const [type, converter] of Object.entries(converters)) {
		if (converter.opinions) {
			opinions[type] = Object.keys(converter.opinions);
		}
	}
	return opinions;
}

/**
 * Get the converter for a unit type.
 * @param {string} type - The type of unit to convert.
 * @returns {Promise<Converter>} - The converter for the unit type.
 */
async function getConverter(type) {
	type = type.trim().toLowerCase();
	const converters = await getConverters();
	if (!(type in converters)) {
		throw new Error(`Unit type '${type}' was not found`);
	}
	return converters[type];
}

/**
 * Get the unit details for a unit.
 * @param {string} type - The type of unit to convert.
 * @param {string} unitId - The unit to get the details for.
 * @returns {Promise<Unit>} - The details of the unit.
 */
export async function getUnit(type, unitId) {
	const converter = await getConverter(type);
	unitId = unitId.trim().toLowerCase();
	if (!(unitId in converter.units)) {
		throw new Error(`Unit '${unitId}' was not found`);
	}
	return converter.units[unitId];
}

/**
 * Get the opinion details for an opinion.
 * @param {string} type - The type of unit to convert.
 * @param {string} opinionId - The opinion to get the details for.
 * @returns {Promise<Opinion>} - The details of the opinion.
 */
export async function getOpinion(type, opinionId) {
	const converter = await getConverter(type);
	opinionId = opinionId.trim().toLowerCase();
	if (!('opinions' in converter)) {
		throw new Error(`Opinions are not supported for this conversion type`);
	}
	// @ts-ignore - The existence of the opinions property is checked above
	if (!(opinionId in converter.opinions)) {
		throw new Error(`Opinion '${opinionId}' was not found`);
	}
	// @ts-ignore - The existence of the opinions property is checked above
	return converter.opinions[opinionId];
}

/**
 * Get the default opinion for a unit type (where the factor is 1)
 * @param {string} type - The type of unit to convert.
 * @returns {Promise<Opinion|null>} - The default opinion for the unit type.
 */
export async function getDefaultOpinion(type) {
	const converter = await getConverter(type);
	if (!('opinions' in converter)) {
		return null;
	}
	// @ts-ignore - The existence of the opinions property is checked above
	return Object.values(converter.opinions).find((opinion) => opinion.factor === 1) || null;
}

/**
 * @typedef {object} ConversionOptions
 * @property {string} type - The type of unit to convert.
 * @property {string} unitFromId - The unit to convert from.
 * @property {string} unitToId - The unit to convert to.
 * @property {number} [amount] - The amount to convert.
 * @property {string} [opinionId] - The opinion to use for the conversion (only when converting between standard and biblical units)
 */

/**
 * Convert a value from one unit to another.
 * @param {ConversionOptions} options - The options for the conversion.
 * @returns {Promise<{ from: string, to: string, result: number, opinion?: string }>} - The result of the conversion.
 */
export async function convertUnits({ type, unitFromId, unitToId, amount, opinionId }) {
	// set the default amount to 1
	if (amount === undefined) amount = 1;
	// get the units
	const unitFrom = await getUnit(type, unitFromId);
	const unitTo = await getUnit(type, unitToId);
	/** @type {{ from: string, to: string, result: number, opinion?: string }} */
	const outputs = {
		from: unitFrom.name,
		to: unitTo.name,
		result: (amount * unitTo.value) / unitFrom.value,
	};
	// if converting between standard and biblical units, apply the opinion
	if (unitFrom.type !== unitTo.type) {
		// if an opinion is specified, use it
		// otherwise, use the default opinion (where the factor is 1)
		const opinion = opinionId ? await getOpinion(type, opinionId) : await getDefaultOpinion(type);
		// if an opinion was found, apply it and add it to the outputs
		if (opinion) {
			outputs.result *= opinion.factor;
			outputs.opinion = opinion.name;
		}
	}
	// set the precision of the result to 6 decimal places
	outputs.result = Math.round(outputs.result * 1e6) / 1e6;
	// return the result
	return outputs;
}
