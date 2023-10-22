<script>
	import InputCalculator from '../../input/InputCalculator.svelte';
	import BirkasHachamaExamples from '../../input/examples/BirkasHachamaExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const description = 'Calculate when Birkas Hachama will occur and when it has occurred in the past.';
</script>

<svelte:head>
	<title>TorahCalc | Birkas Hachama</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Birkas Hachama</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} queryInput="When is the next Birkas Hachama?" />

	<div class="examples">
		<BirkasHachamaExamples {clickFunction} />
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
