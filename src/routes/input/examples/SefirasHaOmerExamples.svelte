<script>
	import { faWheatAlt } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;

</script>

<InputExampleCategory
	
	title="Sefiras HaOmer"
	icon={faWheatAlt}
	color="brown"
	{clickFunction}
	queries={['Sefiras Haomer for tonight', 'Day of Omer on May 12, 2023', 'Day of Omer on April 17, 2023 at night', 'Day of Omer on 18 Iyar']}
/>
