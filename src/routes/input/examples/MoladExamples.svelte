<script>
	import { faEclipse } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;

</script>

<InputExampleCategory
	
	title="Molad"
	icon={faEclipse}
	color="teal"
	{clickFunction}
	queries={['Calculate the molad of Sivan 5781.', 'When will the molad of Elul be?', 'When is the next molad?', 'Calculate molados for 5781.']}
/>
