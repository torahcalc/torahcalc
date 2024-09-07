<script>
	import { onMount } from 'svelte';
	import { METHOD_NAMES, WORD_LIST_NAMES, calculateGematria, searchGematria } from '$lib/js/gematria';
	import HebrewKeyboard from '$lib/components/HebrewKeyboard.svelte';
	import GoogleTranslate from '$lib/components/GoogleTranslate.svelte';

	onMount(updateResults);

	/** @type {string} The query to calculate the Gematria of */
	let query = 'תורה';

	/** @type {{value: number, words: { [key: string]: string[] }}} The results of the Gematria calculation */
	let results = {
		value: 0,
		words: {},
	};

	/**
	 * Search for words with a matching gematria value
	 * @param {{ text?: string, value?: number }} options - the options for the calculation
	 */
	async function getResults({ text, value }) {
		if (text !== undefined && value === undefined) {
			const gematriaResult = calculateGematria({ text });
			value = gematriaResult['standard'];
		} else if (value === undefined) {
			throw new Error('Either text or value must be defined');
		}

		return {
			value,
			words: searchGematria(value),
		};
	}

	/**
	 * Read the options from the UI and update the results
	 */
	async function updateResults() {
		if (/^[\d,]+$/.test(query)) {
			results = await getResults({ value: Number(query.replace(/,/g, '')) });
		} else {
			results = await getResults({ text: query });
		}
	}

	const TOGGLE_MAPPING = {
		'10,000 Common Hebrew Words': ['COMMON_WORDS'],
		'Words in the Torah': ['TORAH_WORDS'],
		'Verses in the Torah': ['BEREISHIS_PESUKIM', 'SHEMOS_PESUKIM', 'VAYIKRA_PESUKIM', 'BAMIDBAR_PESUKIM', 'DEVARIM_PESUKIM', 'NACH_PESUKIM'],
	};

	/**
	 * Check if a word list should be shown
	 * @param {string} wordListKey - the key of the word list
	 * @param {string[]} words - the words in the word list
	 * @returns {boolean} whether the word list should be shown
	 */
	function showWordsList(wordListKey, words) {
		// if there are no words in the list, don't show it
		if (words.length === 0) {
			return false;
		}
		// @ts-ignore - the key must be in TOGGLE_MAPPING
		const checkboxLabel = Object.keys(TOGGLE_MAPPING).find((label) => TOGGLE_MAPPING[label].includes(wordListKey));
		/** @type {HTMLInputElement|null} */
		const checkbox = document.querySelector(`input[data-label="${checkboxLabel}"]`);
		// if the checkbox is not found, show the word list although it should be made toggleable
		if (!checkbox) {
			return true;
		}
		// show the word list if the checkbox is checked, otherwise hide it
		return checkbox.checked;
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

<div class="card flex-card mb-0">
	<label>
		<span>Hebrew word or number:</span>
		<input type="text" class="word-or-number-input form-control rtl" bind:value={query} on:input={updateResults} bind:this={inputBox} />
	</label>

	<HebrewKeyboard addCharacter={(c) => setInput(query + c)} backspace={() => setInput(query.slice(0, -1))} clear={() => setInput('')} />
</div>

<div class="card flex-card mb-0">
	<h4>Show Gematria matches from:</h4>
	{#each Object.keys(TOGGLE_MAPPING) as label}
		<label class="d-block">
			<input type="checkbox" checked data-label={label} on:change={() => updateResults()} />
			{label}
		</label>
	{/each}

	<div class="mt-3">
		<GoogleTranslate />
	</div>
</div>

<div class="card flex-card mb-0">
	<h5 class="mb-0">Words and Verses with {METHOD_NAMES['standard'].name} = {results.value.toLocaleString()}</h5>

	{#if Object.values(results.words).reduce((acc, next) => acc.concat(next), []).length > 0}
		{#each Object.entries(results.words) as [wordListKey, words]}
			{#if showWordsList(wordListKey, words)}
				<h3 class="mt-3">{WORD_LIST_NAMES[wordListKey]}</h3>
				<div class="translate">
					<ul>
						{#each words as word}
							<li><p style="direction: rtl; margin: 0;">{word}</p></li>
						{/each}
					</ul>
				</div>
			{/if}
		{/each}
	{:else}
		<p class="mt-3 mb-0">No results</p>
	{/if}
</div>

<style>
	.rtl {
		direction: rtl;
	}

	.word-or-number-input {
		width: 200px;
	}
</style>
