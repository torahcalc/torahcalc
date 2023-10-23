import { faCoins, faRuler, faRulerCombined, faScaleBalanced, faTankWater, faTimer } from '@danieloi/pro-solid-svg-icons';
import dayjs from 'dayjs';
import FALLBACK_EXCHANGE_RATES from './../data/exchange-rates.json';
import { iconToSvg } from './utils';

/**
 * @typedef {{ success: boolean, timestamp: number, base: string, date: string, rates: { CAD: number, EUR: number, GBP: number, ILS: number, XAG: number }}} ExchangeRates
 */

/**
 * @type {ExchangeRates|null} - Cached exchange rates for currencies and commodities.
 */
let EXCHANGE_RATES = null;

/**
 * Return the price of currencies and commodities.
 * @returns {Promise<ExchangeRates>}} - The price of currencies and commodities as currency codes and prices compared to 1 USD.
 */
async function getExchangeRates() {
	// if FALLBACK_EXCHANGE_RATES has been updated in the last 7 days, use it
	if (FALLBACK_EXCHANGE_RATES.date > dayjs().subtract(7, 'day').format('YYYY-MM-DD')) {
		EXCHANGE_RATES = FALLBACK_EXCHANGE_RATES;
	}
	// if we have cached exchange rates, return them
	if (EXCHANGE_RATES !== null) {
		return EXCHANGE_RATES;
	}
	// try to fetch exchange rates from CDN and use fallback if it fails
	const API_URL = 'https://cdn.jsdelivr.net/gh/torahcalc/torahcalc@main/src/lib/data/exchange-rates.json';
	try {
		const response = await fetch(API_URL);
		/** @type {ExchangeRates} - The price of currencies and commodities as currency codes and prices compared to 1 USD. */
		// @ts-ignore - ignore response.json() being 'unknown' type
		const data = await response.json();
		if (!data.rates) {
			throw new Error('Exchange rates not found');
		}
		EXCHANGE_RATES = data;
		console.log('Exchange rates updated');
		return EXCHANGE_RATES;
	} catch (error) {
		console.error(error);
		EXCHANGE_RATES = FALLBACK_EXCHANGE_RATES;
		return EXCHANGE_RATES;
	}
}

/**
 * @typedef {{ name: string, value: number, type: "BIBLICAL"|"STANDARD", updated?: string, display: string, displayPlural: string }} Unit
 * @typedef {{ name: string, factor: number }} Opinion
 * @typedef {{ name: string, icon: string, units: { [key: string]: Unit }, opinions?: { [key: string]: Opinion }, unitOpinions?: { [key: string]: { [key: string]: Opinion } } }} Converter
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
	const kikarKodeshUSD = (1 / exchangeRates.rates.XAG) * kikarKodeshTroyOz;
	const kikarKodeshNIS = kikarKodeshUSD * exchangeRates.rates.ILS;
	const kikarKodeshEUR = kikarKodeshUSD * exchangeRates.rates.EUR;
	const kikarKodeshCAD = kikarKodeshUSD * exchangeRates.rates.CAD;
	const kikarKodeshGBP = kikarKodeshUSD * exchangeRates.rates.GBP;
	const updateDate = dayjs(exchangeRates.timestamp * 1000).format('MMMM D, YYYY, h:mm A');
	return {
		length: {
			name: 'Length',
			icon: iconToSvg(faRuler),
			units: {
				derech_yom: { name: 'Derech Yom / Mahalach Yom - דרך יום / מהלך יום', value: 1, type: 'BIBLICAL', display: 'Derech Yom', displayPlural: 'Derech Yom' },
				parsah: { name: 'Parsah - פרסה', value: 10, type: 'BIBLICAL', display: 'Parsah', displayPlural: "Parsa'os" },
				mil: { name: 'Mil - מיל', value: 40, type: 'BIBLICAL', display: 'Mil', displayPlural: 'Milin' },
				ris: { name: 'Ris - ריס', value: 300, type: 'BIBLICAL', display: 'Ris', displayPlural: 'Ris' },
				kaneh: { name: 'Kaneh - קנה', value: 40000 / 3, type: 'BIBLICAL', display: 'Kaneh', displayPlural: 'Kanos' },
				amah: { name: 'Amah - אמה', value: 8e4, type: 'BIBLICAL', display: 'Amah', displayPlural: 'Amos' },
				short_amah: { name: 'Short Amah - אמה בת חמשה', value: 96e3, type: 'BIBLICAL', display: 'Short Amah', displayPlural: 'Short Amos' },
				zeret: { name: 'Zeret - זרת', value: 16e4, type: 'BIBLICAL', display: 'Zeret', displayPlural: 'Zaros' },
				tefach: { name: 'Tefach - טפח', value: 48e4, type: 'BIBLICAL', display: 'Tefach', displayPlural: 'Tefachim' },
				etzbah: { name: 'Etzbah - אצבע', value: 192e4, type: 'BIBLICAL', display: 'Etzbah', displayPlural: "Etzba'os" },
				kilometer: { name: 'Kilometer', value: 38.4, type: 'STANDARD', display: 'kilometer', displayPlural: 'kilometers' },
				meter: { name: 'Meter', value: 38400, type: 'STANDARD', display: 'meter', displayPlural: 'meters' },
				centimeter: { name: 'Centimeter', value: 3840000, type: 'STANDARD', display: 'centimeter', displayPlural: 'centimeters' },
				millimeter: { name: 'Millimeter', value: 38400000, type: 'STANDARD', display: 'millimeter', displayPlural: 'millimeters' },
				mile: { name: 'Mile', value: 3840000 / 160934.4, type: 'STANDARD', display: 'mile', displayPlural: 'miles' },
				yard: { name: 'Yard', value: 3840000 / 91.44, type: 'STANDARD', display: 'yard', displayPlural: 'yards' },
				foot: { name: 'Foot', value: 3840000 / 30.48, type: 'STANDARD', display: 'foot', displayPlural: 'feet' },
				inch: { name: 'Inch', value: 3840000 / 2.54, type: 'STANDARD', display: 'inch', displayPlural: 'inches' },
				nautical_mile: { name: 'Nautical mile', value: 38400 / 1852, type: 'STANDARD', display: 'nautical mile', displayPlural: 'nautical miles' },
			},
			opinions: {
				rabbi_avraham_chaim_naeh_standard: { name: "Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה (Standard)", factor: 1 },
				rabbi_avraham_chaim_naeh_stringent: { name: "Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה (Stringent)", factor: 49 / 48 },
				aruch_hashulchan: { name: 'Aruch Hashulchan - ערוך השולחן', factor: (21 * 2.54) / 48 },
				rabbi_moshe_feinstein_standard: { name: "Rabbi Moshe Feinstein - ר' משה פיינשטיין (Standard)", factor: (21.25 * 2.54) / 48 },
				rabbi_moshe_feinstein_stringent: { name: "Rabbi Moshe Feinstein - ר' משה פיינשטיין (Stringent)", factor: (23 * 2.54) / 48 },
				chazon_ish_standard: { name: 'Chazon Ish - חזון איש (Standard)', factor: 57.72 / 48 },
				chazon_ish_stringent: { name: 'Chazon Ish - חזון איש (Stringent)', factor: 58.92 / 48 },
			},
		},
		area: {
			name: 'Area',
			icon: iconToSvg(faRulerCombined),
			units: {
				beis_kor: { name: 'Beis kor - בית כור', value: 1, type: 'BIBLICAL', display: 'Beis Kor', displayPlural: 'Batei Kor' },
				beis_seasayim: { name: 'Beis seasayim - בית סאתים', value: 15, type: 'BIBLICAL', display: 'Beis Seasayim', displayPlural: 'Batei Seasayim' },
				beis_seah: { name: 'Beis seah - בית סאה', value: 30, type: 'BIBLICAL', display: 'Beis Seah', displayPlural: 'Batei Seah' },
				beis_kav: { name: 'Beis kav - בית קב', value: 180, type: 'BIBLICAL', display: 'Beis Kav', displayPlural: 'Batei Kav' },
				beis_rova: { name: 'Beis rova - בית רובע', value: 720, type: 'BIBLICAL', display: 'Beis Rova', displayPlural: 'Batei Rova' },
				amah_merubaas: { name: 'Amah merubaas - אמה מרובעת', value: 75e3, type: 'BIBLICAL', display: 'Amah Merubaas', displayPlural: 'Amah Merubaas' },
				tefach_merubah: { name: 'Tefach merubah - טפח מרובע', value: 27e5, type: 'BIBLICAL', display: 'Tefach Merubah', displayPlural: 'Tefach Merubaas' },
				etzbah_merubaas: { name: 'Etzbah merubaas - אצבע מרובעת', value: 432e5, type: 'BIBLICAL', display: 'Etzbah Merubaas', displayPlural: 'Etzbah Merubaas' },
				gris: { name: 'Gris - גריס', value: 48e7 / 9, type: 'BIBLICAL', display: 'Gris', displayPlural: 'Gris' },
				adashah: { name: 'Adashah - עדשה', value: 48e7, type: 'BIBLICAL', display: 'Adashah', displayPlural: 'Adashos' },
				searah: { name: 'Searah - שערה', value: 192e7, type: 'BIBLICAL', display: 'Searah', displayPlural: 'Searos' },
				hectare: { name: 'Hectare', value: 1.728, type: 'STANDARD', display: 'hectare', displayPlural: 'hectares' },
				square_kilometer: { name: 'Square kilometer', value: 0.01728, type: 'STANDARD', display: 'square kilometer', displayPlural: 'square kilometers' },
				square_meter: { name: 'Square meter', value: 17280, type: 'STANDARD', display: 'square meter', displayPlural: 'square meters' },
				square_centimeter: { name: 'Square centimeter', value: 172800000, type: 'STANDARD', display: 'Square centimeter', displayPlural: 'square centimeters' },
				square_millimeter: { name: 'Square millimeter', value: 17280000000, type: 'STANDARD', display: 'Square millimeter', displayPlural: 'square millimeters' },
				acre: { name: 'Acre', value: 172800000 / (2.54 * 2.54) / 6272640, type: 'STANDARD', display: 'acre', displayPlural: 'acres' },
				square_mile: { name: 'Square mile', value: 172800000 / (2.54 * 2.54) / 4014489600, type: 'STANDARD', display: 'square mile', displayPlural: 'square miles' },
				square_yard: { name: 'Square yard', value: 172800000 / (2.54 * 2.54) / 1296, type: 'STANDARD', display: 'square yard', displayPlural: 'square yards' },
				square_foot: { name: 'Square foot', value: 172800000 / (2.54 * 2.54) / 144, type: 'STANDARD', display: 'square foot', displayPlural: 'square feet' },
				square_inch: { name: 'Square inch', value: 172800000 / (2.54 * 2.54), type: 'STANDARD', display: 'square inch', displayPlural: 'square inches' },
			},
			opinions: {
				rabbi_avraham_chaim_naeh_standard: { name: "Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה (Standard)", factor: 1 },
				rabbi_avraham_chaim_naeh_stringent: { name: "Rabbi Avraham Chaim Naeh - ר' אברהם חיים נאה (Stringent)", factor: (49 * 49) / (48 * 48) },
				aruch_hashulchan: { name: 'Aruch Hashulchan - ערוך השולחן', factor: (53.34 * 53.34) / (48 * 48) },
				rabbi_moshe_feinstein_standard: { name: "Rabbi Moshe Feinstein - ר' משה פיינשטיין (Standard)", factor: (53.975 * 53.975) / (48 * 48) },
				rabbi_moshe_feinstein_stringent: { name: "Rabbi Moshe Feinstein - ר' משה פיינשטיין (Stringent)", factor: (58.42 * 58.42) / (48 * 48) },
				chazon_ish_standard: { name: 'Chazon Ish - חזון איש (Standard)', factor: (57.72 * 57.72) / (48 * 48) },
				chazon_ish_stringent: { name: 'Chazon Ish - חזון איש (Stringent)', factor: (58.92 * 58.92) / (48 * 48) },
			},
		},
		volume: {
			name: 'Volume',
			icon: iconToSvg(faTankWater),
			units: {
				kor: { name: 'Kor / Chomer - כור / חומר', value: 1, type: 'BIBLICAL', display: 'Kor / Chomer', displayPlural: 'Kor / Chomer' },
				letech: { name: 'Letech / Adriv - לתך / אדריב', value: 2, type: 'BIBLICAL', display: 'Letech / Adriv', displayPlural: 'Letech / Adriv' },
				ephah: { name: 'Ephah / Bat - איפה / בת', value: 10, type: 'BIBLICAL', display: 'Ephah / Bat', displayPlural: 'Ephah / Bat' },
				seah: { name: 'Seah - סאה', value: 30, type: 'BIBLICAL', display: 'Seah', displayPlural: 'Seah' },
				tarkav: { name: 'Tarkav / Hin - תרקב / הין', value: 60, type: 'BIBLICAL', display: 'Tarkav / Hin', displayPlural: 'Tarkav / Hin' },
				issaron: { name: 'Issaron / Omer - עשרון / עומר', value: 100, type: 'BIBLICAL', display: 'Issaron / Omer', displayPlural: 'Issaron / Omer' },
				kav: { name: 'Kav - קב', value: 180, type: 'BIBLICAL', display: 'Kav', displayPlural: 'Kav' },
				rova: { name: 'Rova / Log - רובע / לוג', value: 720, type: 'BIBLICAL', display: 'Rova / Log', displayPlural: 'Rova / Log' },
				tomen: { name: 'Tomen - תומן', value: 1440, type: 'BIBLICAL', display: 'Tomen', displayPlural: 'Tomen' },
				reviis: { name: "Revi'is - רביעית", value: 2880, type: 'BIBLICAL', display: "Revi'is", displayPlural: "Revi'is" },
				uchlah: { name: 'Uchlah / Klah - עוכלא / כלה', value: 3600, type: 'BIBLICAL', display: 'Uchlah / Klah', displayPlural: 'Uchlah / Klah' },
				beitzah: { name: 'Beitzah - ביצה', value: 4320, type: 'BIBLICAL', display: 'Beitzah', displayPlural: 'Beitzim' },
				kezayis: { name: 'Kezayis - כזית', value: 8640, type: 'BIBLICAL', display: 'Kezayis', displayPlural: 'Kezaysim' },
				grogeres: { name: 'Grogeres - גרוגרת', value: 14400, type: 'BIBLICAL', display: 'Grogeres', displayPlural: 'Grogaros' },
				mesurah: { name: 'Mesurah - משורה', value: 25920, type: 'BIBLICAL', display: 'Mesurah', displayPlural: 'Mesuros' },
				kortov: { name: 'Kortov - קורטוב', value: 46080, type: 'BIBLICAL', display: 'Kortov', displayPlural: 'Kortov' },
				us_liquid_gallon: { name: 'US liquid gallon', value: 248832 / 3785.411784, type: 'STANDARD', display: 'US liquid gallon', displayPlural: 'US liquid gallons' },
				us_liquid_quart: { name: 'US liquid quart ', value: (248832 / 3785.411784) * 4, type: 'STANDARD', display: 'US liquid quart ', displayPlural: 'US liquid quarts' },
				us_liquid_pint: { name: 'US liquid pint', value: (248832 / 3785.411784) * 8, type: 'STANDARD', display: 'US liquid pint', displayPlural: 'US liquid pints' },
				us_cup: { name: 'US cup', value: (248832 / 3785.411784) * 16, type: 'STANDARD', display: 'US cup', displayPlural: 'US cups' },
				us_fluid_ounce: { name: 'US fluid ounce', value: (248832 / 3785.411784) * 128, type: 'STANDARD', display: 'US fluid ounce', displayPlural: 'US fluid ounces' },
				us_tablespoon: { name: 'US tablespoon', value: (248832 / 3785.411784) * 256, type: 'STANDARD', display: 'US tablespoon', displayPlural: 'US tablespoons' },
				us_teaspoon: { name: 'US teaspoon', value: (248832 / 3785.411784) * 768, type: 'STANDARD', display: 'US teaspoon', displayPlural: 'US teaspoons' },
				cubic_meter: { name: 'Cubic meter', value: 0.248832, type: 'STANDARD', display: 'cubic meter', displayPlural: 'cubic meters' },
				liter: { name: 'Liter', value: 248.832, type: 'STANDARD', display: 'liter', displayPlural: 'liters' },
				milliliter: { name: 'Milliliter', value: 248832, type: 'STANDARD', display: 'milliliter', displayPlural: 'milliliters' },
				imperial_gallon: { name: 'Imperial gallon', value: 248832 / 4546.09, type: 'STANDARD', display: 'Imperial gallon', displayPlural: 'Imperial gallons' },
				imperial_quart: { name: 'Imperial quart', value: (248832 / 4546.09) * 4, type: 'STANDARD', display: 'Imperial quart', displayPlural: 'Imperial quarts' },
				imperial_pint: { name: 'Imperial pint', value: (248832 / 4546.09) * 8, type: 'STANDARD', display: 'Imperial pint', displayPlural: 'Imperial pints' },
				imperial_cup: { name: 'Imperial cup', value: (248832 / 4546.09) * 16, type: 'STANDARD', display: 'Imperial cup', displayPlural: 'Imperial cups' },
				imperial_fluid_ounce: { name: 'Imperial fluid ounce', value: (248832 / 4546.09) * 160, type: 'STANDARD', display: 'Imperial fluid ounce', displayPlural: 'Imperial fluid ounces' },
				imperial_tablespoon: { name: 'Imperial tablespoon', value: (248832 / 4546.09) * 256, type: 'STANDARD', display: 'Imperial tablespoon', displayPlural: 'Imperial tablespoons' },
				imperial_teaspoon: { name: 'Imperial teaspoon', value: 42036.7606, type: 'STANDARD', display: 'Imperial teaspoon', displayPlural: 'Imperial teaspoons' },
				cubic_foot: { name: 'Cubic foot', value: ((248832 / 3785.411784) * 231) / 1728, type: 'STANDARD', display: 'cubic foot', displayPlural: 'cubic feet' },
				cubic_inch: { name: 'Cubic inch', value: (248832 / 3785.411784) * 231, type: 'STANDARD', display: 'cubic inch', displayPlural: 'cubic inches' },
			},
			opinions: {
				desert_rabbi_avraham_chaim_naeh: { name: "Desert (Rabbi Avraham Chaim Naeh) - (מדבריות (ר' אברהם חיים נאה", factor: 1 },
				desert_chazon_ish: { name: 'Desert (Chazon Ish) - (מדבריות (חזון איש', factor: 31 / 18 },
				jerusalem_rabbi_avraham_chaim_naeh: { name: "Jerusalem (Rabbi Avraham Chaim Naeh) - (ירושלמיות (ר' אברהם חיים נאה", factor: 65 / 64 },
				jerusalem_chazon_ish: { name: 'Jerusalem (Chazon Ish) - (ירושלמיות (חזון איש', factor: 56 / 27 },
				tzipori_rabbi_avraham_chaim_naeh: { name: "Tzipori (Rabbi Avraham Chaim Naeh) - (ציפוריות (ר' אברהם חיים נאה", factor: 13 / 9 },
				tzipori_chazon_ish: { name: 'Tzipori (Chazon Ish) - (ציפוריות (חזון איש', factor: 67 / 27 },
			},
		},
		weight: {
			name: 'Mass / Weight',
			icon: iconToSvg(faScaleBalanced),
			units: {
				kikar: { name: 'Kikar - כיכר', value: 1, type: 'BIBLICAL', display: 'Kikar', displayPlural: 'Kikar' },
				mane: { name: 'Maneh / Litra - מנה / ליטרא', value: 60, type: 'BIBLICAL', display: 'Maneh / Litra', displayPlural: 'Manos / Litra' },
				tartimar: { name: 'Tartimar - תרטימר', value: 120, type: 'BIBLICAL', display: 'Tartimar', displayPlural: 'Tartimar' },
				unkeya: { name: 'Unkeya - אונקיא', value: 750, type: 'BIBLICAL', display: 'Unkeya', displayPlural: 'Unkeya' },
				sela: { name: 'Sela - סלע', value: 1500, type: 'BIBLICAL', display: 'Sela', displayPlural: 'Selayim' },
				shekel: { name: 'Shekel - שקל', value: 3e3, type: 'BIBLICAL', display: 'Ancient Shekel', displayPlural: 'Ancient Shekalim' },
				dinar: { name: 'Dinar / Zuz / Zin - דינר / זוז / זין', value: 6e3, type: 'BIBLICAL', display: 'Dinar / Zuz / Zin', displayPlural: 'Dinarim / Zuzim / Zinim' },
				kilogram: { name: 'Kilogram', value: 27, type: 'STANDARD', display: 'kilogram', displayPlural: 'kilograms' },
				gram: { name: 'Gram', value: 27e3, type: 'STANDARD', display: 'gram', displayPlural: 'grams' },
				milligram: { name: 'Milligram', value: 27e6, type: 'STANDARD', display: 'milligram', displayPlural: 'milligrams' },
				stone: { name: 'Stone', value: 27 / 0.45359237 / 14, type: 'STANDARD', display: 'stone', displayPlural: 'stones' },
				pound: { name: 'Pound', value: 27 / 0.45359237, type: 'STANDARD', display: 'pound', displayPlural: 'pounds' },
				ounce: { name: 'Ounce', value: (27 / 0.45359237) * 16, type: 'STANDARD', display: 'ounce', displayPlural: 'ounces' },
			},
		},
		coins: {
			name: 'Coins',
			icon: iconToSvg(faCoins),
			units: {
				kikar_shel_kodesh: { name: 'Kikar shel kodesh - כיכר של קודש', value: 1, type: 'BIBLICAL', display: 'Kikar shel kodesh', displayPlural: 'Kikar shel kodesh' },
				kikar: { name: 'Kikar - כיכר', value: 2, type: 'BIBLICAL', display: 'Kikar', displayPlural: 'Kikar' },
				mane_shel_kodesh: { name: 'Maneh shel kodesh - מנה של קודש', value: 60, type: 'BIBLICAL', display: 'Maneh shel kodesh', displayPlural: 'Maneh shel kodesh' },
				mane: { name: 'Maneh - מנה', value: 120, type: 'BIBLICAL', display: 'Maneh', displayPlural: 'Maneh' },
				dinar_zahav: { name: 'Dinar zahav - דינר זהב', value: 480, type: 'BIBLICAL', display: 'Dinar zahav', displayPlural: 'Dinar zahav' },
				sela: { name: 'Sela - סלע', value: 3e3, type: 'BIBLICAL', display: 'Sela', displayPlural: 'Selayim' },
				shekel: { name: 'Shekel - שקל', value: 6e3, type: 'BIBLICAL', display: 'Shekel', displayPlural: 'Shekalim' },
				dinar: { name: 'Dinar / Zuz - דינר / זוז', value: 12e3, type: 'BIBLICAL', display: 'Dinar / Zuz', displayPlural: 'Dinarim / Zuzim' },
				istera: { name: 'Istera / Tarpik - אסתרא / טרפעיק', value: 24e3, type: 'BIBLICAL', display: 'Istera / Tarpik', displayPlural: 'Istera / Tarpik' },
				maah: { name: 'Maah - מעה', value: 72e3, type: 'BIBLICAL', display: 'Maah', displayPlural: 'Maah' },
				pundyon: { name: 'Pundyon - פונדיון', value: 144e3, type: 'BIBLICAL', display: 'Pundyon', displayPlural: 'Pundyon' },
				issar: { name: 'Issar - איסר', value: 288e3, type: 'BIBLICAL', display: 'Issar', displayPlural: 'Issar' },
				mesimas: { name: 'Mesimas - מסימס', value: 576e3, type: 'BIBLICAL', display: 'Mesimas', displayPlural: 'Mesimas' },
				kontrank: { name: 'Kontrank - קונטרק', value: 1152e3, type: 'BIBLICAL', display: 'Kontrank', displayPlural: 'Kontrank' },
				perutah: { name: 'Perutah - פרוטה', value: 2304e3, type: 'BIBLICAL', display: 'Perutah', displayPlural: 'Perutos' },
				usd: { name: 'US Dollars (USD)', value: kikarKodeshUSD, type: 'STANDARD', updated: updateDate, display: 'US Dollar', displayPlural: 'US Dollars' },
				nis: { name: 'Israeli New Sheqels (NIS)', value: kikarKodeshNIS, type: 'STANDARD', updated: updateDate, display: 'Israeli New Sheqel', displayPlural: 'Israeli New Sheqels' },
				eur: { name: 'European Euro (EUR)', value: kikarKodeshEUR, type: 'STANDARD', updated: updateDate, display: 'European Euro', displayPlural: 'European Euro' },
				cad: { name: 'Canadian Dollars (CAD)', value: kikarKodeshCAD, type: 'STANDARD', updated: updateDate, display: 'Canadian Dollar', displayPlural: 'Canadian Dollars' },
				gbp: { name: 'Pound sterling (GBP)', value: kikarKodeshGBP, type: 'STANDARD', updated: updateDate, display: 'Pounds Sterling', displayPlural: 'Pounds Sterling' },
				grams_of_silver: { name: 'Grams of silver', value: 55296, type: 'STANDARD', display: 'gram of silver', displayPlural: 'grams of silver' },
				ounces_of_silver: { name: 'Ounces of silver', value: kikarKodeshTroyOz, type: 'STANDARD', updated: updateDate, display: 'ounce of silver', displayPlural: 'ounces of silver' },
			},
			opinions: {
				shulchan_aruch_rambam: { name: 'Shulchan Aruch / Rambam - שולחן ערוך / רמב״ם', factor: 1 },
				rashi: { name: 'Rashi - רש״י', factor: 5 / 6 },
				other: { name: 'Other authorities - פוסקים אחרים', factor: 1.13 },
			},
		},
		time: {
			name: 'Time',
			icon: iconToSvg(faTimer),
			units: {
				yovel: { name: 'Yovel - יובל', value: 1, type: 'BIBLICAL', display: 'Yovel', displayPlural: 'Yovelos' },
				shmittah: { name: 'Shmittah - שמיטה', value: 7.142857142857143, type: 'BIBLICAL', display: 'Shmittah', displayPlural: 'Shmittos' },
				shanah: { name: 'Shanah - שנה', value: 50, type: 'BIBLICAL', display: 'Shanah', displayPlural: 'Shanim' },
				tekufah: { name: 'Tekufah - תקופה', value: 200, type: 'BIBLICAL', display: 'Tekufah', displayPlural: 'Tekufos' },
				chodesh: { name: 'Chodesh - חודש', value: 600, type: 'BIBLICAL', display: 'Chodesh', displayPlural: 'Chodashim' },
				molad: { name: "Molad Emtza'i - מולד אמצעי", value: 458784e3 / 765433, type: 'BIBLICAL', display: "Molad Emtza'i", displayPlural: "Molad Emtza'im" },
				shavuah: { name: 'Shavuah - שבוע', value: 2528.57142857, type: 'BIBLICAL', display: 'Shavuah', displayPlural: 'Shavuos' },
				yom: { name: 'Yom - יום', value: 17700, type: 'BIBLICAL', display: 'Yom', displayPlural: 'Yamim' },
				onah: { name: 'Onah - עונה', value: 35400, type: 'BIBLICAL', display: 'Onah', displayPlural: 'Onos' },
				shaah: { name: 'Shaah - שעה', value: 424800, type: 'BIBLICAL', display: 'Shaah', displayPlural: 'Shaos' },
				hiluch_mil: { name: 'Hiluch Mil - הילוך מיל', value: 1416e3, type: 'BIBLICAL', display: 'Hiluch Mil', displayPlural: 'Hiluch Mil' },
				kdei_achilas_pras: { name: "K'dei Achilas Pras - כדי אכילת פרס", value: 12744e3, type: 'BIBLICAL', display: "K'dei Achilas Peras", displayPlural: "K'dei Achilas Peras" },
				small_onah: { name: 'Small Onah - עונה', value: 10195200, type: 'BIBLICAL', display: 'Small Onah', displayPlural: 'Small Onos' },
				et: { name: 'Et - עת', value: 244684800, type: 'BIBLICAL', display: 'Et', displayPlural: 'Et' },
				chelek: { name: 'Chelek - חלק', value: 458784e3, type: 'BIBLICAL', display: 'Chelek', displayPlural: 'Chalakim' },
				rega: { name: 'Rega - רגע', value: 34867584e3, type: 'BIBLICAL', display: 'Rega', displayPlural: 'Regaim' },
				century: { name: 'Century', value: 0.48493151, type: 'STANDARD', display: 'century', displayPlural: 'centuries' },
				decade: { name: 'Decade', value: 4.8460994, type: 'STANDARD', display: 'decade', displayPlural: 'decades' },
				year: { name: 'Year', value: 48.493151, type: 'STANDARD', display: 'year', displayPlural: 'years' },
				month: { name: 'Month', value: 581.91717, type: 'STANDARD', display: 'month', displayPlural: 'months' },
				week: { name: 'Week', value: 2528.5714, type: 'STANDARD', display: 'week', displayPlural: 'weeks' },
				day: { name: 'Day', value: 17700, type: 'STANDARD', display: 'day', displayPlural: 'days' },
				hour: { name: 'Hour', value: 424800, type: 'STANDARD', display: 'hour', displayPlural: 'hours' },
				minute: { name: 'Minute', value: 25488e3, type: 'STANDARD', display: 'minute', displayPlural: 'minutes' },
				second: { name: 'Second', value: 152928e4, type: 'STANDARD', display: 'second', displayPlural: 'seconds' },
				millisecond: { name: 'Millisecond', value: 152928e7, type: 'STANDARD', display: 'millisecond', displayPlural: 'milliseconds' },
			},
			unitOpinions: {
				hiluch_mil: {
					shulchan_aruch_harav: { name: 'Shulchan Aruch Harav (Hiluch Mil = 18 minutes)', factor: 1 },
					biur_hagra: { name: 'Biur HaGra (Hiluch Mil = 22.5 minutes)', factor: 1.25 },
					shulchan_aruch_harav_stringent: { name: 'Shulchan Aruch Harav (Hiluch Mil = 24 minutes)', factor: 4 / 3 },
				},
				kdei_achilas_pras: {
					chasam_sofer: { name: "Chasam Sofer (K'dei Achilas Pras = 2 minutes)", factor: 1 },
					rabbi_chanoch_henech_eigs: { name: "Rabbi Chanoch Henech Eigs (K'dei Achilas Pras = 3 minutes)", factor: 1.5 },
					aruch_hashulchan: { name: "Aruch HaShulchan (K'dei Achilas Pras = 3 minutes)", factor: 1.5 },
					aruch_hashulchan_stringent: { name: "Aruch HaShulchan (K'dei Achilas Pras = 4 minutes)", factor: 2 },
					kaf_hachaim: { name: "Kaf Hachaim (K'dei Achilas Pras = 4 minutes)", factor: 2 },
					kaf_hachaim_stringent: { name: "Kaf Hachaim (K'dei Achilas Pras = 7 minutes)", factor: 3.5 },
					rabbi_avraham_chaim_naeh: { name: "Rabbi Avraham Chaim Na'eh (K'dei Achilas Pras = 4 minutes)", factor: 2 },
					rabbi_yitzchak_elchonon_spector: { name: "Rabbi Yitzchak Elchonon Spector (K'dei Achilas Pras = 5 minutes)", factor: 2.5 },
					rabbi_ovadiah_yosef: { name: "Rabbi Ovadiah Yosef (K'dei Achilas Pras = 8 minutes)", factor: 4 },
					chasam_sofer_stringent: { name: "Chasam Sofer (K'dei Achilas Pras = 9 minutes)", factor: 4.5 },
					rabbi_avraham_chaim_naeh_stringent: { name: "Rabbi Avraham Chaim Na'eh (K'dei Achilas Pras = 9 minutes)", factor: 4.5 },
					darkei_horaah11: { name: "Darkei Hora'ah (K'dei Achilas Pras = 11 minutes and 9 seconds)", factor: 5.575 },
				},
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
 * Return a mapping of unit types to lists of unit opinions.
 * @param {Converters} converters
 * @returns {{[key: string]: string[]}} The opinions in a mapping of type to list of opinions
 */
export function getUnitOpinions(converters) {
	/** @type {{[key: string]: string[]}} */
	const opinions = {};
	for (const [type, converter] of Object.entries(converters)) {
		if (converter.unitOpinions) {
			for (const [unit, unitOpinions] of Object.entries(converter.unitOpinions)) {
				opinions[`${unit} (${type})`] = Object.keys(unitOpinions).map((opinion) => `${unit}.${opinion}`);
			}
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
	if (!converters[type]) {
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
	if (!converter.opinions) {
		throw new Error(`Opinions are not supported for ${type} units`);
	}
	if (!converter.opinions[opinionId]) {
		throw new Error(`Opinion '${opinionId}' was not found`);
	}
	return converter.opinions[opinionId];
}

/**
 * Get the opinion details for a unit opinion.
 * @param {string} type - The type of unit to convert.
 * @param {string} unitOpinionId - The opinion to get the details for (unitId.opinionId)
 * @returns {Promise<Opinion>} - The details of the opinion.
 */
export async function getUnitOpinion(type, unitOpinionId) {
	const converter = await getConverter(type);
	let [unitId, opinionId] = unitOpinionId.split('.');
	unitId = unitId.trim().toLowerCase();
	if (!converter.unitOpinions) {
		throw new Error(`Unit opinions are not supported for ${type} units`);
	}
	if (!converter.unitOpinions[unitId]) {
		throw new Error(`Unit '${unitId}' does not have any unit opinions`);
	}
	opinionId = opinionId.trim().toLowerCase();
	if (!(opinionId in converter.unitOpinions[unitId])) {
		throw new Error(`The unit opinion '${unitOpinionId}' was not found`);
	}
	return converter.unitOpinions[unitId][opinionId];
}

/**
 * Get the default opinion for a unit type (where the factor is 1)
 * @param {string} type - The type of unit to convert.
 * @returns {Promise<Opinion|null>} - The default opinion for the unit type.
 */
export async function getDefaultOpinion(type) {
	const converter = await getConverter(type);
	if (!converter.opinions) {
		return null;
	}
	return Object.values(converter.opinions).find((opinion) => opinion.factor === 1) || null;
}

/**
 * Get the default unit opinion for a unit type (where the factor is 1)
 * @param {string} type - The type of unit to convert.
 * @param {string} unitId - The unit to get the default opinion for.
 * @returns {Promise<Opinion|null>} - The default opinion for the unit type.
 */
export async function getDefaultUnitOpinion(type, unitId) {
	const converter = await getConverter(type);
	if (!converter?.unitOpinions?.[unitId]) {
		return null;
	}
	return Object.values(converter.unitOpinions[unitId]).find((opinion) => opinion.factor === 1) || null;
}

/**
 * @typedef {object} ConversionOptions
 * @property {string} type - The type of unit to convert.
 * @property {string} unitFromId - The unit to convert from.
 * @property {string} unitToId - The unit to convert to.
 * @property {number} [amount] - The amount to convert.
 * @property {string} [opinionId] - The opinion to use for the conversion (only when converting between standard and biblical units)
 * @property {string[]} [unitOpinionIds] - The unit opinions to use for the conversion (unitId.opinionId)
 *
 * @typedef {{ from: string, to: string, result: number, opinion?: string, unitOpinions?: string[] }} ConversionResult
 */

/**
 * Convert a value from one unit to another.
 * @param {ConversionOptions} options - The options for the conversion.
 * @returns {Promise<ConversionResult>} - The result of the conversion.
 */
export async function convertUnits({ type, unitFromId, unitToId, amount, opinionId, unitOpinionIds }) {
	// validate unitOpinionIds - make sure only one opinion per unit and that the unit exists
	await validateUnitOpinionIds(type, unitOpinionIds);

	// set the default amount to 1
	if (amount === undefined) amount = 1;

	// get the units
	const unitFrom = await getUnit(type, unitFromId);
	const unitTo = await getUnit(type, unitToId);

	/** @type {ConversionResult} */
	const outputs = {
		from: unitFrom.name,
		to: unitTo.name,
		result: (amount * unitTo.value) / unitFrom.value,
	};

	// if converting between standard and biblical units, apply the opinion
	const defaultOpinion = await getDefaultOpinion(type);
	if (unitFrom.type !== unitTo.type && defaultOpinion) {
		const opinion = opinionId ? await getOpinion(type, opinionId) : defaultOpinion;
		if (opinion) {
			// if converting from standard to biblical, apply the inverse
			const factor = unitFrom.type === 'BIBLICAL' ? opinion.factor : 1 / opinion.factor;
			outputs.result *= factor;
			outputs.opinion = opinion.name;
		}
	}
	// if the 'from' unit is in the unitOpinions, apply the opinion
	const defaultFromUnitOpinion = await getDefaultUnitOpinion(type, unitFromId);
	if (defaultFromUnitOpinion && unitFromId !== unitToId) {
		const unitOpinionId = unitOpinionIds?.find((unitOpinionId) => unitOpinionId.startsWith(`${unitFromId}.`));
		const opinion = unitOpinionId ? await getUnitOpinion(type, unitOpinionId) : defaultFromUnitOpinion;
		if (opinion) {
			outputs.result *= opinion.factor;
			outputs.unitOpinions = [opinion.name];
		}
	}
	// if the 'to' unit is in the unitOpinions, apply the opinion
	const defaultToUnitOpinion = await getDefaultUnitOpinion(type, unitToId);
	if (defaultToUnitOpinion && unitFromId !== unitToId) {
		const unitOpinionId = unitOpinionIds?.find((unitOpinionId) => unitOpinionId.startsWith(`${unitToId}.`));
		const opinion = unitOpinionId ? await getUnitOpinion(type, unitOpinionId) : defaultToUnitOpinion;
		// if converting to the unit with the opinion, apply the inverse
		if (opinion) {
			outputs.result /= opinion.factor;
			outputs.unitOpinions = outputs.unitOpinions ? [...outputs.unitOpinions, opinion.name] : [opinion.name];
		}
	}

	// return the result
	return outputs;
}

/**
 * @typedef {object} MultiConversionOptions
 * @property {string} type - The type of unit to convert.
 * @property {string} unitFromId - The unit to convert from.
 * @property {number} [amount] - The amount to convert.
 * @property {string} [opinionId] - The opinion to use for the converting between standard and biblical units.
 * @property {string[]} [unitOpinionIds] - The unit opinions to use for the conversion (unitId.opinionId)
 *
 * @typedef {{ name: string, result: number, opinion?: string, unitOpinions?: string[] }} MultiConversionUnit
 *
 * @typedef {{ [key: string]: MultiConversionUnit }} MultiConversionResult
 *
 */

/**
 * Convert a value from one unit to all compatible units.
 * @param {MultiConversionOptions} options - The options for the conversion.
 * @returns {Promise<MultiConversionResult>} - The result of the conversion.
 */
export async function convertUnitsMulti({ type, unitFromId, amount, opinionId, unitOpinionIds }) {
	// validate unitOpinionIds - make sure only one opinion per unit and that the unit exists
	await validateUnitOpinionIds(type, unitOpinionIds);

	// set the default amount to 1
	if (amount === undefined) amount = 1;

	/** @type {MultiConversionResult} */
	const outputs = {};
	// convert the amount to each compatible unit
	for (const unitToId of Object.keys((await getConverter(type)).units)) {
		const result = await convertUnits({ type, unitFromId, unitToId, amount, opinionId, unitOpinionIds });
		outputs[unitToId] = {
			name: result.to,
			result: result.result,
		};
		if (result.opinion) outputs[unitToId].opinion = result.opinion;
		if (result.unitOpinions) outputs[unitToId].unitOpinions = result.unitOpinions;
	}

	// return the results
	return outputs;
}

/**
 * Convert a value from one unit to all compatible units according to all compatible opinions.
 *
 * @param {MultiConversionOptions} options - The options for the conversion.
 * @returns {Promise<{ [key: string]: MultiConversionResult }>} - The result of the conversion.
 */
export async function convertUnitsMultiAll({ type, unitFromId, amount }) {
	// set the default amount to 1
	if (amount === undefined) amount = 1;

	const converters = await getConverters();

	const opinions = getOpinions(converters)[type] || [];
	const unitOpinionsForType = converters[type].unitOpinions ?? {};
	const fromUnitOpinionIds = Object.keys(unitOpinionsForType[unitFromId] ?? {}).map((opinionId) => `${unitFromId}.${opinionId}`);
	const unitsWithOpinions = Object.keys(unitOpinionsForType);

	/** @type {{ [key: string]: MultiConversionResult }} */
	const outputs = {
		'no-opinion': {},
	};
	// convert the amount to each compatible opinion if there are any
	if (opinions.length) {
		for (const opinionId of opinions) {
			const result = await convertUnitsMulti({ type, unitFromId, amount, opinionId });
			outputs[opinionId] = {};
			for (const [unitId, unitResult] of Object.entries(result)) {
				if (unitResult.opinion) {
					outputs[opinionId][unitId] = unitResult;
				} else if (!outputs['no-opinion'][unitId]) {
					outputs['no-opinion'][unitId] = unitResult;
				}
			}
		}
	} else if (fromUnitOpinionIds.length) {
		for (const unitOpinionId of fromUnitOpinionIds) {
			const result = await convertUnitsMulti({ type, unitFromId, amount, unitOpinionIds: [unitOpinionId] });
			outputs[unitOpinionId] = {};
			for (const [unitToId, unitResult] of Object.entries(result)) {
				if (unitsWithOpinions.includes(unitToId) && unitToId !== unitFromId) {
					// TODO: Support two different unit opinions
				} else if (unitResult.unitOpinions) {
					outputs[unitOpinionId][unitToId] = unitResult;
				} else if (!outputs['no-opinion'][unitToId]) {
					outputs['no-opinion'][unitToId] = unitResult;
				}
			}
		}
	} else {
		const multiConversionResult = await convertUnitsMulti({ type, unitFromId, amount });
		for (const [unitToId, unitResult] of Object.entries(multiConversionResult)) {
			if (!unitResult.unitOpinions) {
				outputs['no-opinion'][unitToId] = unitResult;
			} else {
				const toUnitOpinionIds = Object.keys(unitOpinionsForType[unitToId] ?? {}).map((opinionId) => `${unitToId}.${opinionId}`);
				for (const unitOpinionId of toUnitOpinionIds) {
					const result = await convertUnitsMulti({ type, unitFromId, amount, unitOpinionIds: [unitOpinionId] });
					outputs[unitOpinionId] = {
						[unitToId]: result[unitToId],
					};
				}
			}
		}
	}

	// return the results
	return outputs;
}

/**
 * Validate unitOpinionIds - make sure only one opinion per unit and that the units exist
 *
 * @param {string} type - The type of unit to convert.
 * @param {string[]} [unitOpinionIds] - The unit opinions to use for the conversion (unitId.opinionId)
 * @throws {Error} - If the unit opinion is invalid
 */
async function validateUnitOpinionIds(type, unitOpinionIds) {
	if (!unitOpinionIds) return;
	// remove duplicates
	unitOpinionIds = [...new Set(unitOpinionIds)];
	/** @type {{ [key: string]: string }} */
	const unitOpinionIdsMap = {};
	for (const unitOpinionId of unitOpinionIds) {
		const [unitId, opinionId] = unitOpinionId.split('.');
		if (!unitId || !opinionId) {
			throw new Error(`Invalid unit opinion '${unitOpinionId}'`);
		}
		if (unitOpinionIdsMap[unitId]) {
			throw new Error(`The unit opinion '${unitOpinionId}' cannot be used with '${unitOpinionIdsMap[unitId]}'`);
		}
		unitOpinionIdsMap[unitId] = unitOpinionId;
		await getUnitOpinion(type, unitOpinionId);
	}
}
