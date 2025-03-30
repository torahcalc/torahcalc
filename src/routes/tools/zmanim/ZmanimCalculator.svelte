<script>
	import { PUBLIC_ADAPTER, PUBLIC_BASE_URL } from '$env/static/public';
	import { ZMANIM_NAMES } from '$lib/js/zmanim';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';
	import { dataToHtmlTable } from '$lib/js/utils';
	dayjs.extend(timezone);
	dayjs.extend(utc);

	onMount(updateResults);

	/** @type {string} The location to calculate zmanim for */
	let location = 'Denver';

	/** @type {Date} The date to calculate zmanim for */
	let date = new Date();
	let formattedDate = dayjs(date).format('YYYY-MM-DD');

	/** @type {{mapUrl: string, tablesHTML: string, timezone: string, location: string, date: Date}} The zmanim result */
	let zmanimResult = {
		mapUrl: '',
		tablesHTML: '',
		timezone: '',
		location: '',
		date: new Date(),
	};

	/**
	 * Search for zmanim for a given date and location
	 * @param {{ location: string, date: Date }} options - the options for the calculation
	 * @returns {Promise<import('$lib/js/zmanim').ZmanimResult>} The zmanim result
	 * @throws {Error} If the location is invalid
	 */
	async function getResults({ location, date }) {
		/** @type {{ date: string, latitude?: string, longitude?: string, location?: string }} */
		const params = { date: dayjs(date).format('YYYY-MM-DD') };
		const latLongMatch = location.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
		if (latLongMatch) {
			params.latitude = latLongMatch[1];
			params.longitude = latLongMatch[3];
		} else {
			params.location = location;
		}

		// get the zmanim
		let url = `/api/zmanim?${new URLSearchParams(params).toString()}`;
		if (PUBLIC_ADAPTER === 'static') {
			url = PUBLIC_BASE_URL + url;
		}
		const zmanimResponse = await fetch(url)
			.then((response) => response.json())
			.catch((error) => {
				throw new Error(`Failed to fetch zmanim. Make sure you are connected to the internet.`, error);
			});

		if (zmanimResponse.success === false || !zmanimResponse.data) {
			throw new Error(`Could not get zmanim for the provided location: "${location}".`);
		}

		const allResults = zmanimResponse.data;

		if (allResults.location && allResults.latitude && allResults.longitude) {
			allResults.location = `${allResults.location} (${allResults.latitude.toFixed(6)}, ${allResults.longitude.toFixed(6)})`;
		}

		allResults.latitude = allResults.latitude ?? params.latitude ?? '';
		allResults.longitude = allResults.longitude ?? params.longitude ?? '';

		return allResults;
	}

	/**
	 * Read the options from the UI and update the results
	 */
	async function updateResults() {
		const allResults = await getResults({ location, date });

		let mapUrl = `/input/maps?location=${allResults.latitude},${allResults.longitude}`;
		if (PUBLIC_ADAPTER === 'static') {
			mapUrl = PUBLIC_BASE_URL + mapUrl;
		}

		/**
		 * Format a zman time
		 * @param {string} time - The time to format
		 * @param {string} timezone - The timezone to format the time in
		 * @returns {string} The formatted time
		 */
		const formatZmanTime = (time, timezone) => {
			return dayjs(time).tz(timezone).format('h:mm A').replace(' ', '&nbsp;');
		};

		/**
		 * Format a zman name and description in a table row
		 * @param {import('$lib/js/zmanim').Zman} zman - The zman to format
		 * @returns {string} The formatted time
		 */
		const formatZmanCell = (zman) => {
			let row = `<span class="fw-bold d-inline-flex align-items-center gap-2" style="font-size: 1.25em">${zman.icon || ''} ${zman.name}</span>`;
			if (zman.description && zman.name !== zman.description) {
				row += `<div class="small text-muted">${zman.description}</div>`;
			}
			return row;
		};

		// show all zmanim in tables
		const zmanimTables = [];
		const eventsData = Object.entries(allResults.events).map(([zmanId, result]) => {
			// @ts-ignore - assume key exists
			const zman = allResults.events[zmanId];
			return { Event: formatZmanCell(zman), Time: formatZmanTime(result.time, allResults.timezone) };
		});
		if (eventsData.length > 0) {
			let eventsSection = "<div class='border rounded px-3 my-3'><ul class='list-unstyled'>";
			eventsSection += eventsData.map((event) => `<li class="my-3 d-flex flex-column gap-1">${event.Event}${event.Time}</li>`).join('');
			eventsSection += '</ul></div>';
			zmanimTables.push(eventsSection);
		}
		const zmanimData = Object.entries(allResults.zmanim).map(([zmanId, result]) => {
			// @ts-ignore - assume key exists
			const zman = allResults.zmanim[zmanId];
			return { Zman: formatZmanCell(zman), Time: formatZmanTime(result.time, allResults.timezone) };
		});
		if (zmanimData.length > 0) {
			const zmanimTable = dataToHtmlTable(zmanimData, { headers: ['Zman', 'Time'], class: 'table table-striped table-bordered' });
			zmanimTables.push(zmanimTable);
		}
		const durationsData = Object.entries(allResults.durations).map(([zmanId, result]) => {
			// @ts-ignore - assume key exists
			const zman = allResults.durations[zmanId];
			return { Measurement: formatZmanCell(zman), Length: result.time };
		});
		if (durationsData.length > 0) {
			const durationsTable = dataToHtmlTable(durationsData, { headers: ['Measurement', 'Length'], class: 'table table-striped table-bordered' });
			zmanimTables.push(durationsTable);
		}

		// update the zmanim result object
		zmanimResult = {
			mapUrl,
			tablesHTML: zmanimTables.join(''),
			timezone: allResults.timezone,
			location: allResults.location || location,
			date: date,
		};
	}
</script>

<div class="card flex-card mb-0">
	<label>
		<div class="d-flex flex-column gap-2">
			<span>Location <span class="text-muted">(Address, City, or Zip Code)</span>:</span>
			<div class="d-flex mb-2">
				<input type="text" class="location-input form-control w-auto" bind:value={location} />
			</div>

			<span>Date:</span>
			<div class="d-flex mb-2">
				<input
					type="date"
					class="location-input form-control w-auto"
					bind:value={formattedDate}
					on:input={(e) => {
						if (e.target) {
							date = new Date(e.target.value);
							formattedDate = e.target.value;
						}
					}}
				/>
			</div>

			<div class="d-flex">
				<button
					class="btn btn-primary"
					on:click={async () => {
						await updateResults();
					}}
				>
					Calculate Zmanim
				</button>
			</div>
		</div>
	</label>
</div>

{#if zmanimResult.mapUrl}
	<div class="card flex-card mb-0">
		<h5 class="mb-0">Zmanim for {zmanimResult.location} on {dayjs(zmanimResult.date).format('dddd, MMMM D, YYYY')}</h5>
		<img src={zmanimResult.mapUrl} class="my-3" style="height: 200px; width: 400px;" alt="Map showing the location for Zmanim calculation" />
		{@html zmanimResult.tablesHTML}
	</div>

	<div class="card flex-card mb-0">
		<p>
			<span>
				Zmanim are from the <a href="https://www.hebcal.com/home/1663/zmanim-halachic-times-api" target="_blank">Hebcal API</a>. Times are shown for the timezone
				<a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank">{zmanimResult.timezone}</a>.
			</span>
		</p>

		<h6>Disclaimer:</h6>

		<span>Due to imprecision and multiple algorithms, zmanim calculations can vary slightly from one source to another. Please do not rely on any calculations on any site to the last minute.</span>
	</div>
{/if}
