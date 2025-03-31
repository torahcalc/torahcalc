<script>
	import { hebrewMonths } from '$lib/js/dateconverter';
	import { calculateMolad } from '$lib/js/molad';
	import { getCurrentHebrewMonth, getNextHebrewMonth, getPrevHebrewMonth } from '$lib/js/utils';
	import { HDate } from '@hebcal/core';
	import { onMount } from 'svelte';

	onMount(updateResults);

	const HR_12 = '12Hr';
	const HR_24 = '24Hr';

	/** @type {string} The time format to use */
	let timeFormat = HR_12;

	/** @type {number} Hebrew year */
	let hebrewYear = new HDate().getFullYear();

	/** @type {number} The month of the date */
	let hebrewMonth = new HDate().getMonth();

	let nextHebrewMonth = getNextHebrewMonth();
	let prevHebrewMonth = getPrevHebrewMonth();
	let currentHebrewMonth = getCurrentHebrewMonth();

	/** @type {any} The results of the calculation */
	let results = {};

	/**
	 * Search for the molad for a given month
	 * @param {{ hebrewYear: number, hebrewMonth: number }} options - the options for the calculation
	 */
	async function getResults({ hebrewYear, hebrewMonth }) {
		return calculateMolad(hebrewYear, hebrewMonth);
	}

	/**
	 * Read the options from the UI and update the results
	 */
	async function updateResults() {
		results = await getResults({ hebrewYear, hebrewMonth });
	}

	/**
	 * Toggle the time format between 12-hour and 24-hour
	 */
	function toggleTimeFormat() {
		timeFormat = timeFormat === HR_12 ? HR_24 : HR_12;
	}

	/**
	 * Set the time format explicitly
	 * @param {string} format - The desired time format (HR_12 or HR_24)
	 */
	function setTimeFormat(format) {
		timeFormat = format;
	}

	/**
	 * Set the Hebrew month and year
	 * @param {{ month: number, year: number }} monthYear - The month and year to set
	 */
	function setHebrewMonthAndYear(monthYear) {
		hebrewMonth = monthYear.month;
		hebrewYear = monthYear.year;
		updateResults();
	}

	$: disableAdarII = !new HDate(1, hebrewMonth, hebrewYear).isLeapYear();

	$: shortMonthName = results.monthName ? results.monthName.replace(/ \d+$/, '') : '';
</script>

<div class="card flex-card mb-0">
	<span>Enter the Hebrew year and month of the date you want to calculate the molad for.</span>
	<div class="d-flex gap-4 mb-3 flex-wrap mt-3">
		<div class="form-group">
			<label for="hebrewYear" class="form-label">Hebrew Year:</label>
			<input id="hebrewYear" type="number" min="5780" max="5999" bind:value={hebrewYear} class="form-control w-auto" placeholder="Enter Year" on:input={() => updateResults()} />
		</div>
		<div class="form-group">
			<label for="hebrewMonth" class="form-label">Hebrew Month:</label>
			<select id="hebrewMonth" class="form-select w-auto" bind:value={hebrewMonth} on:change={updateResults}>
				{#each hebrewMonths as month, i (i)}
					<option value={i + 1} disabled={i === 12 && disableAdarII}>{month}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="mb-3">
		<span>Go To:</span>
		<div class="mt-1">
			<button class="btn btn-sm btn-outline-primary" on:click={() => setHebrewMonthAndYear(prevHebrewMonth)}>Last Month</button>
			<button class="btn btn-sm btn-outline-primary" on:click={() => setHebrewMonthAndYear(currentHebrewMonth)}>Current Month</button>
			<button class="btn btn-sm btn-outline-primary" on:click={() => setHebrewMonthAndYear(nextHebrewMonth)}>Next Month</button>
		</div>
	</div>

	<div>
		<span>Time format:</span>
		<div class="mt-1">
			<button class={`btn btn-sm btn-outline-primary ${timeFormat === HR_12 ? 'active' : ''}`} on:click={() => setTimeFormat(HR_12)}>12-hour</button>
			<button class={`btn btn-sm btn-outline-primary ${timeFormat === HR_24 ? 'active' : ''}`} on:click={() => setTimeFormat(HR_24)}>24-hour</button>
		</div>
	</div>
</div>

<div class="card flex-card mb-0">
	{#if results.timeString}
		<h3 class="mb-4">Molad for {results.monthName}:</h3>
		<div>
			<ul>
				<li>{results.timeFormat[timeFormat]}</li>
				<li>{results.dayOfWeekFormat[timeFormat]}</li>
				<li>{results.hebrewDateFormat[timeFormat]}</li>
			</ul>

			{#if !results.shabbosMevarchim.roshHashanah}
				<p class="mt-3">
					<b>Shabbos Mevorchim {shortMonthName}</b> is on <b>{results.shabbosMevarchim.shabbosMevarchim}</b>.
				</p>
				<p>
					<b>Rosh Chodesh {shortMonthName}</b> is on <b>{results.shabbosMevarchim.roshChodesh}</b>
					<br />
					({results.shabbosMevarchim.roshChodeshDayOfWeekDisplayEn})
				</p>
			{/if}
		</div>

		<a href="/input?q=Calculate+the+molados+of+{hebrewYear}" class="btn btn-outline-primary mt-3 text-decoration-none" style="width: max-content;"> Calculate Full Year </a>
	{/if}
</div>

<div class="card flex-card mb-0">
	<h3>About the Molad:</h3>
	<ul>
		<li>The molad is the time of the "birth" of the new moon (i.e. when the moon has moved far enough away from the line of sight of the Sun to become visible again).</li>
		<li>The average amount of time between one molad and the next is 29 days, 12 hours, and 793 chalakim*.</li>
		<li>Rosh Chodesh usually falls around the time of the molad.</li>
		<li>
			During the blessing of the new month which is said in the synagogue on the Shabbos before Rosh Chodesh, the time of the molad in Jerusalem is announced, usually by announcing the day of the week
			followed by the time in minutes and chalakim after the hour.
		</li>
	</ul>
	<p>* Times shown are for Jerusalem. In all locations, times are announced for Jerusalem.</p>
	<p>* A Chelek (pl. Chalakim) is a halachik measurement of time equal to 1/18 of a minute. <a href="/info/biblical-units/#time">More info.</a></p>
</div>
