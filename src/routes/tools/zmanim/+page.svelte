<script>
	import dayjs from 'dayjs';
	import InputCalculator from '../../input/InputCalculator.svelte';
	import ZmanimExamples from '../../input/examples/ZmanimExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const description = 'Calculate the halachic times of the day for any date and location.';

	const today = dayjs().format('MMMM D, YYYY');
</script>

<svelte:head>
	<title>TorahCalc | Zmanim Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Zmanim Calculator</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} queryInput="Zmanim for Denver on {today}" />

	<div class="examples">
		<ZmanimExamples {clickFunction} />
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
