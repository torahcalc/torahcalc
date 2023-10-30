<script>
	import { faSunPlantWilt } from '@danieloi/pro-solid-svg-icons';
	import InputExampleCategory from '../InputExampleCategory.svelte';
	import { previousShmita, nextShmita } from '$lib/js/shmita';
	import { HDate } from '@hebcal/core';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;

	const lastShmitaYear = previousShmita(new HDate().getFullYear(), false);
	const nextShmitaYear = nextShmita(new HDate().getFullYear(), false);
</script>

<InputExampleCategory
	title="Shmita Years"
	icon={faSunPlantWilt}
	color="brown"
	{clickFunction}
	queries={[
		'When is the next Shmita year?',
		'When was the last Shmita year?',
		`When will Shmita be after ${new Date().getFullYear()}?`,
		`When was Shmita before ${lastShmitaYear}?`,
		`Is ${nextShmitaYear} a Shmita year?`,
	]}
/>
