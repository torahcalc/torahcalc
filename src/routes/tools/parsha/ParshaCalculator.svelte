<script>
	import { onMount } from 'svelte';
	import { calculateParsha } from '$lib/js/parsha';
	import dayjs from 'dayjs';

	onMount(updateResults);

	/** @type {number} Month of the date */
	let month = new Date().getMonth() + 1;

	/** @type {number} Day of the date */
	let day = new Date().getDate();

	/** @type {number} The year of the date */
	let year = new Date().getFullYear();

	/** @type {boolean} Whether to use the Israel reading schedule */
	let il = false;

	/** @type {import('$lib/js/parsha').ParshaResult|null} The parsha result */
	let parshaResult = null;

	/** @type {string|null} Error message */
	let error = null;

	/**
	 * Calculate the parsha for a given date
	 * @param {{ month: number, day: number, year: number, il: boolean }} options - the options for the calculation
	 * @returns {import('$lib/js/parsha').ParshaResult} The parsha result
	 * @throws {Error} If the date is invalid
	 */
	function getResults({ month, day, year, il }) {
		const y = year;
		const m = month - 1;
		const d = day;
		const dateObj = new Date(0);
		dateObj.setFullYear(y, m, d);
		dateObj.setHours(0, 0, 0, 0);
		if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m || dateObj.getDate() !== d) {
			throw new Error('Invalid date.');
		}
		return calculateParsha(dayjs(dateObj).format('YYYY-MM-DD'), il);
	}

	/**
	 * Read the options from the UI and update the results
	 */
	function updateResults() {
		try {
			parshaResult = getResults({ month, day, year, il });
			error = null;
		} catch (/** @type {any} */ err) {
			parshaResult = null;
			error = err.message;
		}
	}
</script>

<div class="card flex-card mb-0">
	<span>Enter the month, day, and year of the date you want to calculate the weekly Torah portion for.</span>
	<div class="input-group mb-3 mt-2">
		<select class="form-select" bind:value={month} on:change={() => updateResults()}>
			{#each Array(12) as _, i}
				<option value={i + 1}>{dayjs().month(i).format('MMMM')}</option>
			{/each}
		</select>
		<input type="number" min="1" max="31" bind:value={day} class="form-control" placeholder="Day" on:input={() => updateResults()} />
		<input type="number" min="0" max="9999" bind:value={year} class="form-control" placeholder="Year" on:input={() => updateResults()} />
	</div>
	<div class="mb-3">
		<div class="form-check form-check-inline">
			<input type="radio" class="form-check-input" bind:group={il} value={false} id="diaspora" on:change={() => updateResults()} />
			<label class="form-check-label" for="diaspora">Diaspora</label>
		</div>
		<div class="form-check form-check-inline">
			<input type="radio" class="form-check-input" bind:group={il} value={true} id="israel" on:change={() => updateResults()} />
			<label class="form-check-label" for="israel">Israel</label>
		</div>
	</div>
	<div class="d-flex">
		<button class="btn btn-primary" on:click={() => updateResults()}>Calculate Parsha</button>
	</div>
</div>

{#if error}
	<div class="alert alert-danger mt-3 mb-0">{error}</div>
{:else if parshaResult}
	<div class="card flex-card mb-0 text-center">
		<h5 class="mb-3">Torah portion for the week of {parshaResult.formattedDate}:</h5>
		<h4 class="fw-bold mb-3">{parshaResult.parsha} / {parshaResult.hebrewParsha}</h4>
		<p class="mb-0">
			Read on Shabbos, <strong>{parshaResult.formattedDate}</strong> ({parshaResult.hebrewDate})
		</p>
	</div>
{/if}
