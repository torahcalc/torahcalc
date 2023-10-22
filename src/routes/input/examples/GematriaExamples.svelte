<script>
	import { faCalculator } from '@danieloi/pro-solid-svg-icons';
	import AvailableOptionsList from '../AvailableOptionsList.svelte';
	import InputExampleCategory from '../InputExampleCategory.svelte';
	import { METHOD_NAMES } from '$lib/js/gematria';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Gematria"
	icon={faCalculator}
	color="indigo"
	{clickFunction}
	queries={[
		'Calculate Gematria of תורה.',
		'Calculate Mispar Gadol of מלך.',
		'Calculate Mispar Siduri of פרעה.',
		'Calculate Mispar Katan Mispari of משיח.',
		'Calculate Atbash of תורה.',
		'Calculate AvGad of משה.',
	]}
>
	<details>
		<summary>Show list of gematria methods</summary>

		<AvailableOptionsList array={Object.values(METHOD_NAMES).map((method) => method.name)} />
	</details>
</InputExampleCategory>
