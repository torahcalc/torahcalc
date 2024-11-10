import * as env from '$env/static/private';
import logo from '$lib/images/torahcalc.svg';
import { createHtmlErrorResponse, createHtmlResponse } from '$lib/js/api/response.js';
import { escapeHtml, geocodeAddress, getTimezone } from '$lib/js/utils';
import { ZMANIM_NAMES } from '$lib/js/zmanim';
import { calculateEvents } from '$lib/js/events';
import { HDate } from '@hebcal/core';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(timezone);
dayjs.extend(utc);

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url }) {
	const year = Number(url.searchParams.get('year') || new HDate().getFullYear());
	let latitude = Number(url.searchParams.get('latitude') || NaN);
	let longitude = Number(url.searchParams.get('longitude') || NaN);
	let timezone = url.searchParams.get('timezone') || undefined;
	let location = url.searchParams.get('location') || '';
	const candleLightingMins = Number(url.searchParams.get('candleLightingMinutes') || 0);

	// TODO: add documentation for these parameters and add to builder
	const headingColor = url.searchParams.get('headingColor') || '#000000';
	const monthHeadingColor = url.searchParams.get('monthHeadingColor') || '#000000';
	const rowColor1 = url.searchParams.get('rowColor1') || '#EDF7FF';
	const rowColor2 = url.searchParams.get('rowColor2') || '#C3E3FF';
	const textColor = url.searchParams.get('textColor') || '#000000';
	const backgroundColor = url.searchParams.get('backgroundColor') || '#FFFFFF';
	const logoUrl = url.searchParams.get('logoUrl');
	const secondaryImageUrl = url.searchParams.get('secondaryImageUrl');
	const fontSize = url.searchParams.get('fontSize') || '13px';
	const mainFont = url.searchParams.get('mainFont') || 'Open Sans';
	const bodyFont = url.searchParams.get('bodyFont') || 'Open Sans';
	const footerText = escapeHtml(url.searchParams.get('footerText') || '');

	try {
		// sanitize inputs
		const COLOR_REGEX = /^#[0-9a-f]{3,4}|#[0-9a-f]{6}|#[0-9a-f]{8}$/i;
		const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
		const FONT_SIZE_REGEX = /^\d+(px|em|rem|%)$/;
		const FONT_REGEX = /^[\w\s-]+$/;
		if (!COLOR_REGEX.test(headingColor)) throw new Error('Invalid heading color parameter');
		if (!COLOR_REGEX.test(monthHeadingColor)) throw new Error('Invalid month heading color parameter');
		if (!COLOR_REGEX.test(rowColor1)) throw new Error('Invalid row color 1 parameter');
		if (!COLOR_REGEX.test(rowColor2)) throw new Error('Invalid row color 2 parameter');
		if (!COLOR_REGEX.test(textColor)) throw new Error('Invalid text color parameter');
		if (!COLOR_REGEX.test(backgroundColor)) throw new Error('Invalid background color parameter');
		if (logoUrl && !URL_REGEX.test(logoUrl)) throw new Error('Invalid logo URL parameter');
		if (secondaryImageUrl && !URL_REGEX.test(secondaryImageUrl)) throw new Error('Invalid secondary image URL parameter');
		if (!FONT_SIZE_REGEX.test(fontSize)) throw new Error('Invalid font size parameter');
		if (!FONT_REGEX.test(mainFont)) throw new Error('Invalid main font parameter');
		if (!FONT_REGEX.test(bodyFont)) throw new Error('Invalid body font parameter');

		let formattedAddress = location;
		if ((isNaN(latitude) || isNaN(longitude)) && location !== '') {
			const geocoded = await geocodeAddress(location, env.GOOGLE_MAPS_API_KEY);
			latitude = Math.round(geocoded.lat * 100000) / 100000;
			longitude = Math.round(geocoded.lng * 100000) / 100000;
			formattedAddress = geocoded.formattedAddress;
		} else if (location === '') {
			location = `${latitude}, ${longitude}`;
		}
		if (isNaN(latitude)) throw new Error("Missing or invalid 'latitude' parameter");
		if (isNaN(longitude)) throw new Error("Missing or invalid 'longitude' parameter");
		if (!timezone) {
			timezone = await getTimezone(latitude, longitude, env.GOOGLE_MAPS_API_KEY);
		}
		if (isNaN(year)) throw new Error("Missing or invalid 'year' parameter");
		// start the day before Rosh Hashanah and before next year's Rosh Hashanah
		const startDate = new HDate(1, 7, year).greg();
		startDate.setDate(startDate.getDate() - 1);
		const endDate = new HDate(1, 7, year + 1).greg();
		endDate.setDate(endDate.getDate() - 1);
		let dateObj = startDate;
		let date = dayjs(dateObj).tz(timezone).format('YYYY-MM-DD');
		let html = `<!DOCTYPE html>
					<html lang="en">
						<head>
							<meta charset="UTF-8">
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>Zmanim Chart ${location} ${year}</title>
							<style>
								@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(bodyFont)}:ital,wght@0,400&family=${encodeURIComponent(mainFont)}:ital,wght@0,700&display=swap');

								:root {
									--heading-color: ${headingColor};
									--month-heading-color: ${monthHeadingColor};
									--row-color-1: ${rowColor1};
									--row-color-2: ${rowColor2};
									--text-color: ${textColor};
									--background-color: ${backgroundColor};
									--font-size: ${fontSize};
								}
								
								html {
									background: var(--background-color);
									color: var(--text-color);
								}

								body {
									font-family: "${mainFont}", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
									font-size: var(--font-size);
									margin: 1em auto 0 auto;
									text-align: center;
									width: 850px;
									position: relative;
								}

								.body-font {
									font-family: "${bodyFont}", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
								}

								.heading {
									color: var(--heading-color);
									font-size: 1.8em;
									margin: 0.6em auto;
								}

								.columns {
									column-count: 4;
									column-gap: 0.5em;
									margin: auto;
								}

								.month {
									break-inside: avoid-column;
									margin-bottom: 1em;
								}

								.month-heading {
									color: var(--month-heading-color);
								}

								h2 {
									margin: 0;
								}

								.row {
									display: flex;
									justify-content: space-between;
									align-items: center;
								}

								.zman, .descriptions {
								    display: flex;
									justify-content: center;
									align-items: center;
									gap: 0.3em;
								}

								.event {
									font-size: 0.9em;
								}

								.month > div {
									padding: 0.3em;
								}

								.month > div:first-of-type {
									margin-top: 0.5em;
								}

								.month > div:nth-of-type(2n-1) {
									background: var(--row-color-1);
								}

								.month > div:nth-of-type(2n) {
									background: var(--row-color-2);
								}

								.credits {
									margin: 0.5em auto 0.25em auto;
									text-align: center;
									font-size: 0.96em;
								}

								.text-muted {
									opacity: 0.6;
								}

								.link {
									text-decoration: none;
									color: #2096F3;
									display: flex;
									justify-content: center;
									gap: 0.5em;
									align-items: center;
									font-weight: bold;
									font-size: 1.75em;
								}

								.logo {
									height: 1.5em;
									vertical-align: middle;
								}

								.secondary-image {
									position: absolute;
									top: 0;
									right: 0;
									max-height: 126px;
									z-index: -1;
								}
							</style>
						</head>
						<body>
							${logoUrl ? `<div style="display: flex;justify-content: center;"><img src="${logoUrl}" style="height: 85px;"></div>` : ''}
							${secondaryImageUrl ? `<img src="${secondaryImageUrl}" class="secondary-image" />` : ''}
							<h1 class="heading">Zmanim &middot; ${location} &middot; ${year}</h1>`;
		let month = '';
		while (dateObj < endDate) {
			const zmanimResponse = await calculateEvents({ date, latitude, longitude, timezone, location, candleLightingMins });
			const timedEvents = zmanimResponse.timedEvents;
			const events = zmanimResponse.events;
			// Show candle lighting time for Shabbat and Yom Tov
			if (timedEvents.candleLighting || timedEvents.havdalah) {
				// check for parsha or holiday events
				if (dayjs(dateObj).tz(timezone).format('MMMM YYYY') !== month) {
					if (month !== '') {
						// end the previous month
						html += `</div>`;
					} else {
						// write candle lighting and havdalah descriptions and start column layout
						html += `<span class="descriptions body-font">${ZMANIM_NAMES.events.candleLighting.icon} <span>${timedEvents.candleLighting.description}</span> <span>&nbsp;</span> ${ZMANIM_NAMES.events.havdalah.icon} <span>Havdalah - 3 small stars visible, sun is 8.5° below horizon</span></span>
							<br/>
							<div class='columns'>`;
					}
					month = dayjs(dateObj).tz(timezone).format('MMMM YYYY');
					html += `<div class='month'><h2 class="month-heading">${month}</h2>`;
				}
				html += `<div class='row body-font'>`;
				const formattedDate = dayjs(dateObj).tz(timezone).format('ddd D');
				html += `<span class='date'>${formattedDate}</span>`;
				const event = events.parsha?.hebrewName || events.holiday?.hebrewName || '';
				html += `<span class='event'>${event}</span>`;
				if (timedEvents.candleLighting) {
					const candleLightingTime = dayjs(timedEvents.candleLighting.time).tz(timezone).format('h:mma');
					html += `<span class='zman'>${ZMANIM_NAMES.events.candleLighting.icon} ${candleLightingTime}</span>`;
				}
				if (timedEvents.havdalah) {
					const havdalahTime = dayjs(timedEvents.havdalah.time).tz(timezone).format('h:mma');
					html += `<span class='zman'>${ZMANIM_NAMES.events.havdalah.icon} ${havdalahTime}</span>`;
				}
				html += `</div>`;
			}
			dateObj.setDate(dateObj.getDate() + 1);
			date = dayjs(dateObj).tz(timezone).format('YYYY-MM-DD');
		}
		html += `</div></div>
		<div class='credits'>
			<a class="link" href="https://torahcalc.com">
				<img src="${logo}" alt="TorahCalc" class="logo" />
				<span>TorahCalc.com</span>
			</a>
			<br/>
			${
				footerText
					? `<span class="footer text-muted body-font">${footerText}</span>`
					: `<span class="footer text-muted body-font">${latitude}, ${longitude} ${formattedAddress ? `(${formattedAddress})` : ''} &middot; ${timezone} Time &middot; Do not rely on zmanim from any source to the last minute</span>`
			}
				
		</div>
		</body></html>`;
		return createHtmlResponse(html);
	} catch (error) {
		let message = `${error}`;
		// if the error is Could not geocode address: ZERO_RESULTS, tell the user to try a different address
		if (message.includes('ZERO_RESULTS')) {
			message = 'Could not geocode address. Try a more specific location.';
		}
		// add link to zmanim charts creation page
		message += `<br/><br/><a href="/tools/zmanim-charts">Return to Zmanim chart builder</a>`;
		return createHtmlErrorResponse(message);
	}
}
