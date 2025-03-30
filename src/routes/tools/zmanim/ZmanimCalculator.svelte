<script>
	import { PUBLIC_ADAPTER, PUBLIC_BASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';
	import { dataToHtmlTable } from '$lib/js/utils';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faCalendarDay, faLocationCrosshairs } from '@danieloi/pro-solid-svg-icons';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	dayjs.extend(timezone);
	dayjs.extend(utc);

	onMount(() => {
		// if the query parameters are set, use them
        /** @type {string|null} The date to calculate zmanim for (YYYY-MM-DD) */
        let queryDate = '';
		/** @type {string|null} The location to calculate zmanim for */
		let queryLocation = '';
		page.subscribe(($page) => {
            queryDate = $page.url.searchParams.get('date');
			queryLocation = $page.url.searchParams.get('location');
		});
        if (queryDate) {
            date = new Date(queryDate);
            formattedDate = queryDate;
        }
        if (queryLocation) {
			location = queryLocation;
            updateResults();
            return;
		}
		// otherwise, check if the user has a saved location in localStorage
		const savedLocation = localStorage.getItem('lastLocation');
		if (savedLocation) {
			location = savedLocation;
			updateResults();
			return;
		}
		// if no location is found, use the user's current location
		useCurrentLocation();
	});

	/** @type {string} The location to calculate zmanim for */
	let location = '';

	/** @type {string} The error message for geolocation or blank if there is no error */
	let geolocationError = '';

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
		try {
			const allResults = await getResults({ location, date });

			// Save the location to localStorage
			localStorage.setItem('lastLocation', location);

			// Update the URL query parameter without reloading the page
			const url = new URL(window.location.href);
			url.searchParams.set('location', location);
			goto(url.pathname + url.search, { replaceState: true });

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
		} catch (error) {
			alert(error?.toString());
			console.error(error);
			return;
		}
	}

	/**
	 * Get the user's current location and update the location input
	 */
	async function useCurrentLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
					updateResults();
				},
				(error) => {
					geolocationError = 'Unable to retrieve your location. Please enter a location manually.';
					console.error(error);
				}
			);
		} else {
			geolocationError = 'Geolocation is not supported by this browser.';
			console.error(geolocationError);
		}
	}

	/**
	 * Get today's date and update the date input
	 */
	function useToday() {
		date = new Date();
		formattedDate = dayjs(date).format('YYYY-MM-DD');
		updateResults();
	}
</script>

<div class="card flex-card mb-0">
	<label>
		<div class="d-flex flex-column gap-2">
			<span>Location <span class="text-muted">(Address, City, or Zip Code)</span>:</span>
			<div class="d-flex mb-2 align-items-center">
				<input type="text" class="location-input form-control w-auto" bind:value={location} />
				{#if geolocationError === ''}
					<button class="btn btn-light btn-sm d-flex align-items-center gap-2 ms-2" on:click={useCurrentLocation} title="Use your current location">
						<Fa icon={faLocationCrosshairs} size="1x" />
						<span>Use Current Location</span>
					</button>
				{:else}
					<button class="btn btn-light btn-sm d-flex align-items-center gap-2 ms-2" title={geolocationError} on:click={() => alert(geolocationError)}>
						<Fa icon={faLocationCrosshairs} size="1x" class="text-danger" />
						<span class="text-danger">Use Current Location</span>
					</button>
				{/if}
			</div>

			<span>Date:</span>
			<div class="d-flex mb-2 align-items-center">
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
				<button class="btn btn-light btn-sm d-flex align-items-center gap-2 ms-2" on:click={useToday} title="Use today's date">
					<Fa icon={faCalendarDay} size="1x" />
					<span>Use Today's Date</span>
				</button>
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
