import { Zmanim } from '@hebcal/core';
import { gregorianToHebrew, hebrewMonthMap, hebrewToGregorian } from './dateconverter';
import { formatDateObject } from './utils';
import { isHebrewLeapYear } from './leapyears';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * Hebrew and transliterated day of week names.
 *
 * @type {{ [key: number]: { firstDay: string, secondDay: string, firstDayHebrew: string, secondDayHebrew: string } }}
 */
const HEBREW_DAYS_OF_WEEK = {
	0: {
		firstDay: "B'Yom Rishon",
		secondDay: "Ul'macharaso B'Yom Rishon",
		firstDayHebrew: 'ביום ראשון',
		secondDayHebrew: 'ולמחרתו ביום ראשון',
	},
	1: {
		firstDay: "B'Yom Sheni",
		secondDay: "Uv'Yom Sheni",
		firstDayHebrew: 'ביום שני',
		secondDayHebrew: 'וביום שני',
	},
	2: {
		firstDay: "B'Yom Shlishi",
		secondDay: "Uv'Yom Shlishi",
		firstDayHebrew: 'ביום שלישי',
		secondDayHebrew: 'וביום שלישי',
	},
	3: {
		firstDay: "B'Yom Revi'i",
		secondDay: "Uv'Yom Revi'i",
		firstDayHebrew: 'ביום רביעי',
		secondDayHebrew: 'וביום רביעי',
	},
	4: {
		firstDay: "B'Yom Chamishi",
		secondDay: "Uv'Yom Chamishi",
		firstDayHebrew: 'ביום חמישי',
		secondDayHebrew: 'וביום חמישי',
	},
	5: {
		firstDay: "B'Yom Shishi",
		secondDay: "Uv'Yom Shishi",
		firstDayHebrew: 'ביום שישי',
		secondDayHebrew: 'וביום שישי',
	},
	6: {
		firstDay: "B'Yom Shabbos Kodesh",
		secondDay: "Uv'Yom Shabbos Kodesh",
		firstDayHebrew: 'ביום שבת קודש',
		secondDayHebrew: 'וביום שבת קודש',
	},
};

/**
 * Calculate the molad for the given Hebrew year and month.
 *
 * @param {number} year - The Hebrew year
 * @param {number} month - The Hebrew month (1=Nisan, 7=Tishrei, 13=Adar II)
 */
export function calculateMolad(year, month) {
	const moladInterval = 7654330000 / 3; // milliseconds // = 765433/25920 ~ 29.53 days
	const timestampMoladNissan5774 = 1396238070000; // Monday, March 31, 2014, 3:54:30 am UTC (note: UTC is used even though it is really Jerusalem time)
	let timestampNewMolad = timestampMoladNissan5774;
	// Add or subtract months for full years between 5774 and the given year
	if (year > 5774) {
		for (let i = 5774; i < year; i++) {
			if (isHebrewLeapYear({ year: i + 1 }).isLeapYear) {
				timestampNewMolad += 13 * moladInterval;
			} else {
				timestampNewMolad += 12 * moladInterval;
			}
		}
	} else if (year < 5774) {
		// remove 12 or 13 months for each year before 5774
		for (let i = 5774 - 1; year <= i; i--) {
			if (isHebrewLeapYear({ year: i + 1 }).isLeapYear) {
				timestampNewMolad -= 13 * moladInterval;
			} else {
				timestampNewMolad -= 12 * moladInterval;
			}
		}
	}
	// Add months within the given year
	if (month >= 1 && month <= 6) {
		// Nissan - Elul
		timestampNewMolad += (month - 1) * moladInterval;
	} else if (month >= 7 && month <= 13) {
		// Tishrei - Adar II
		const monthsInYear = isHebrewLeapYear({ year }).isLeapYear ? 13 : 12;
		timestampNewMolad += (month - monthsInYear - 1) * moladInterval;
	} else {
		throw new Error('Invalid Hebrew month.');
	}
	// Create the molad date object
	let newMolad = dayjs.utc(timestampNewMolad);
	//  round 666ms to 667ms and round 999ms to the next second
	newMolad = [666, 999].includes(newMolad.millisecond()) ? newMolad.add(1, 'millisecond') : newMolad;
	let chalakim = Math.round((newMolad.second() / 60) * 18);
	// Determine if the molad was after sunset in Jerusalem
	const zmanim = new Zmanim(newMolad.toDate(), 31.77759, 35.23564);
	// adjust for timezone - make all times in UTC even though they are really Jerusalem time
	const sunset = dayjs.utc(Zmanim.formatISOWithTimeZone('Asia/Jerusalem', zmanim.sunset()).replace(/\+.+$/, '')); // remove timezone offset to compare as UTC
	// output
	const chalakimText = `${chalakim} ${chalakim == 1 ? 'chelek' : 'chalakim'}`;

	// Time format (eg. "Thursday, Oct. 3, 2024, 3:21 pm and 13 chalakim")
	const timeFormat = {
		'12Hr': newMolad.format('dddd, MMM. D, YYYY, h:mm a') + ' and ' + chalakimText,
		'24Hr': newMolad.format('dddd, MMM. D, YYYY, HH:mm') + ' and ' + chalakimText,
	};

	// Hebrew date format (eg. "1st of Tishrei, 5783, 3:21 pm and 13 chalakim")
	const hebrewDate = gregorianToHebrew({ year: newMolad.year(), month: newMolad.month() + 1, day: newMolad.date() });
	const hebrewDateFormat = {
		'12Hr': hebrewDate.displayEn + ', ' + newMolad.format('h:mm a') + ' and ' + chalakimText,
		'24Hr': hebrewDate.displayEn + ', ' + newMolad.format('HH:mm') + ' and ' + chalakimText,
	};

	// Day of week format (eg. "Thursday afternoon, 21 minutes and 13 chalakim after 3:00 pm")
	let dayOfWeekStr = dayjs(newMolad).format('dddd');
	if (newMolad.hour() < 12) {
		dayOfWeekStr += ' morning, ';
	} else if (newMolad < sunset) {
		dayOfWeekStr += ' afternoon, ';
	} else {
		dayOfWeekStr += ' evening, ';
	}
	dayOfWeekStr += newMolad.minute() + ' minutes and ' + chalakimText + ' after ';
	const dayOfWeekFormat = {
		'12Hr': dayOfWeekStr + newMolad.format('h:00 a'),
		'24Hr': dayOfWeekStr + newMolad.format('HH:00'),
	};

	/** @type {{ [key: string]: any } }} */
	const result = {
		timeString: newMolad.toISOString().replace('T', ' ').replace('Z', ''),
		timeFormat,
		dayOfWeekFormat,
		hebrewDateFormat,
		monthName: `${hebrewMonthMap[month]} ${year}`,
	};

	// Shabbos Mevorchim and Rosh Chodesh
	const firstOfMonth = hebrewToGregorian({ year: year, month: month, day: 1 }).date;
	const dayBeforeFirstOfMonth = new Date(firstOfMonth);
	dayBeforeFirstOfMonth.setDate(dayBeforeFirstOfMonth.getDate() - 1);
	const hebrewDateBeforeFirstOfMonth = gregorianToHebrew({ year: dayBeforeFirstOfMonth.getFullYear(), month: dayBeforeFirstOfMonth.getMonth() + 1, day: dayBeforeFirstOfMonth.getDate() });
	const twoDayRoshChodesh = hebrewDateBeforeFirstOfMonth.day === 30;
	const firstDayRoshChodesh = twoDayRoshChodesh ? dayBeforeFirstOfMonth : firstOfMonth;
	const lastSat = getLastSaturday(firstDayRoshChodesh);
	let roshChodesh = formatDateObject(firstDayRoshChodesh);
	let roshChodeshDayOfWeekDisplayEn = HEBREW_DAYS_OF_WEEK[firstDayRoshChodesh.getDay()].firstDay;
	let roshChodeshDayOfWeekDisplayHe = HEBREW_DAYS_OF_WEEK[firstDayRoshChodesh.getDay()].firstDayHebrew;
	if (twoDayRoshChodesh) {
		const secondDayRoshChodesh = firstOfMonth;
		roshChodesh += ' and ' + formatDateObject(secondDayRoshChodesh);
		roshChodeshDayOfWeekDisplayEn += ' ' + HEBREW_DAYS_OF_WEEK[secondDayRoshChodesh.getDay()].secondDay;
		roshChodeshDayOfWeekDisplayHe += ' ' + HEBREW_DAYS_OF_WEEK[secondDayRoshChodesh.getDay()].secondDayHebrew;
	}
	const shabbosMevarchim = formatDateObject(lastSat);
	result.shabbosMevarchim = {
		roshChodesh,
		roshChodeshDayOfWeekDisplayEn,
		roshChodeshDayOfWeekDisplayHe,
		shabbosMevarchim,
		roshHashanah: month === 7,
	};

	return result;
}

/**
 * Get the last Saturday before the given date.
 * @param {Date} date - The date to get the last Saturday before.
 * @returns {Date} The last Saturday before the given date.
 */
function getLastSaturday(date) {
	const resultDate = new Date(date);
	resultDate.setDate(date.getDate() - date.getDay() - 1);
	return resultDate;
}
