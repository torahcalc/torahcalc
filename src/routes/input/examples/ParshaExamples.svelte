<script>
	import { faScrollTorah } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Weekly Torah Portion (Parsha)"
	icon={faScrollTorah}
	color="brown"
	{clickFunction}
	queries={[
		'What parsha is it this week?',
		'What parsha is it this week in Israel?',
		'What parsha will it be next week?',
		'What was the parsha on June 6, 2026?',
		'What will the parsha be on 8 Sivan, 5787?',
		'What sedra was it last week in the diaspora?',
	]}
/>
