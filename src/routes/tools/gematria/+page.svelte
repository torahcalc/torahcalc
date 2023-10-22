<script>
	import InputCalculator from '../../input/InputCalculator.svelte';
	import GematriaExamples from '../../input/examples/GematriaExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const description = 'Calculate the Gematria according to 25+ different methods.';
</script>

<svelte:head>
	<title>TorahCalc | Gematria Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Gematria Calculator</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} queryInput="Calculate the Gematria of תורה." />

	<div class="examples">
		<GematriaExamples {clickFunction} />
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
