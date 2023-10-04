import { Zmanim, HebrewCalendar, Location, TimedEvent } from '@hebcal/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getTimezone } from './utils';

dayjs.extend(duration);

export const ZMANIM_NAMES = {
	zmanim: {
		alos16Point1: {
			name: 'Alos (16.1°)',
			hebrewName: 'עלות השחר (16.1°)',
			description: 'Halachic dawn - when the Sun is 16.1° below the horizon in the morning',
		},
		alos72: {
			name: 'Alos (72 minutes)',
			hebrewName: 'עלות השחר (72 דקות)',
			description: 'Halachic dawn - 72 minutes before sunrise',
		},
		misheyakir: {
			name: 'Misheyakir',
			hebrewName: 'משיכיר',
			description: 'Earliest time to put on tallis and tefillin - when the Sun is 11.5° below the horizon in the morning',
		},
		sunrise: {
			name: 'Sunrise',
			hebrewName: 'נץ החמה',
			description: 'Upper edge of the sun appears over the eastern horizon in the morning (0.833° above horizon)',
		},
		sofZmanShmaGRA: {
			name: 'Sof Zman Shma (GRA)',
			hebrewName: 'סוף זמן שמע (גר"א)',
			description: 'Latest time to recite Shema according to the Vilna Gaon - 3 halachic hours after sunrise',
		},
		sofZmanShmaMGA: {
			name: 'Sof Zman Shma (MGA)',
			hebrewName: 'סוף זמן שמע (מג"א)',
			description: 'Latest time to recite Shema according to the Magen Avraham - 3 halachic hours after sunrise',
		},
		misheyakirMachmir: {
			name: 'Misheyakir Machmir',
			hebrewName: 'משיכיר מחמיר',
			description: 'Earliest time to put on tallis and tefillin - when the Sun is 10.2° below the horizon in the morning',
		},
		sofZmanTefillaGRA: {
			name: 'Sof Zman Tefilla (GRA)',
			hebrewName: 'סוף זמן תפילה (גר"א)',
			description: 'Latest time to recite Shacharit according to the Vilna Gaon - 4 halachic hours after sunrise',
		},
		sofZmanTefillaMGA: {
			name: 'Sof Zman Tefilla (MGA)',
			hebrewName: 'סוף זמן תפילה (מג"א)',
			description: 'Latest time to recite Shacharit according to the Magen Avraham - 4 halachic hours after sunrise',
		},
		chatzos: {
			name: 'Chatzos',
			hebrewName: 'חצות',
			description: 'Midday - 6 halachic hours after sunrise',
		},
		minchaGedola: {
			name: 'Mincha Gedola',
			hebrewName: 'מנחה גדולה',
			description: 'Earliest time to recite Mincha - 6.5 halachic hours after sunrise',
		},
		minchaKetana: {
			name: 'Mincha Ketana',
			hebrewName: 'מנחה קטנה',
			description: 'Latest time to recite Mincha - 9.5 halachic hours after sunrise',
		},
		plagHamincha: {
			name: 'Plag Hamincha',
			hebrewName: 'פלג המנחה',
			description: 'Plag hamincha - 10.75 halachic hours after sunrise',
		},
		sunset: {
			name: 'Sunset',
			hebrewName: 'שקיעת החמה',
			description: 'When the upper edge of the sun disappears below the horizon (0.833° below horizon)',
		},
		tzeis3Stars: {
			name: 'Tzeis (3 stars)',
			hebrewName: 'צאת הכוכבים (3 כוכבים)',
			description: 'When 3 medium-sized stars are visible in the sky',
		},
		tzeis3MediumStars: {
			name: 'Tzeis (3 medium stars)',
			hebrewName: 'צאת הכוכבים (3 כוכבים בינוניים)',
			description: 'When 3 medium-sized stars are visible in the sky',
		},
		tzeis72: {
			name: 'Tzeis (72 minutes)',
			hebrewName: 'צאת הכוכבים (72 דקות)',
			description: '72 minutes after sunset',
		},
	},
	events: {
		candleLighting: {
			name: 'Candle Lighting',
			hebrewName: 'הדלקת נרות',
			description: 'Candle lighting time - 18 or 40 minutes before sunset',
		},
		havdalah: {
			name: 'Havdalah',
			hebrewName: 'הבדלה',
			description: 'Havdalah time - 3 small stars visible, sun is 8.5° below horizon',
		},
	},
	durations: {
		shaahZmanisGRA: {
			name: 'Shaah Zmanis (GRA)',
			hebrewName: 'שעה זמנית (גר"א)',
			description: 'Length of a halachic hour according to the Vilna Gaon - 1/12 of the time between sunrise and sunset',
		},
		shaahZmanisMGA: {
			name: 'Shaah Zmanis (MGA)',
			hebrewName: 'שעה זמנית (מג"א)',
			description: 'Length of a halachic hour according to the Magen Avraham - 1/12 of the time between Alos (72 minutes before sunrise) and Tzeis (72 minutes after sunset)',
		},
	},
};

/**
 * @typedef {Object} ZmanimOptions
 * @property {string} [date] - The date to calculate zmanim for in YYYY-MM-DD format (defaults to today)
 * @property {number} latitude - The latitude of the location
 * @property {number} longitude - The longitude of the location
 * @property {string} [timezoneName] - The timezone name of the location (defaults to the timezone of the location)
 */

/**
 * @typedef {{ name: string, hebrewName: string, time: string, description: string }} Zman - Details about a zman or timed event
 */

/**
 * Calculate zmanim for a given date and location
 *
 * @param {ZmanimOptions} options
 * @returns {Promise<{ timezone: string, zmanim: { [key: string]: Zman }, events: { [key: string]: Zman }, durations: { [key: string]: Zman } }>} - The zmanim, timed events, and shaah zmanis durations
 */
export async function calculateZmanim({ date = dayjs().format('YYYY-MM-DD'), latitude, longitude, timezoneName = undefined }) {
	const zmanim = new Zmanim(dayjs(date).toDate(), latitude, longitude);
	const alot72 = zmanim.sunriseOffset(-72, false);
	const tzeit72 = zmanim.sunsetOffset(72, false);
	const timezone = timezoneName || (await getTimezone(latitude, longitude));
	const inIsrael = timezone === 'Asia/Jerusalem';
	const candleLightingMins = inIsrael ? 40 : 18;

	/** Format a date in the given timezone
	 * @param {Date} date - The date to format
	 * @returns {string} - The formatted date
	 */
	const formatDateTimezone = (date) => Zmanim.formatISOWithTimeZone(timezone, date);

	// Add timed events (candle lighting, havdalah, fast begins, fast ends)
	const calendarOptions = {
		start: dayjs(date).startOf('day').toDate(),
		end: dayjs(date).endOf('day').toDate(),
		candlelighting: true,
		location: new Location(latitude, longitude, inIsrael, timezone),
		candleLightingMins: candleLightingMins,
		havdalahDeg: 8.5,
	};
	const calendar = HebrewCalendar.calendar(calendarOptions);
	/** @type {{ [key: string]: Zman }} */
	const timedEvents = {};
	for (const event of calendar) {
		if (event instanceof TimedEvent) {
			// convert event.desc to camelCase
			const key = event.desc.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => (index === 0 ? letter.toLowerCase() : letter.toUpperCase())).replace(/\s+/g, '');
			// remove all non-hebrew letters and spaces from the hebrew name
			const hebrewName = event
				.render('he')
				.replace(/[^א-ת ]/g, '')
				.trim();
			// add extra information to the description
			let description = event.desc;
			if (event.desc === 'Candle lighting') {
				description += ` - ${candleLightingMins} minutes before sunset`;
			} else if (event.desc === 'Havdalah') {
				description += ' - 3 small stars visible, sun is 8.5° below horizon';
			}
			// add the event to the timedEvents object
			timedEvents[key] = {
				name: event.desc,
				hebrewName: hebrewName,
				time: formatDateTimezone(event.eventTime),
				description: description,
			};
		}
	}

	return {
		timezone: timezone || '',
		zmanim: {
			alos16Point1: {
				time: formatDateTimezone(zmanim.alotHaShachar()),
				...ZMANIM_NAMES.zmanim.alos16Point1,
			},
			alos72: {
				time: formatDateTimezone(alot72),
				...ZMANIM_NAMES.zmanim.alos72,
			},
			misheyakir: {
				time: formatDateTimezone(zmanim.misheyakir()),
				...ZMANIM_NAMES.zmanim.misheyakir,
			},
			sunrise: {
				time: formatDateTimezone(zmanim.sunrise()),
				...ZMANIM_NAMES.zmanim.sunrise,
			},
			sofZmanShmaGRA: {
				time: formatDateTimezone(zmanim.sofZmanShma()),
				...ZMANIM_NAMES.zmanim.sofZmanShmaGRA,
			},
			sofZmanShmaMGA: {
				time: formatDateTimezone(zmanim.sofZmanShmaMGA()),
				...ZMANIM_NAMES.zmanim.sofZmanShmaMGA,
			},
			misheyakirMachmir: {
				time: formatDateTimezone(zmanim.misheyakirMachmir()),
				...ZMANIM_NAMES.zmanim.misheyakirMachmir,
			},
			sofZmanTefillaGRA: {
				time: formatDateTimezone(zmanim.sofZmanTfilla()),
				...ZMANIM_NAMES.zmanim.sofZmanTefillaGRA,
			},
			sofZmanTefillaMGA: {
				time: formatDateTimezone(zmanim.sofZmanTfillaMGA()),
				...ZMANIM_NAMES.zmanim.sofZmanTefillaMGA,
			},
			chatzos: {
				time: formatDateTimezone(zmanim.chatzot()),
				...ZMANIM_NAMES.zmanim.chatzos,
			},
			minchaGedola: {
				time: formatDateTimezone(zmanim.minchaGedola()),
				...ZMANIM_NAMES.zmanim.minchaGedola,
			},
			minchaKetana: {
				time: formatDateTimezone(zmanim.minchaKetana()),
				...ZMANIM_NAMES.zmanim.minchaKetana,
			},
			plagHamincha: {
				time: formatDateTimezone(zmanim.plagHaMincha()),
				...ZMANIM_NAMES.zmanim.plagHamincha,
			},
			sunset: {
				time: formatDateTimezone(zmanim.sunset()),
				...ZMANIM_NAMES.zmanim.sunset,
			},
			tzeis3Stars: {
				time: formatDateTimezone(zmanim.tzeit(8.5)),
				...ZMANIM_NAMES.zmanim.tzeis3Stars,
			},
			tzeis3MediumStars: {
				time: formatDateTimezone(zmanim.tzeit(7.083)),
				...ZMANIM_NAMES.zmanim.tzeis3MediumStars,
			},
			tzeis72: {
				time: formatDateTimezone(tzeit72),
				...ZMANIM_NAMES.zmanim.tzeis72,
			},
		},
		events: timedEvents,
		durations: {
			shaahZmanisGRA: {
				time: calculateShaahZmanis(zmanim.sunrise(), zmanim.sunset()),
				...ZMANIM_NAMES.durations.shaahZmanisGRA,
			},
			shaahZmanisMGA: {
				time: calculateShaahZmanis(alot72, tzeit72),
				...ZMANIM_NAMES.durations.shaahZmanisMGA,
			},
		},
	};
}

/**
 * Calculate the length of a shaah zmanis for a given date and location (1/12 of the time between sunrise/alos and sunset/tzeis)
 *
 * @param {Date} startOfDay - The start of the day
 * @param {Date} endOfDay - The end of the day
 * @returns {string} - The length of a shaah zmanis in hours, minutes, and seconds
 */
function calculateShaahZmanis(startOfDay, endOfDay) {
	const daylightHours = dayjs(endOfDay).diff(dayjs(startOfDay), 'millisecond');
	const shaahZmanis = dayjs.duration(daylightHours / 12);
	let hours = '';
	let minutes = '';
	let seconds = '';
	if (shaahZmanis.hours() > 0) {
		hours = shaahZmanis.hours() === 1 ? '1 hour' : `${shaahZmanis.hours()} hours`;
	}
	if (shaahZmanis.minutes() > 0) {
		minutes = shaahZmanis.minutes() === 1 ? '1 minute' : `${shaahZmanis.minutes()} minutes`;
	}
	if (shaahZmanis.seconds() > 0) {
		seconds = shaahZmanis.seconds() === 1 ? '1 second' : `${shaahZmanis.seconds()} seconds`;
	}
	const time = [hours, minutes, seconds].filter((time) => time !== '').join(', ');
	return time;
}
