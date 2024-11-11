import { flags, HebrewCalendar, HolidayEvent, Location, ParshaEvent, TimedEvent, Zmanim } from '@hebcal/core';
import dayjs from 'dayjs';

/**
 * @typedef {{ name: string, hebrewName: string, description: string, time?: string, icon?: string }} Event - Details about a timed event
 */

/**
 * @typedef {Object} EventOptions
 * @property {string} [date] - The date to calculate events for in YYYY-MM-DD format (defaults to today)
 * @property {number} latitude - The latitude of the location
 * @property {number} longitude - The longitude of the location
 * @property {string} timezone - The timezone name of the location (defaults to the timezone of the location)
 * @property {string} [location] - The location for display purposes (latitude and longitude are used if not provided)
 * @property {number} [candleLightingMins] - The number of minutes before sunset to light candles (defaults to 18, or 40 in the Jerusalem timezone)
 */

/**
 * Calculate events for a given date and location
 *
 * @param {EventOptions} options
 * @returns {Promise<{ timezone: string, location?: string, events: { [key: string]: Event }, timedEvents: { [key: string]: Event }}>} - The event details
 */
export async function calculateEvents({ date = dayjs().format('YYYY-MM-DD'), latitude, longitude, timezone, location, candleLightingMins }) {
	const ISRAEL_TIMEZONES = ['Asia/Jerusalem', 'Asia/Tel_Aviv', 'Asia/Hebron', 'Israel'];
	const inIsrael = ISRAEL_TIMEZONES.includes(timezone);
	const inJerusalem = timezone === 'Asia/Jerusalem';
	if (!candleLightingMins) {
		candleLightingMins = inJerusalem ? 40 : 18;
	}

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
		sedrot: true,
		noMinorFast: true,
		noModern: true,
		noSpecialShabbat: true,
		noRoshChodesh: true,
		il: inIsrael,
	};
	const calendar = HebrewCalendar.calendar(calendarOptions);
	/** @type {{ [key: string]: Event }} */
	const timedEvents = {};
	/** @type {{ [key: string]: Event }} */
	const events = {};
	for (const event of calendar) {
		// convert event.desc to camelCase
		let key = event.desc.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => (index === 0 ? letter.toLowerCase() : letter.toUpperCase())).replace(/\s+/g, '');
		// remove all non-hebrew letters and spaces from the hebrew name
		let hebrewName = event
			.render('he')
			.replace(/־/g, '-')
			.replace(/״/g, '"')
			.replace(/[^א-ת\-" ]/g, '')
			.trim();
		if (event instanceof TimedEvent) {
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
		} else {
			if (event instanceof ParshaEvent) {
				key = 'parsha';
				hebrewName = hebrewName.replace('פרשת', '').trim();
			}
			if (event instanceof HolidayEvent) {
				const isShabbat = event.date.getDay() === 6;
				const isChag = event.getFlags() & flags.CHAG;
				if (!isShabbat && !isChag) {
					continue;
				}
				if (hebrewName.includes('חוה"מ')) {
					hebrewName = 'חוה"מ ' + hebrewName.replace('חוה"מ', '');
				}
				key = 'holiday';
				hebrewName = hebrewName
					.replace('סוכות ז', '')
					.replace(/ ([א-ח])(\s|$)/, '$2')
					.trim();
			}
			// add the event to the events object
			events[key] = {
				name: event.desc,
				hebrewName: hebrewName,
				description: event.desc,
			};
		}
	}

	return {
		timezone,
		...(location && { location, latitude, longitude }),
		events,
		timedEvents,
	};
}
