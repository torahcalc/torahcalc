<script>
	import { page } from '$app/stores';
	import InputCalculator from '../../input/InputCalculator.svelte';
	import JewishHolidayExamples from '../../input/examples/JewishHolidayExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const description = 'Enter a Gregorian or Hebrew Year below to display the dates for Jewish holidays for the given year, or enter a Jewish holiday to find out when it will occur in a given year.';

	/** @type {string} The current query in the input box (not yet submitted) */
	export let queryInput = $page.url.searchParams.get('q') ?? 'Upcoming Jewish holidays';
</script>

<svelte:head>
	<title>TorahCalc | Jewish Holidays</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Jewish Holidays</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} {queryInput} />

	<div class="examples">
		<JewishHolidayExamples {clickFunction} />
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
