<script>
	import { faSunPlantWilt } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<InputExampleCategory
	title="Shmita Years"
	icon={faSunPlantWilt}
	color="brown"
	{clickFunction}
	queries={['When is the next Shmita year?', 'When was the last Shmita year?', `When will Shmita be after ${new Date().getFullYear()}?`, 'When was Shmita before 5782?', 'Is 5789 a Shmita year?']}
/>
