import {
	chofetzChaim,
	ChofetzChaimEvent,
	DafPageEvent,
	dafWeekly,
	DafWeeklyEvent,
	DafYomi,
	dailyPsalms,
	dailyRambam1,
	DailyRambamEvent,
	NachYomiEvent,
	NachYomiIndex,
	PsalmsEvent,
	schottenstein,
	shemiratHaLashon,
	ShemiratHaLashonEvent,
	vilna,
	yerushalmiYomi,
	YerushalmiYomiEvent,
} from '@hebcal/learning';
import dayjs from 'dayjs';
import { dateToHDate, tryOrDefault } from './utils';

/**
 * Learning type keys mapped to their full names.
 * @type {{ [key: string]: string }}
 */
export const LEARNING_TYPE_NAMES = {
	dafYomi: 'Daf Yomi',
	nachYomi: 'Nach Yomi',
	yerushalmiYomiVilna: 'Yerushalmi Yomi (Vilna)',
	yerushalmiYomiSchottenstein: 'Yerushalmi Yomi (Schottenstein)',
	chofetzChaim: 'Chofetz Chaim',
	dailyRamban: 'Daily Rambam',
	shemiratHaLashon: 'Shemirat HaLashon',
	dailyPsalms: 'Daily Tehilim',
	dafWeekly: 'Daf Weekly',
};

/**
 * Calculate the daily learning for a given date.
 * @param {string} date - The date to calculate the Daf Yomi for in YYYY-MM-DD format.
 * @returns {{ [key: string]: string|DailyLearning|null }} - The Daf Yomi, Nach Yomi, Yerushalmi Yomi, Chofetz Chaim, Daily Rambam, Shemirat HaLashon, Daily Psalms, and Weekly Daf for the given date.
 */
export function calculateDailyLearning(date) {
	return {
		date: dayjs(date).format('YYYY-MM-DD'),
		dafYomi: getDafYomi(date),
		dafWeekly: getDafWeekly(date),
		dailyPsalms: getDailyPsalms(date),
		nachYomi: getNachYomi(date),
		yerushalmiYomiVilna: getYerushalmiYomi(date, vilna),
		yerushalmiYomiSchottenstein: getYerushalmiYomi(date, schottenstein),
		chofetzChaim: getChofetzChaim(date),
		dailyRamban: getDailyRambam(date),
		shemiratHaLashon: getShemiratHaLashon(date),
	};
}

/**
 * @typedef {{ name: string, hebrewName: string|undefined, url: string|undefined }} DailyLearning - Details about a daily learning
 */

/**
 * Get the Daf Yomi for a given date.
 * @param {string} date - The date to calculate the Daf Yomi for in YYYY-MM-DD format.
 * @returns {DailyLearning|null} - The Daf Yomi for the given date.
 */
export function getDafYomi(date) {
	const hDate = dateToHDate(dayjs(date).toDate());
	const daf = tryOrDefault(() => new DafYomi(hDate), null);
	if (!daf) return null;
	const evt = new DafPageEvent(hDate, daf, 0);
	return {
		name: evt.render(),
		hebrewName: evt.render('he'),
		url: evt.url(),
	};
}

/**
 * Get the Nach Yomi for a given date.
 * @param {string} date - The date to calculate the Nach Yomi for in YYYY-MM-DD format.
 * @returns {DailyLearning|null} - The Nach Yomi for the given date.
 */
export function getNachYomi(date) {
	const hDate = dateToHDate(dayjs(date).toDate());
	const nachYomi = tryOrDefault(() => new NachYomiIndex().lookup(hDate), null);
	if (!nachYomi) return null;
	const evt = new NachYomiEvent(hDate, nachYomi);
	return {
		name: evt.render(),
		hebrewName: evt.render('he'),
		url: evt.url(),
	};
}

/**
 * Get the Yerushalmi Yomi for a given date.
 * @param {string} date - The date to calculate the Yerushalmi Yomi for in YYYY-MM-DD format.
 * @param {schottenstein|vilna} edition - The edition of the Yerushalmi Yomi to use (vilna or schottenstein).
 * @returns {DailyLearning|null} - The Yerushalmi Yomi for the given date.
 */
export function getYerushalmiYomi(date, edition) {
	const hDate = dateToHDate(dayjs(date).toDate());
	const yerushalmi = tryOrDefault(() => yerushalmiYomi(hDate, edition), null);
	if (!yerushalmi) return null;
	const evt = new YerushalmiYomiEvent(hDate, yerushalmi);
	return {
		name: evt.render(),
		hebrewName: evt.render('he'),
		url: evt.url(),
	};
}

/**
 * Get the Chofetz Chaim for a given date.
 * @param {string} date - The date to calculate the Chofetz Chaim for in YYYY-MM-DD format.
 * @returns {DailyLearning|null} - The Chofetz Chaim for the given date.
 */
export function getChofetzChaim(date) {
	const hDate = dateToHDate(dayjs(date).toDate());
	const chofetzChaimYomi = tryOrDefault(() => chofetzChaim(hDate), null);
	if (!chofetzChaimYomi) return null;
	const evt = new ChofetzChaimEvent(hDate, chofetzChaimYomi);
	return {
		name: evt.render(),
		hebrewName: evt.render('he'),
		url: evt.url(),
	};
}

/**
 * Get the daily Rambam for a given date.
 * @param {string} date - The date to calculate the daily Rambam for in YYYY-MM-DD format.
 * @returns {DailyLearning|null} - The daily Rambam for the given date.
 */
export function getDailyRambam(date) {
	const hDate = dateToHDate(dayjs(date).toDate());
	const dailyRambam = tryOrDefault(() => dailyRambam1(hDate), null);
	if (!dailyRambam) return null;
	const evt = new DailyRambamEvent(hDate, dailyRambam);
	return {
		name: evt.render(),
		hebrewName: evt.render('he'),
		url: evt.url(),
	};
}

/**
 * Get the Shemirat HaLashon for a given date.
 * @param {string} date - The date to calculate the Shemirat HaLashon for in YYYY-MM-DD format.
 * @returns {DailyLearning|null} - The Shemirat HaLashon for the given date.
 */
export function getShemiratHaLashon(date) {
	const hDate = dateToHDate(dayjs(date).toDate());
	const shemiratHaLashonYomi = tryOrDefault(() => shemiratHaLashon(hDate), null);
	if (!shemiratHaLashonYomi) return null;
	const evt = new ShemiratHaLashonEvent(hDate, shemiratHaLashonYomi);
	return {
		name: evt.render(),
		hebrewName: evt.render('he'),
		url: evt.url(),
	};
}

/**
 * Get the daily Psalms for a given date.
 * @param {string} date - The date to calculate the daily Psalms for in YYYY-MM-DD format.
 * @returns {DailyLearning|null} - The daily Psalms for the given date.
 */
export function getDailyPsalms(date) {
	const hDate = dateToHDate(dayjs(date).toDate());
	const dailyPsalmsYomi = tryOrDefault(() => dailyPsalms(hDate), null);
	if (!dailyPsalmsYomi) return null;
	const evt = new PsalmsEvent(hDate, dailyPsalmsYomi);
	return {
		name: evt.render(),
		hebrewName: evt.render('he'),
		url: evt.url(),
	};
}

/**
 * Get the Daf Weekly for a given date.
 * @param {string} date - The date to calculate the Daf Weekly for in YYYY-MM-DD format.
 * @returns {DailyLearning|null} - The Daf Weekly for the given date.
 */
export function getDafWeekly(date) {
	const hDate = dateToHDate(dayjs(date).toDate());
	const dafWeeklyYomi = tryOrDefault(() => dafWeekly(hDate), null);
	if (!dafWeeklyYomi) return null;
	const evt = new DafWeeklyEvent(hDate, dafWeeklyYomi);
	return {
		name: evt.render(),
		hebrewName: evt.render('he'),
		url: evt.url(),
	};
}
