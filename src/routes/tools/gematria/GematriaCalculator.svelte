<script>
	import { onMount } from 'svelte';
	import { LETTER_SPELLING_VALUES, METHOD_NAMES, calculateGematria } from '$lib/js/gematria';
	import { formatNumberHTML } from '$lib/js/utils';
	import HebrewKeyboard from '../../input/HebrewKeyboard.svelte';

	onMount(updateResults);

	/** @type {string} The query to calculate the Gematria of */
	let query = 'תורה';

	/** @type {string} The Gematria method to use at the top */
	let selectedMethod = 'standard';

	/**
	 * @typedef {Object} GematriaResult
	 * @property {string} name - the name of the Gematria method
	 * @property {string} hebrewName - the Hebrew name of the Gematria method
	 * @property {number} value - the value of the Gematria
	 * @property {string} url - the URL of the Gematria method documentation
	 */

	/** @type {{ [key: string]: GematriaResult }} The results of the Gematria calculation */
	let results = {};

	/**
	 * Calculate the Gematria of the query
	 * @param {string} text - the query to calculate the Gematria of
	 * @param {{ [key: string]: number }} miluiInput - the values of the letters for the milui method
	 * @returns {Promise<{ [key: string]: GematriaResult }>} the results of the Gematria calculation
	 */
	async function getResults(text, miluiInput) {
		const gematriaResults = await calculateGematria({ text, miluiInput });
		/** @type {{ [key: string]: GematriaResult }} */
		const output = {};
		for (const [key, value] of Object.entries(gematriaResults)) {
			const name = METHOD_NAMES[key].name;
			const hebrewName = METHOD_NAMES[key].hebrewName;
			const url = `/info/gematria#${key}`;
			output[key] = { name, hebrewName, value, url };
		}
		return output;
	}

	/**
	 * Read the options from the UI and update the results
	 */
	async function updateResults() {
		/** @type {{ [key: string]: number }} */
		const miluiInput = {};
		for (const letter of Object.keys(LETTER_SPELLING_VALUES)) {
			/** @ts-ignore - @type {HTMLInputElement} */
			const input = document.querySelector(`input[name="milui-${letter}"]:checked`);
			if (!input) {
				console.error(`No input found for input[name="milui-${letter}"]:checked`);
				continue;
			}
			miluiInput[letter] = Number(input.value);
		}
		results = await getResults(query, miluiInput);
	}

	/**
	 * Set selectedMethod
	 * @param {string} method - the method to set
	 */
	function setSelectedMethod(method) {
		selectedMethod = method;
	}

	/** @type {HTMLInputElement} */
	let inputBox;

	/**
	 * Set the query for virtual keyboard input
	 * @param {string} newQuery - the new query to set
	 */
	export function setInput(newQuery) {
		query = newQuery;
		inputBox.focus();
        updateResults();
	}
</script>

<div class="card flex-card">
	<label>
		<span>Word or phrase:</span>
		<input type="text" class="word-or-number-input form-control rtl" bind:value={query} on:input={updateResults} bind:this={inputBox} />
	</label>

	<HebrewKeyboard addCharacter={(c) => setInput(query + c)} backspace={() => setInput(query.slice(0, -1))} clear={() => setInput('')} />

	<details class="mt-2">
		<summary>Shemi/Milui and Ne'elam Spelling Options</summary>
		<div class="d-flex flex-wrap align-items-center justify-content-center rtl">
			{#each Object.entries(LETTER_SPELLING_VALUES) as [letter, spellings]}
				<div class="d-flex py-1 px-2 m-1 border rounded gap-2">
					{#each spellings as spelling, index}
						<label>
							<input type="radio" name={`milui-${letter}`} value={spelling.value} checked={index === 0} on:change={updateResults} />
							{spelling.name}
						</label>
					{/each}
				</div>
			{/each}
		</div>
		<div class="d-flex flex-wrap gap-2 mt-2 mb-4 align-items-center justify-content-center">
			<button class="btn btn-sm btn-outline-secondary" on:click={() => setSelectedMethod('shemi')}>Calculate Mispar Shemi</button>
			<button class="btn btn-sm btn-outline-secondary" on:click={() => setSelectedMethod('neelam')}>Calculate Mispar Ne'elam</button>
		</div>
	</details>

	<div class="selected-method d-flex gap-3 px-3 my-3 align-items-center">
		<label for="gematria-method">Method:</label>
		<select id="gematria-method" class="form-select" on:change={updateResults} bind:value={selectedMethod}>
			{#each Object.entries(METHOD_NAMES) as [key, method]}
				<option value={key}>{method.name}</option>
			{/each}
		</select>
		<span class="text-muted">=</span>
		{#if results[selectedMethod]}
			<span class="h5 m-0">{results[selectedMethod].value.toLocaleString()}</span>
		{/if}
	</div>

	{#if Object.values(results).length > 0}
		<div class="row g-1">
			{#each Object.values(results) as result}
				<div class="col-lg-4 col-md-6">
					<div class="card flex-card m-1 p-3" style="min-width: 286px;">
						<b>{result.name}</b>
						<p>{result.hebrewName}</p>
						<p class="h5">{@html formatNumberHTML(result.value)}</p>
						<a href={result.url} target="_blank" rel="noopener noreferrer">Learn More</a>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<p>No results</p>
	{/if}
</div>

<style>
	details > summary {
		width: max-content;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	details > summary:hover {
		background-color: #eee;
	}

	.rtl {
		direction: rtl;
	}

	.word-or-number-input {
		width: 200px;
	}

	.selected-method {
		background-color: var(--bs-light);
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid var(--bs-gray-300);
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		width: 100%;
	}
</style>
