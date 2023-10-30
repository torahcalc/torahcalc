<script>
	import InputCalculator from '../../input/InputCalculator.svelte';
	import ShmitaExamples from '../../input/examples/ShmitaExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const description = 'Calculate when Shmita will occur and when it has occurred in the past.';
</script>

<svelte:head>
	<title>TorahCalc | Shmita Years</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Shmita Years</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} queryInput="When is the next Shmita year?" />

	<div class="examples">
		<ShmitaExamples {clickFunction} />
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
