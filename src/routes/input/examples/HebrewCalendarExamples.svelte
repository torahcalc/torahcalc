<script>
	import { faCalendarAlt } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Hebrew Calendar"
	icon={faCalendarAlt}
	color="magenta"
	{clickFunction}
	queries={[
		'Convert 21 Kislev, 5730 to Gregorian calendar.',
		'Convert December 1, 1969 to Hebrew calendar.',
		'Convert December 1, 1969 after sunset.',
		'Convert 5780 to Gregorian calendar.',
		'When will 14 Nissan fall next year?',
		"Today's date on Hebrew calendar.",
	]}
/>
