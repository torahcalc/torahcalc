<script>
	import { faListCheck } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Gematria Search"
	icon={faListCheck}
	color="purple"
	{clickFunction}
	queries={['What words have a gematria of 613?', 'What words have the same gematria as תורה?', 'What pesukim have a gematria of 930?']}
/>
