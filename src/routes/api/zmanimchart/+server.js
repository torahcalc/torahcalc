import * as env from '$env/static/private';
import logo from '$lib/images/torahcalc.svg';
import { createHtmlErrorResponse, createHtmlResponse } from '$lib/js/api/response.js';
import { geocodeAddress, getTimezone } from '$lib/js/utils';
import { ZMANIM_NAMES, calculateZmanim } from '$lib/js/zmanim';
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
	const candleLightingMins = url.searchParams.get('candleLightingMinutes') ? Number(url.searchParams.get('candleLightingMinutes')) : undefined;

	try {
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
								 body {
									font-family: "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
									font-size: 14px;
									margin: 0 auto;
									text-align: center;
									width: 850px;
								}

								.columns {
									column-count: 4;
									column-gap: 1em;
									margin: auto;
								}

								.month {
									break-inside: avoid-column;
									margin-bottom: 1em;
								}

								h2 {
									margin: 0;
								}

								.row {
									display: flex;
									justify-content: space-between;
								}

								.month > div {
									padding: 0.2em;
								}

								.month > div:first-of-type {
									margin-top: 0.5em;
								}

								.month > div:nth-of-type(2n) {
									background: #c4e3ff;
								}

								.month > div:nth-of-type(2n-1) {
									background: #edf7ff;
								}

								.credits {
									margin-top: 2em;
									text-align: center;
									font-size: 14px;
								}

								.text-muted {
									color: #666;
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
							</style>
						</head>
						<body>
							<h1>Zmanim Chart for ${location}, ${year}</h1>`;
		let month = '';
		while (dateObj < endDate) {
			const zmanimResponse = await calculateZmanim({ date, latitude, longitude, timezone, location, candleLightingMins });
			const events = zmanimResponse.events;
			// Show candle lighting time for Shabbat and Yom Tov
			if (events.candleLighting || events.havdalah) {
				if (dayjs(dateObj).tz(timezone).format('MMMM YYYY') !== month) {
					if (month !== '') {
						// end the previous month
						html += `</div>`;
					} else {
						// write candle lighting and havdalah descriptions and start column layout
						html += `<span>${ZMANIM_NAMES.events.candleLighting.icon} ${events.candleLighting.description} &nbsp;&nbsp; ${ZMANIM_NAMES.events.havdalah.icon} Havdalah - 3 small stars visible, sun is 8.5° below horizon</span><br/><br/>
							<div class='columns'>`;
					}
					month = dayjs(dateObj).tz(timezone).format('MMMM YYYY');
					html += `<div class='month'><h2>${month}</h2>`;
				}
				html += `<div class='row'>`;
				const formattedDate = dayjs(dateObj).tz(timezone).format('ddd, MMM D');
				html += `<span>${formattedDate}</span>`;
				if (events.candleLighting) {
					const candleLightingTime = dayjs(events.candleLighting.time).tz(timezone).format('h:mm a');
					html += `<span>${ZMANIM_NAMES.events.candleLighting.icon} ${candleLightingTime}</span>`;
				}
				if (events.havdalah) {
					const havdalahTime = dayjs(events.havdalah.time).tz(timezone).format('h:mm a');
					html += `<span>${ZMANIM_NAMES.events.havdalah.icon} ${havdalahTime}</span>`;
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
			<br/><br/>
			<span class="text-muted">Zmanim for ${latitude}, ${longitude} ${formattedAddress ? `(${formattedAddress})` : ''} in ${timezone}. Do not rely on zmanim from any source to the last minute.</span>
		</div>
		</body></html>`;
		return createHtmlResponse(html);
	} catch (error) {
		return createHtmlErrorResponse(`${error}`);
	}
}
