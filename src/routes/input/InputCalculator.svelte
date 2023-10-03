<script>
	import { page } from '$app/stores';
	import { calculateQuery } from '$lib/js/input';
	import { getConverters, getUnit, getUnits } from '$lib/js/unitconverter';
	import { faCalculator, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
	import AvailableOptionsList from './AvailableOptionsList.svelte';
	import InputExample from './InputExample.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { METHOD_NAMES } from '$lib/js/gematria';

	const converters = getConverters(false);

	/** @type {string} The current query in the input box (not yet submitted) */
	let queryInput = $page.url.searchParams.get('q') ?? '';

	/** @type {string} The disambiguation to use for the result */
	$: disambiguation = $page.url.searchParams.get('disambiguation') ?? '';

	/** @type {string} The current query to calculate */
	let query = queryInput;

	/**
	 * Set the query to calculate and update the URL
	 */
	async function setSections(newQuery = queryInput) {
		queryInput = newQuery;
		query = queryInput;
		const url = $page.url;
		url.searchParams.set('q', query);
		window.history.pushState({}, '', url);
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
		<button class="btn btn-primary" on:click={() => setSections(queryInput)}>Go</button>
	</div>
</div>

{#if query !== ''}
	{#await calculateQuery(query, { disambiguation })}
		<div class="card flex-card my-1">
			<h6>Calculating...</h6>
		</div>
	{:then sections}
		{#each sections as section}
			<div class="card flex-card my-1">
				{#if section.title}
					<h6>{section.title}</h6>
				{/if}
				<div class="result">{@html nl2br(section.content)}</div>
			</div>
		{/each}
	{:catch error}
		<div class="card flex-card my-1">
			<h6>Error</h6>
			<div>{error.message}</div>
			{#if error.details}
				<br />
				<details><summary>Details</summary><code><pre>{error.details}</pre></code></details>
			{/if}
		</div>
	{/await}
{/if}

<div class="card flex-card">
	<h4 class="mb-4">Examples of what you can enter</h4>

	<div class="mb-4">
		<h5><Fa icon={faScaleBalanced} class="me-1" /> Unit conversions</h5>

		<ul class="list-unstyled">
			<li><InputExample clickFunction={setSections} query="Convert 3 Tefachim to inches." /></li>
			<li><InputExample clickFunction={setSections} query="How many Amos are in a Parsah?" /></li>
			<li><InputExample clickFunction={setSections} query="Convert 40 Seah to US liquid gallons." /></li>
			<li><InputExample clickFunction={setSections} query="Convert 1 US Dollar to Perutos." /></li>
			<li><InputExample clickFunction={setSections} query="How many Chalakim are in an hour?" /></li>
			<li><InputExample clickFunction={setSections} query="Conversion chart for 1 Mil" /></li>
		</ul>

		<div>
			{#await converters then converters}
				<details>
					<summary>Show list of units</summary>

					<AvailableOptionsList mapping={getUnits(converters)} transform={async (unitType, unitId) => (await getUnit(unitType, unitId)).display} />
				</details>
			{:catch error}
				<div>An error occurred while loading the list of units.</div>
			{/await}
		</div>
	</div>

	<div class="mb-4">
		<h5><Fa icon={faCalculator} class="me-1" /> Gematria</h5>

		<ul class="list-unstyled">
			<li><InputExample clickFunction={setSections} query="Calculate Gematria of תורה." /></li>
			<li><InputExample clickFunction={setSections} query="Calculate Mispar Gadol of מלך." /></li>
			<li><InputExample clickFunction={setSections} query="Calculate Mispar Siduri of פרעה." /></li>
			<li><InputExample clickFunction={setSections} query="Calculate Mispar Katan Mispari of משיח." /></li>
			<li><InputExample clickFunction={setSections} query="Calculate AvGad of משה." /></li>
		</ul>

		<div>
			<details>
				<summary>Show list of gematria methods</summary>

				<AvailableOptionsList array={Object.values(METHOD_NAMES).map((method) => method.name)} />
			</details>
		</div>
	</div>

	<h6>More input types coming soon!</h6>
</div>

<style>
</style>
