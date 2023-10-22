<script>
	import { getConverters, getUnit, getUnits } from '$lib/js/unitconverter';
	import { faScaleBalanced } from '@danieloi/pro-solid-svg-icons';
	import AvailableOptionsList from '../AvailableOptionsList.svelte';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	const converters = getConverters(false);

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Unit Conversions"
	icon={faScaleBalanced}
	color="green"
	{clickFunction}
	queries={[
		'Convert 3 Tefachim to inches.',
		'How many Amos are in a Parsah?',
		'Convert 40 Seah to US liquid gallons.',
		'Convert 1 US Dollar to Perutos.',
		'How many Chalakim are in an hour?',
		'Conversion chart for 1 Mil',
	]}
>
	{#await converters then converters}
		<details>
			<summary>Show list of units</summary>

			<AvailableOptionsList mapping={getUnits(converters)} transform={async ([unitType, unitId]) => (await getUnit(unitType, unitId)).display} />
		</details>
	{:catch}
		<div>An error occurred while loading the list of units.</div>
	{/await}
</InputExampleCategory>
