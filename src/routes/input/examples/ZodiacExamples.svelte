<script>
	import { faSolarSystem } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;

</script>

<InputExampleCategory
	
	title="Hebrew Zodiac Signs"
	icon={faSolarSystem}
	color="purple"
	{clickFunction}
	queries={['What is the zodiac sign for March 27, 1989?', 'What is the zodiac sign for 1 Teves?', 'What is the zodiac sign for December 1, 1979?', 'What is the zodiac sign for 11 Nissan?']}
/>
