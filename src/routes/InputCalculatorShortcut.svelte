<script>
	import InputExamples from './input/InputExamples.svelte';

	/** @type {string} The current query in the input box (not yet submitted) */
	let queryInput = '';

	/**
	 * Set the query to calculate and update the URL
	 */
	async function openQuery(newQuery = queryInput) {
		window.location.href = `/input?q=${encodeURIComponent(newQuery)}`;
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
</script>

<div class="card flex-card input-control">
	<div class="input-group">
		<input type="text" bind:value={queryInput} class="form-control" placeholder="What do you want to calculate?" on:keyup={onQueryKeypress} />
		<button class="btn btn-primary" on:click={() => openQuery(queryInput)}>Go</button>
	</div>
</div>

<InputExamples clickFunction={openQuery} />

<style>
</style>
