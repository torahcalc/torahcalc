<script>
	import { faSunrise } from '@danieloi/pro-solid-svg-icons';
	import AvailableOptionsList from '../AvailableOptionsList.svelte';
	import InputExampleCategory from '../InputExampleCategory.svelte';
	import { ZMANIM_NAMES } from '$lib/js/zmanim';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;

	/** @type {string[]} The list of zmanim */
	const zmanimList = [];
	for (const zmanimType of Object.keys(ZMANIM_NAMES)) {
		// @ts-ignore - assume key exists
		zmanimList.push(...Object.values(ZMANIM_NAMES[zmanimType]).map((zmanim) => zmanim.name));
	}

</script>

<InputExampleCategory
	
	title="Zmanim"
	icon={faSunrise}
	color="orange"
	{clickFunction}
	queries={[
		'What time is Chatzos in New York?',
		'Zmanim for Denver',
		'Zmanim for 1 Teves 5784 in Jerusalem',
		'What time is sunset on 12/25/2023 in Los Angeles?',
		'How long is a Shaah Zmanis in 31.776, 35.23?',
	]}
>
	<details>
		<summary>Show list of zmanim</summary>

		<AvailableOptionsList array={zmanimList} />
	</details>
</InputExampleCategory>
