<script>
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faCalculator, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
	import { getConverters, getUnit, getUnits } from '$lib/js/unitconverter';
	import { METHOD_NAMES } from '$lib/js/gematria';
	import InputExample from './InputExample.svelte';
	import AvailableOptionsList from './AvailableOptionsList.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;

	const converters = getConverters(false);
</script>

<div class="card flex-card">
	<h4 class="mb-4">Examples of what you can enter</h4>

	<div class="mb-4">
		<h5><Fa icon={faScaleBalanced} class="me-1" /> Unit conversions</h5>

		<ul class="list-unstyled">
			<li><InputExample {clickFunction} query="Convert 3 Tefachim to inches." /></li>
			<li><InputExample {clickFunction} query="How many Amos are in a Parsah?" /></li>
			<li><InputExample {clickFunction} query="Convert 40 Seah to US liquid gallons." /></li>
			<li><InputExample {clickFunction} query="Convert 1 US Dollar to Perutos." /></li>
			<li><InputExample {clickFunction} query="How many Chalakim are in an hour?" /></li>
			<li><InputExample {clickFunction} query="Conversion chart for 1 Mil" /></li>
		</ul>

		<div>
			{#await converters then converters}
				<details>
					<summary>Show list of units</summary>

					<AvailableOptionsList mapping={getUnits(converters)} transform={async ([unitType, unitId]) => (await getUnit(unitType, unitId)).display} />
				</details>
			{:catch error}
				<div>An error occurred while loading the list of units.</div>
			{/await}
		</div>
	</div>

	<div class="mb-4">
		<h5><Fa icon={faCalculator} class="me-1" /> Gematria</h5>

		<ul class="list-unstyled">
			<li><InputExample {clickFunction} query="Calculate Gematria of תורה." /></li>
			<li><InputExample {clickFunction} query="Calculate Mispar Gadol of מלך." /></li>
			<li><InputExample {clickFunction} query="Calculate Mispar Siduri of פרעה." /></li>
			<li><InputExample {clickFunction} query="Calculate Mispar Katan Mispari of משיח." /></li>
			<li><InputExample {clickFunction} query="Calculate AvGad of משה." /></li>
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
