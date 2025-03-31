<script>
	import { isShmitaYear, nextShmita } from '$lib/js/shmita';
	import { faCheck, faX } from '@danieloi/pro-solid-svg-icons';
	import { HDate } from '@hebcal/core';
	import Fa from 'svelte-fa';
	import Reason from '../Reason.svelte';

	/** @type {number} The current year */
	const currentHebrewYear = new HDate().getFullYear();

	/** @type {number} The year to search for the next Shmita after */
	let hebrewYear = new HDate().getFullYear();

	/** @type {number} The next Shmita result */
	$: shmita = nextShmita(hebrewYear);

	/** @type {number} The year to check if it is a Shmita year */
	let yearToCheck = new HDate().getFullYear();

	/** @type {boolean} Whether the inputted year is a Shmita year */
	$: isYearToCheckShmita = isShmitaYear(yearToCheck);

	const LIST_YEARS = 200;
	const INTERVAL = 7;

	/** @type {number[]} The Shmita results from the past */
	const pastShmitaList = [];

	/** @type {number[]} The Shmita results from the future */
	const futureShmitaList = [];

	for (let i = -LIST_YEARS; i < LIST_YEARS; i += INTERVAL) {
		const yearToCheck = currentHebrewYear + i;
		const result = nextShmita(yearToCheck);
		if (result < currentHebrewYear) {
			pastShmitaList.push(result);
		} else if (result > currentHebrewYear) {
			futureShmitaList.push(result);
		}
	}

	/**
	 * Change the year to search for the next or previous Shmita
	 * @param {number} direction - The direction to search for the next Shmita
	 */
	function changeYear(direction) {
		hebrewYear += direction * INTERVAL;
	}

	/**
	 * Hebrew Year to Gregorian Year
	 * @param {number} year - The Hebrew year to convert
	 * @return {string} The Gregorian year
	 */
	function hebrewYearToGregorian(year) {
		const start = year - 3761;
		const end = start + 1;
		return `${start} - ${end}`;
	}
</script>

<div class="card flex-card mb-0 text-center">
	<h4 class="mb-3">
		{`Shmita ${hebrewYear < currentHebrewYear ? (hebrewYear === currentHebrewYear - INTERVAL ? 'last took place' : 'took place') : hebrewYear === currentHebrewYear ? 'will next take place' : 'will take place'}:`}
	</h4>
	<h5 class="mb-3">Hebrew Year {shmita}</h5>
	<h6 class="mb-4">({hebrewYearToGregorian(shmita)})</h6>

	<div class="d-flex justify-content-center gap-2">
		<button class="btn btn-outline-secondary" on:click={() => changeYear(-1)}><span class="icon">←</span> Previous</button>
		<button class="btn btn-outline-secondary" on:click={() => changeYear(1)}>Next <span class="icon">→</span></button>
	</div>
</div>

<div class="card flex-card mb-0 text-center">
	<h2>Check if a Hebrew Year is a Shmita Year</h2>

	<label>
		<span>Hebrew Year:</span>
		<input type="number" bind:value={yearToCheck} min="1" max="9999" class="form-control" />
	</label>

	{#if yearToCheck > 0}
		<Reason
			success={isYearToCheckShmita}
			reason={isYearToCheckShmita ? `Yes, ${yearToCheck} is divisible by 7 and is therefore a Shmita year.` : `No, ${yearToCheck} is not divisible by 7 and is therefore not a Shmita year.`}
		/>
	{:else}
		<p class="mt-3 mb-0">Please enter a Hebrew year to check.</p>
	{/if}
</div>

<div class="card flex-card mb-0">
	<h5 class="mb-3 text-center">When Shmita occurred in the past {LIST_YEARS} years:</h5>
	{#if pastShmitaList.length > 0}
		<div class="d-flex flex-wrap gap-1 justify-content-center">
			{#each pastShmitaList as result}
				<div class="border p-2 text-center m-0">{result}</div>
			{/each}
		</div>
	{/if}
	<h5 class="mt-4 mb-3 text-center">When Shmita will occur in the next {LIST_YEARS} years:</h5>
	{#if futureShmitaList.length > 0}
		<div class="d-flex flex-wrap gap-1 justify-content-center">
			{#each futureShmitaList as result}
				<div class="border p-2 text-center m-0">{result}</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	h2 {
		margin-top: 0.2em;
		margin-bottom: 1em;
		font-size: 1.7em;
	}

	label {
		margin-bottom: 0.5em;
	}

	input {
		display: inline-flex;
		margin-left: 0.5em;
		width: 5.5em;
	}

	.reason {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		background-color: #fff;
		padding: 1.5rem;
		margin: 1rem 0;
		gap: 0.5rem;
	}

	.reason span.icon {
		margin-right: 1rem;
	}

	.reason span.icon.check {
		color: #10b981;
	}

	.reason span.icon.x {
		color: #ef4444;
	}
</style>
