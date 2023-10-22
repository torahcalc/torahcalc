<script>
	import InputCalculator from '../../input/InputCalculator.svelte';
	import GematriaMatchExamples from '../../input/examples/GematriaMatchExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const description = 'Enter two words and the gematria of each will be calculated according to 25 methods and a list of methods where the words have an equivalent value will be displayed.';
</script>

<svelte:head>
	<title>TorahCalc | Gematria Two-Word Match</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Gematria Two-Word Match</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} queryInput="Gematria equivalences for תורה and משנה." />

	<div class="examples">
		<GematriaMatchExamples {clickFunction} />
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
