import { Zmanim, HebrewCalendar, Location, TimedEvent } from '@hebcal/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/** @type {Object<string, string>} */
const CACHED_TIMEZONE_NAMES = {
	'42.74521,-73.810345': 'America/New_York', // Zip 12201 in Albany, NY for testing
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
 * @returns {Promise<{ zmanim: { [key: string]: Zman }, events: { [key: string]: Zman }, durations: { [key: string]: Zman } }>} - The zmanim, timed events, and shaah zmanis durations
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
		zmanim: {
			alos16Point1: {
				name: 'Alos (16.1°)',
				hebrewName: 'עלות השחר (16.1°)',
				time: formatDateTimezone(zmanim.alotHaShachar()),
				description: 'Halachic dawn - when the Sun is 16.1° below the horizon in the morning',
			},
			alos72: {
				name: 'Alos (72 minutes)',
				hebrewName: 'עלות השחר (72 דקות)',
				time: formatDateTimezone(alot72),
				description: 'Halachic dawn - 72 minutes before sunrise',
			},
			misheyakir: {
				name: 'Misheyakir',
				hebrewName: 'משיכיר',
				time: formatDateTimezone(zmanim.misheyakir()),
				description: 'Earliest time to put on tallis and tefillin - when the Sun is 11.5° below the horizon in the morning',
			},
			sunrise: {
				name: 'Sunrise',
				hebrewName: 'נץ החמה',
				time: formatDateTimezone(zmanim.sunrise()),
				description: 'Upper edge of the sun appears over the eastern horizon in the morning (0.833° above horizon)',
			},
			sofZmanShmaGRA: {
				name: 'Sof Zman Shma (GRA)',
				hebrewName: 'סוף זמן שמע (גר"א)',
				time: formatDateTimezone(zmanim.sofZmanShma()),
				description: 'Latest time to recite Shema according to the Vilna Gaon - 3 halachic hours after sunrise',
			},
			sofZmanShmaMGA: {
				name: 'Sof Zman Shma (MGA)',
				hebrewName: 'סוף זמן שמע (מג"א)',
				time: formatDateTimezone(zmanim.sofZmanShmaMGA()),
				description: 'Latest time to recite Shema according to the Magen Avraham - 3 halachic hours after sunrise',
			},
			misheyakirMachmir: {
				name: 'Misheyakir Machmir',
				hebrewName: 'משיכיר מחמיר',
				time: formatDateTimezone(zmanim.misheyakirMachmir()),
				description: 'Earliest time to put on tallis and tefillin - when the Sun is 10.2° below the horizon in the morning',
			},
			sofZmanTefillaGRA: {
				name: 'Sof Zman Tefilla (GRA)',
				hebrewName: 'סוף זמן תפילה (גר"א)',
				time: formatDateTimezone(zmanim.sofZmanTfilla()),
				description: 'Latest time to recite Shacharit according to the Vilna Gaon - 4 halachic hours after sunrise',
			},
			sofZmanTefillaMGA: {
				name: 'Sof Zman Tefilla (MGA)',
				hebrewName: 'סוף זמן תפילה (מג"א)',
				time: formatDateTimezone(zmanim.sofZmanTfillaMGA()),
				description: 'Latest time to recite Shacharit according to the Magen Avraham - 4 halachic hours after sunrise',
			},
			chatzos: {
				name: 'Chatzos',
				hebrewName: 'חצות',
				time: formatDateTimezone(zmanim.chatzot()),
				description: 'Midday - 6 halachic hours after sunrise',
			},
			minchaGedola: {
				name: 'Mincha Gedola',
				hebrewName: 'מנחה גדולה',
				time: formatDateTimezone(zmanim.minchaGedola()),
				description: 'Earliest time to recite Mincha - 6.5 halachic hours after sunrise',
			},
			minchaKetana: {
				name: 'Mincha Ketana',
				hebrewName: 'מנחה קטנה',
				time: formatDateTimezone(zmanim.minchaKetana()),
				description: 'Latest time to recite Mincha - 9.5 halachic hours after sunrise',
			},
			plagHamincha: {
				name: 'Plag Hamincha',
				hebrewName: 'פלג המנחה',
				time: formatDateTimezone(zmanim.plagHaMincha()),
				description: 'Plag hamincha - 10.75 halachic hours after sunrise',
			},
			sunset: {
				name: 'Sunset',
				hebrewName: 'שקיעת החמה',
				time: formatDateTimezone(zmanim.sunset()),
				description: 'When the upper edge of the sun disappears below the horizon (0.833° below horizon)',
			},
			tzeis3Stars: {
				name: 'Tzeis (3 stars)',
				hebrewName: 'צאת הכוכבים (3 כוכבים)',
				time: formatDateTimezone(zmanim.tzeit(8.5)),
				description: 'When 3 medium-sized stars are visible in the sky',
			},
			tzeis3MediumStars: {
				name: 'Tzeis (3 medium stars)',
				hebrewName: 'צאת הכוכבים (3 כוכבים בינוניים)',
				time: formatDateTimezone(zmanim.tzeit(7.083)),
				description: 'When 3 medium-sized stars are visible in the sky',
			},
			tzeis72: {
				name: 'Tzeis (72 minutes)',
				hebrewName: 'צאת הכוכבים (72 דקות)',
				time: formatDateTimezone(tzeit72),
				description: '72 minutes after sunset',
			},
		},
		events: timedEvents,
		durations: {
			shaahZmanisGRA: {
				name: 'Shaah Zmanis (GRA)',
				hebrewName: 'שעה זמנית (גר"א)',
				time: calculateShaahZmanis(zmanim.sunrise(), zmanim.sunset()),
				description: 'Length of a halachic hour according to the Vilna Gaon - 1/12 of the time between sunrise and sunset',
			},
			shaahZmanisMGA: {
				name: 'Shaah Zmanis (MGA)',
				hebrewName: 'שעה זמנית (מג"א)',
				time: calculateShaahZmanis(alot72, tzeit72),
				description: 'Length of a halachic hour according to the Magen Avraham - 1/12 of the time between Alos (72 minutes before sunrise) and Tzeis (72 minutes after sunset)',
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

/**
 * Return the timezone name for a given latitude and longitude
 *
 * @param {number} latitude - The latitude of the location
 * @param {number} longitude - The longitude of the location
 * @returns {Promise<string>} - The timezone name
 */
async function getTimezone(latitude, longitude) {
	const location = `${latitude},${longitude}`;
	if (location in CACHED_TIMEZONE_NAMES) {
		return CACHED_TIMEZONE_NAMES[location];
	}
	const response = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=1458000000&key=${process.env.GOOGLE_MAPS_API_KEY}`);
	const json = await response.json();
	CACHED_TIMEZONE_NAMES[location] = json.timeZoneId;
	// @ts-ignore - timezoneId will be a string
	return json.timeZoneId;
}
