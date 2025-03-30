<script>
	import { onMount } from 'svelte';
	import { getListOfGematriasInCommon } from '$lib/js/gematria';
	import HebrewKeyboard from '$lib/components/HebrewKeyboard.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faExternalLink } from '@danieloi/pro-solid-svg-icons';

	onMount(updateResults);

	/** @type {string} The query to calculate the Gematria of */
	let word1 = 'תורה';

	/** @type {string} The query to calculate the Gematria of */
	let word2 = 'משנה';

	/** @type {Array<{ method1: import('$lib/js/gematria').GematriaMethodName, method2: import('$lib/js/gematria').GematriaMethodName, value: number }>} The results of the Gematria calculation */
	let results = [];

	/**
	 * Search for words with a matching gematria value
	 * @param {{ word1: string, word2: string }} options - the options for the calculation
	 */
	async function getResults({ word1, word2 }) {
		return getListOfGematriasInCommon(word1, word2);
	}

	/**
	 * Read the options from the UI and update the results
	 */
	async function updateResults() {
		results = await getResults({ word1, word2 });
	}

	/** @type {HTMLInputElement} */
	let inputBox1;

	/** @type {HTMLInputElement} */
	let inputBox2;

	/** @type {1|2} - the last input box that was used */
	let previousInput = 1;

	/**
	 * Set the query for virtual keyboard input
	 * @param {string} newQuery - the new query to set
	 */
	export function setInput(newQuery) {
		if (previousInput === 1) {
			word1 = newQuery;
			inputBox1.focus();
		} else {
			word2 = newQuery;
			inputBox2.focus();
		}
		updateResults();
	}
</script>

<div class="card flex-card mb-0">
	<div class="d-flex gap-4 mb-3 flex-wrap">
		<label>
			<span>Input Word 1:</span>
			<input
				type="text"
				class="word-or-number-input form-control rtl"
				bind:value={word1}
				on:input={updateResults}
				on:focus={() => (previousInput = 1)}
				bind:this={inputBox1}
			/>
		</label>

		<label>
			<span>Input Word 2:</span>
			<input
				type="text"
				class="word-or-number-input form-control rtl"
				bind:value={word2}
				on:input={updateResults}
				on:focus={() => (previousInput = 2)}
				bind:this={inputBox2}
			/>
		</label>
	</div>

	<HebrewKeyboard addCharacter={(c) => setInput((previousInput == 1 ? word1 : word2) + c)} backspace={() => setInput((previousInput == 1 ? word1 : word2).slice(0, -1))} clear={() => setInput('')} />
</div>

<div class="card flex-card mb-0">
	<h5 class="mb-4">Gematria equivalences for "{word1}" and "{word2}"</h5>

	{#if results.length > 0}
		<div style="display: grid; grid-template-columns: 1fr 1fr 5fr 1fr 5fr; text-align: center; grid-row-gap: 0.5rem; grid-column-gap: 0rem; align-items: center;">
			{#each results as result}
				<div class="border rounded p-2">{result.value}</div>
				<div>=</div>
				<div class="border rounded p-2">{result.method1.name} of "{word1}"</div>
				<div>=</div>
				<div class="border rounded p-2">{result.method2.name} of "{word2}"</div>
			{/each}
		</div>
	{:else}
		<p class="mt-3 mb-0">No Gematria values in common were found.</p>
	{/if}
</div>

<div class="card flex-card mb-0">
	<p><a href="/info/gematria" target="_blank"><Fa icon={faExternalLink} /> &nbsp; Click for Explanations of Gematria Methods</a></p>
	<p class="small m-0">
		Javascript adaptation by TorahCalc. Original code in Kotlin by <a href="ssternbach@torahdownloads.com">ssternbach@torahdownloads.com</a>. Check out
		<a href="https://torahdownloads.com/">TorahDownloads.com</a> to find tens of thousands of shiurim on hundreds of topics, all available for free to stream or download!
	</p>
</div>

<style>
	.rtl {
		direction: rtl;
	}
</style>
