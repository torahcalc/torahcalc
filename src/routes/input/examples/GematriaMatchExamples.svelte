<script>
	import { faTableColumns } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Gematria Two-Word Match"
	icon={faTableColumns}
	color="blue"
	{clickFunction}
	queries={['Gematria equivalences for תורה and משנה.', 'Gematria equivalences for תפילין and חיים with Mispar Kolel.', 'Gematria equivalences for תורה and משנה in the same method.']}
/>
