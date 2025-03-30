<script>
	import { onMount } from 'svelte';
	import { HDate } from '@hebcal/core';
	import { getHolidays } from '$lib/js/holidays';
	import { dataToHtmlTable } from '$lib/js/utils';

	onMount(() => {
		updateResults('upcoming');
	});

	/** @type {number} The query to calculate the Gematria of */
	let greogorianYear = new Date().getFullYear();

	/** @type {number} The query to calculate the Gematria of */
	let hebrewYear = new HDate().getFullYear();

	/** @type {'diaspora'|'israel'} Whether to show Diaspora holidays */
	let diaspora = 'diaspora';
	/** @type {boolean} Whether to show major holidays */
	let major = true;
	/** @type {boolean} Whether to show minor holidays */
	let minor = true;
	/** @type {boolean} Whether to show fast days */
	let fasts = true;
	/** @type {boolean} Whether to show Rosh Chodesh holidays */
	let roshChodesh = true;
	/** @type {boolean} Whether to show Shabbos Mevorchim holidays */
	let shabbosMevorchim = false;
	/** @type {boolean} Whether to show special Shabbos holidays */
	let specialShabbos = false;
	/** @type {boolean} Whether to show modern holidays */
	let modern = false;
	/** @type {boolean} Whether to show Chabad holidays */
	let chabad = false;

	/** @type {'gregorian'|'hebrew'|'upcoming'} The mode of the calculation */
	let lastMode = 'upcoming';

	/** @type {string} The results of the holiday calculation */
	let results = "";

	/**
	 * Search for words with a matching gematria value
	 * @param {{ mode: 'gregorian'|'hebrew'|'upcoming', year: number, types: import('$lib/js/holidays').HolidayFlags }} options - the options for the calculation
	 */
	async function getResults({ mode, year, types }) {
		let gregorianYear;
		let hebrewYear;
		let startDate;

		if (mode === 'hebrew') {
			hebrewYear = year;
		} else if (mode === 'gregorian') {
			gregorianYear = year;
		} else if (mode === 'upcoming') {
			startDate = new HDate();
		}

		// get the holidays
		const holidays = getHolidays({ gregorianYear, hebrewYear, startDate, types });

		let title = 'Upcoming Jewish Holidays and Observances';
		if (mode === 'gregorian' || mode === 'hebrew') {
			title = `Jewish Holidays and Observances in ${mode === 'hebrew' ? 'Hebrew Year ' + hebrewYear : 'Gregorian Year ' + gregorianYear}`;
		}
		// show all holidays in tables
		const holidayData = holidays.map((holiday) => {
			return { Holiday: holiday.titleHTML, 'Gregorian Date': holiday.gregorianDateHTML, 'Hebrew Date': holiday.hebrewDateHTML };
		});
		const holidayTable = dataToHtmlTable(holidayData, {
			headers: ['Holiday', 'Gregorian Date', 'Hebrew Date'],
			class: 'table table-striped table-bordered',
			thStyles: ['width: 200px', 'min-width: 200px', 'min-width: 200px'],
		});

		return `
			<div class="mb-3">
				<h5 class="mb-3">${title}</h5>
				${holidayTable}
			</div>
		`;
	}

	/**
	 * Read the options from the UI and update the results
	 * @param {'gregorian'|'hebrew'|'upcoming'|null} mode - the calendar to use or upcoming
	 */
	async function updateResults(mode = null) {
		mode = mode || lastMode;
		lastMode = mode;
		const types = {
			diaspora: diaspora === 'diaspora',
			major,
			minor,
			fasts,
			roshChodesh,
			shabbosMevorchim,
			specialShabbos,
			modern,
			chabad,
		};
		console.log({ mode, types });
		const year = mode === 'gregorian' ? greogorianYear : hebrewYear;
		results = await getResults({ mode, year, types });
	}
</script>

<div class="card flex-card mb-0">
	<div class="d-flex gap-4 mb-3 flex-wrap align-items-center justify-content-center">
		<label class="text-center">
			<span>Gregorian Year:</span>
			<input type="number" min="0" max="9999" bind:value={greogorianYear} class="form-control" placeholder="Gregorian Year" on:input={() => updateResults()} />
			<button class="btn btn-primary btn-sm mt-2" on:click={() => updateResults('gregorian')}>Display Year</button>
		</label>

		<span style="font-size: 130%;">OR</span>

		<label class="text-center">
			<span>Hebrew Year:</span>
			<input type="number" min="0" max="9999" bind:value={hebrewYear} class="form-control" placeholder="Hebrew Year" on:input={() => updateResults()} />
			<button class="btn btn-primary btn-sm mt-2" on:click={() => updateResults('hebrew')}>Display Year</button>
		</label>

		<span style="font-size: 130%;">OR</span>

		<button class="btn btn-primary" on:click={() => updateResults('upcoming')}>Upcoming Holidays</button>
	</div>

	<hr />

	<h4 class="mb-3 text-center">Display:</h4>

	<div class="d-flex flex-wrap gap-3 mt-2 mb-4 align-items-center justify-content-center">
		<label class="form-check-label">
			<input type="checkbox" class="form-check-input" bind:checked={major} on:change={() => updateResults()} />
			Major Holidays
		</label>
		<label class="form-check-label">
			<input type="checkbox" class="form-check-input" bind:checked={minor} on:change={() => updateResults()} />
			Minor Holidays
		</label>
		<label class="form-check-label">
			<input type="checkbox" class="form-check-input" bind:checked={fasts} on:change={() => updateResults()} />
			Minor Fasts
		</label>
		<label class="form-check-label">
			<input type="checkbox" class="form-check-input" bind:checked={roshChodesh} on:change={() => updateResults()} />
			Rosh Chodesh
		</label>
		<label class="form-check-label">
			<input type="checkbox" class="form-check-input" bind:checked={shabbosMevorchim} on:change={() => updateResults()} />
			Shabbos Mevorchim
		</label>
		<label class="form-check-label">
			<input type="checkbox" class="form-check-input" bind:checked={specialShabbos} on:change={() => updateResults()} />
			Special Shabbosos
		</label>
		<label class="form-check-label">
			<input type="checkbox" class="form-check-input" bind:checked={modern} on:change={() => updateResults()} />
			Israel Holidays
		</label>
		<label class="form-check-label">
			<input type="checkbox" class="form-check-input" bind:checked={chabad} on:change={() => updateResults()} />
			Chabad Events
		</label>
	</div>

	<!-- radio toggle between diaspora holiday schedule (diaspora=true) and israel holiday schedule (diaspora=false) -->
	<div class="d-flex flex-wrap gap-3 mt-2 mb-4 align-items-center justify-content-center">
		<label class="form-check-label">
			<input type="radio" class="form-check-input" value="diaspora" bind:group={diaspora} on:change={() => updateResults()} />
			Diaspora Holiday Schedule
		</label>
		<label class="form-check-label">
			<input type="radio" class="form-check-input" value="israel" bind:group={diaspora} on:change={() => updateResults()} />
			Israel Holiday Schedule
		</label>
	</div>
</div>

<div class="card flex-card mb-0">
	{@html results}
</div>
