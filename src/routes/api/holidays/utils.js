import { isTrue } from '$lib/js/api/helper';

/**
 * Read the calendar types from the URL.
 * @param {URL} url The URL to read from.
 * @returns {{ [key: string]: boolean }} An object with the calendar types.
 */
export function readTypes(url) {
	return {
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
}
