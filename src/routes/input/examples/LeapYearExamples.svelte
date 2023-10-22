<script>
	import { faCalendarPlus } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Leap Years"
	icon={faCalendarPlus}
	color="red"
	{clickFunction}
	queries={['Is this year a leap year?', 'Was 5775 a leap year?', 'Will 5790 be a leap year?', 'Is next year a leap year?', 'Is Gregorian year 2023 a leap year?', 'Is Hebrew year 5784 a leap year?']}
/>
