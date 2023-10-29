<script>
	import HebrewKeyboard from '$lib/components/HebrewKeyboard.svelte';
	import InputExamples from './input/InputExamples.svelte';

	/** @type {string} The current query in the input box (not yet submitted) */
	let queryInput = '';

	/**
	 * Set the query to calculate and update the URL
	 */
	async function openQuery(newQuery = queryInput) {
		queryInput = newQuery;
		const url = new URL('/input', window.location.origin);
		url.searchParams.set('q', queryInput);
		/** @type {HTMLAnchorElement} */
		// @ts-ignore - assume the element exists
		const link = document.getElementById('queryUrl');
		link.href = url.toString();
		setTimeout(() => link.click(), 0);
	}

	/**
	 * Handle the keypress event on the query input
	 * @param {KeyboardEvent} event - the keypress event
	 */
	function onQueryKeypress(event) {
		if (event.key === 'Enter') {
			openQuery();
		}
	}

	/** @type {HTMLInputElement} */
	let inputBox;

	/**
	 * Set the query for virtual keyboard input
	 * @param {string} newQuery - the new query to set
	 */
	export function setInput(newQuery) {
		queryInput = newQuery;
		inputBox.focus();
	}
</script>

<a class="d-none" href="/input?q={encodeURIComponent(queryInput)}" id="queryUrl">Open Query</a>

<div class="card flex-card input-control">
	<div class="input-group">
		<input type="text" bind:value={queryInput} bind:this={inputBox} class="form-control" placeholder="What do you want to calculate?" on:keyup={onQueryKeypress} />
		<button class="btn btn-primary" on:click={() => openQuery(queryInput)}>Go</button>
	</div>
	<HebrewKeyboard addCharacter={(c) => setInput(queryInput + c)} backspace={() => setInput(queryInput.slice(0, -1))} clear={() => setInput('')} />
</div>

<InputExamples clickFunction={openQuery} />
