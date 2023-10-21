<script>
	import { faSunBright } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Birkas Hachama"
	icon={faSunBright}
	color="green"
	{clickFunction}
	queries={['When is the next Birkas Hachama?', 'When was the last Birkas Hachama?', 'When will Birkas Hachama be after 2037?', 'When was Birkas Hachama before 2009?']}
/>
