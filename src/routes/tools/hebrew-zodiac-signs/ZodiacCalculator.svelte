<script>
	import { onMount } from 'svelte';
	import { calculateZodiac } from '$lib/js/zodiac';
	import dayjs from 'dayjs';

	onMount(updateResults);

	/** @type {number} Month of the date */
	let month = new Date().getMonth() + 1;

	/** @type {number} Day of the date */
	let day = new Date().getDate();

	/** @type {number} The year of the date */
	let year = new Date().getFullYear();

	/** @type {boolean} After sunset */
	let afterSunset = false;

	/** @type {import('$lib/js/zodiac').ZodiacResult|null} The zodiac result */
	let zodiacResult = null;

	/**
	 * Search for zmanim for a given date and location
	 * @param {{ month: number, day: number, year: number, afterSunset: boolean }} options - the options for the calculation
	 * @returns {Promise<import('$lib/js/zodiac').ZodiacResult>} The zodiac result
	 * @throws {Error} If the location is invalid
	 */
	async function getResults({ month, day, year, afterSunset }) {
		const date = new Date(year, month - 1, day);
		// add 24 hours if after sunset
		if (afterSunset) {
			date.setHours(date.getHours() + 24);
		}
		return calculateZodiac(dayjs(date).format('YYYY-MM-DD'));
	}

	/**
	 * Read the options from the UI and update the results
	 */
	async function updateResults() {
		zodiacResult = await getResults({ month, day, year, afterSunset });
	}
</script>

<div class="card flex-card mb-0">
	<span>Enter the month, day, and year of the date you want to calculate the Hebrew zodiac sign for.</span>
	<div class="input-group mb-3 mt-2">
		<select class="form-select" bind:value={month} on:change={() => updateResults()}>
			{#each Array(12) as _, i}
				<option value={i + 1}>{dayjs().month(i).format('MMMM')}</option>
			{/each}
		</select>
		<input type="number" min="1" max="31" bind:value={day} class="form-control" placeholder="Day" on:input={() => updateResults()} />
		<input type="number" min="0" max="9999" bind:value={year} class="form-control" placeholder="Year" on:input={() => updateResults()} />
	</div>
	<div class="form-check mb-3">
		<input type="checkbox" class="form-check-input" bind:checked={afterSunset} id="after-sunset" on:change={() => updateResults()} />
		<label class="form-check-label" for="after-sunset">After Sunset</label>
	</div>
	<div class="d-flex">
		<button class="btn btn-primary" on:click={() => updateResults()}>Calculate Zodiac</button>
	</div>
</div>

{#if zodiacResult}
	<div class="card flex-card mb-0 text-center">
		<p>Hebrew date: <strong>{zodiacResult.hebrewDate}</strong></p>
		<h5 class="mb-3">Zodiac Sign for {zodiacResult.month}:</h5>
		<h4 class="fw-bold">{zodiacResult.symbol} {zodiacResult.latin} / {zodiacResult.hebrewTransliterated} / {zodiacResult.hebrew}</h4>
	</div>
{/if}
