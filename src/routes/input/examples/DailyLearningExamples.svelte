<script>
	import { faBookOpenCover } from '@danieloi/pro-solid-svg-icons';
	import AvailableOptionsList from '../AvailableOptionsList.svelte';
	import InputExampleCategory from '../InputExampleCategory.svelte';
	import { LEARNING_TYPE_NAMES } from '$lib/js/dailylearning';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Daily Learning / Daf Yomi"
	icon={faBookOpenCover}
	color="blue-grey"
	{clickFunction}
	queries={[
		"What is today's Daf Yomi?",
		'What is the Daf Yomi for tomorrow?',
		'What is the Nach Yomi for May 12, 2023?',
		'What are the daily psalms for tomorrow?',
		'What is the Weekly Daf for 18 Iyar?',
	]}
>
	<details>
		<summary>Show list of daily learning types</summary>

		<AvailableOptionsList array={Object.values(LEARNING_TYPE_NAMES)} />
	</details>
</InputExampleCategory>
