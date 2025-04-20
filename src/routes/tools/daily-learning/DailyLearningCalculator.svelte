<script>
	import { onMount } from 'svelte';
	import { calculateDailyLearning, LEARNING_TYPE_NAMES } from '$lib/js/dailylearning';
	import dayjs from 'dayjs';
	import { formatHebrewDateEn } from '$lib/js/dateconverter';
	import { HDate } from '@hebcal/core';

	onMount(updateResults);

	/** @type {number} Month of the date */
	let month = new Date().getMonth() + 1;

	/** @type {number} Day of the date */
	let day = new Date().getDate();

	/** @type {number} The year of the date */
	let year = new Date().getFullYear();

	/** @type {any} The result */
	let result = null;

	/**
	 * Search for daily learning for a given date
	 * @param {{ month: number, day: number, year: number }} options - the options for the calculation
	 * @returns {Promise<{ [key: string]: string|import('$lib/js/dailylearning').DailyLearning|null }>} The zodiac result
	 */
	async function getResults({ month, day, year }) {
		const date = new Date(year, month - 1, day);
		return calculateDailyLearning(dayjs(date).format('YYYY-MM-DD'));
	}

	/**
	 * Read the options from the UI and update the results
	 */
	async function updateResults() {
		result = await getResults({ month, day, year });
	}
</script>

<div class="card flex-card mb-0">
	<span>Enter the month, day, and year of the date you want to calculate the daily learning for.</span>
	<div class="input-group mb-3 mt-2">
		<select class="form-select" bind:value={month} on:change={() => updateResults()}>
			{#each Array(12) as _, i}
				<option value={i + 1}>{dayjs().month(i).format('MMMM')}</option>
			{/each}
		</select>
		<input type="number" min="1" max="31" bind:value={day} class="form-control" placeholder="Day" on:input={() => updateResults()} />
		<input type="number" min="0" max="9999" bind:value={year} class="form-control" placeholder="Year" on:input={() => updateResults()} />
	</div>
	<div class="d-flex">
		<button class="btn btn-primary" on:click={() => updateResults()}>Calculate Daily Learning</button>
	</div>
</div>

{#if result}
	<div class="card flex-card mb-0">
		<h4 class="mb-3 text-center">Daily Learning for {dayjs(new Date(year, month - 1, day)).format('MMMM D, YYYY')} ({formatHebrewDateEn(new HDate(new Date(year, month - 1, day)))})</h4>
		<div id="daily-learning-grid">
			{#each Object.entries(result) as [key, value]}
				{#if typeof value === 'object' && value?.name}
					<div class="inner-card card flex-card m-0 bg-light">
						<h5 class="mb-3">{LEARNING_TYPE_NAMES[key]}</h5>
						<p><b>{value.name} / {value.hebrewName}</b></p>
						{#if value.url}
							<p>Read online at <a href={value.url} target="_blank">{value.url}</a></p>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/if}

<style>
	#daily-learning-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	/* smaller than 600px, make it 1 column */
	@media (max-width: 600px) {
		#daily-learning-grid {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
