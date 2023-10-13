<script>
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faCalculator, faSunrise, faScaleBalanced, faCalendarAlt, faMoonOverSun, faWheatAlt } from '@danieloi/pro-solid-svg-icons';
	import { getConverters, getUnit, getUnits } from '$lib/js/unitconverter';
	import { METHOD_NAMES } from '$lib/js/gematria';
	import { ZMANIM_NAMES } from '$lib/js/zmanim';
	import InputExample from './InputExample.svelte';
	import AvailableOptionsList from './AvailableOptionsList.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;

	const converters = getConverters(false);

	/** @type {string[]} The list of zmanim */
	const zmanimList = [];
	for (const zmanimType of Object.keys(ZMANIM_NAMES)) {
		// @ts-ignore - assume key exists
		zmanimList.push(...Object.values(ZMANIM_NAMES[zmanimType]).map((zmanim) => zmanim.name));
	}
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

	<div class="mb-4">
		<h5><Fa icon={faSunrise} class="me-1" /> Zmanim</h5>

		<ul class="list-unstyled">
			<li><InputExample {clickFunction} query="What time is Chatzos in New York?" /></li>
			<li><InputExample {clickFunction} query="Zmanim for Denver" /></li>
			<li><InputExample {clickFunction} query="Zmanim for 1 Teves 5784 in Jerusalem" /></li>
			<li><InputExample {clickFunction} query="What time is sunset on December 25, 2023 in Los Angeles?" /></li>
			<li><InputExample {clickFunction} query="How long is a Shaah Zmanis in 31.776, 35.23?" /></li>
		</ul>

		<div>
			<details>
				<summary>Show list of zmanim</summary>

				<AvailableOptionsList array={zmanimList} />
			</details>
		</div>
	</div>

	<div class="mb-4">
		<h5><Fa icon={faCalendarAlt} class="me-1" /> Hebrew calendar</h5>

		<ul class="list-unstyled">
			<li><InputExample {clickFunction} query="Convert 21 Kislev, 5730 to Gregorian calendar." /></li>
			<li><InputExample {clickFunction} query="Convert December 1, 1969 to Hebrew calendar." /></li>
			<li><InputExample {clickFunction} query="Convert December 1, 1969 after sunset to Hebrew calendar." /></li>
			<li><InputExample {clickFunction} query="Convert 5780 to Gregorian calendar." /></li>
			<li><InputExample {clickFunction} query="When will 14 Nissan fall next year?" /></li>
			<li><InputExample {clickFunction} query="Today's date on Hebrew calendar." /></li>
		</ul>
	</div>

	<div class="mb-4">
		<h5><Fa icon={faMoonOverSun} class="me-1" /> Molad</h5>

		<ul class="list-unstyled">
			<li><InputExample {clickFunction} query="Calculate the molad of Sivan 5781." /></li>
			<li><InputExample {clickFunction} query="When will the molad of Elul be?" /></li>
			<li><InputExample {clickFunction} query="When is the next molad?" /></li>
			<li><InputExample {clickFunction} query="Calculate molados for 5781." /></li>
		</ul>
	</div>

	<div class="mb-4">
		<h5><Fa icon={faWheatAlt} class="me-1" /> Sefiras HaOmer</h5>
		<ul class="list-unstyled">
			<li><InputExample {clickFunction} query="Sefiras Haomer for tonight" /></li>
			<li><InputExample {clickFunction} query="Day of Omer on May 12, 2023" /></li>
			<li><InputExample {clickFunction} query="Day of Omer on April 17, 2023 at night" /></li>
			<li><InputExample {clickFunction} query="Day of Omer on 18 Iyar" /></li>
		</ul>
	</div>

	<h6>More input types coming soon!</h6>
</div>
