import { isTrue } from '$lib/js/api/helper';
import { createResponse, createErrorResponse } from '$lib/js/api/response.js';
import { getHolidays } from '$lib/js/holidays';
import { HDate } from '@hebcal/core';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	let result = [];
	const gregorianYear = Number(url.searchParams.get('gregorianYear') || NaN);
	const hebrewYear = Number(url.searchParams.get('hebrewYear') || NaN);
	const hebrewMonth = Number(url.searchParams.get('hebrewMonth') || NaN);
	const hebrewDay = Number(url.searchParams.get('hebrewDay') || NaN);

	const types = {
		diaspora: isTrue(url.searchParams.get('diaspora') ?? '1'),
		major: isTrue(url.searchParams.get('major') ?? '1'),
		minor: isTrue(url.searchParams.get('minor') ?? '1'),
		fasts: isTrue(url.searchParams.get('fasts') ?? '1'),
		roshChodesh: isTrue(url.searchParams.get('roshChodesh') ?? '1'),
		shabbosMevorchim: isTrue(url.searchParams.get('shabbosMevorchim') ?? '0'),
		specialShabbos: isTrue(url.searchParams.get('specialShabbos') ?? '0'),
		modern: isTrue(url.searchParams.get('modern') ?? '0'),
		chabad: isTrue(url.searchParams.get('chabad') ?? '0'),
	};

	if (isNaN(gregorianYear) && isNaN(hebrewYear)) {
		return createErrorResponse('Please provide a valid Gregorian or Hebrew year.');
	} else if (!isNaN(hebrewYear) && isNaN(hebrewMonth) && isNaN(hebrewDay)) {
		result = getHolidays({ hebrewYear, types });
	} else if (!isNaN(hebrewYear)) {
		if (isNaN(hebrewMonth) || isNaN(hebrewDay)) {
			return createErrorResponse('Please provide a valid Hebrew month and day.');
		}
		const startDate = new HDate(hebrewDay, hebrewMonth, hebrewYear);
		result = getHolidays({ startDate, types });
	} else {
		result = getHolidays({ gregorianYear, types });
	}

	try {
		return createResponse(result);
	} catch (error) {
		return createErrorResponse(error);
	}
}
