<script>
	import { page } from '$app/stores';
	import { calculateQuery } from '$lib/js/input';

	/** @type {string} The current query in the input box (not yet submitted) */
	let queryInput = $page.url.searchParams.get('q') ?? '';

	/** @type {string} The disambiguation to use for the result */
	$: disambiguation = $page.url.searchParams.get('disambiguation') ?? '';

	/** @type {string} The current query to calculate */
	let query = queryInput;

	/**
	 * Set the query to calculate and update the URL
	 */
	async function setSections() {
		const url = $page.url;
		url.searchParams.set('q', query);
		window.history.pushState({}, '', url);
		query = queryInput;
	}

	/**
	 * Handle the keypress event on the query input
	 * @param {KeyboardEvent} event - the keypress event
	 */
	function onQueryKeypress(event) {
		if (event.key === 'Enter') {
			setSections();
		}
	}

	/**
	 * Replace newlines with <br /> tags
	 * @param {String} str - the string to replace newlines in
	 * @returns {String} the string with newlines replaced
	 */
	function nl2br(str) {
		return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
	}
</script>

<div class="card flex-card input-control">
	<div class="input-group">
		<input type="text" bind:value={queryInput} class="form-control" placeholder="What do you want to calculate?" on:keyup={onQueryKeypress} />
		<button class="btn btn-primary" on:click={setSections}>Calculate</button>
	</div>
</div>

{#if query !== ''}
	{#await calculateQuery(query, { disambiguation })}
		<div class="card flex-card">
			<h2>Calculating...</h2>
		</div>
	{:then sections}
		{#each sections as section}
			<div class="card flex-card">
				{#if section.title}
					<h6>{section.title}</h6>
				{/if}
				<div class="result">{@html nl2br(section.content)}</div>
			</div>
		{/each}
	{:catch error}
		<div class="card flex-card">
			<h6>Error</h6>
			<div>{error.message}</div>
			{#if error.details}
				<br />
				<details><summary>Details</summary><code><pre>{error.details}</pre></code></details>
			{/if}
		</div>
	{/await}
{/if}

<style>
</style>
