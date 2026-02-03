<script>
	import { faBook } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Tanach Stats"
	icon={faBook}
	color="teal"
	{clickFunction}
	queries={[
		'How many chapters are in the Torah?',
		'How many verses are in Parshas Bereishis?',
		'How many words in Psalms?',
		'How many letters are in Tanach?',
		'How many parshiyos are in Sefer Shemos?',
		'How many words in Trei Asar?',
	]}
/>
