<script>
	import { faCalendarStar } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;

</script>

<InputExampleCategory
	
	title="Jewish Holidays"
	icon={faCalendarStar}
	color="cyan"
	{clickFunction}
	queries={[
		'When is Rosh Hashana?',
		'When did Pesach fall last year?',
		'When is the next Rosh Chodesh?',
		'List Jewish holidays in Hebrew year 5784.',
		'List Jewish holidays in Gregorian year 2023.',
		'List upcoming Jewish holidays.',
	]}
/>
