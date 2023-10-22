<script>
	import InputCalculator from '../../input/InputCalculator.svelte';
	import GematriaSearchExamples from '../../input/examples/GematriaSearchExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const description = 'Enter a number or a word to calculate its gematria (numerical value) and find common Hebrew words and words in the Torah with an equivalent gematria value.';
</script>

<svelte:head>
	<title>TorahCalc | Gematria Search</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Gematria Search</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} queryInput="What words have a gematria of 613?" />

	<div class="examples">
		<GematriaSearchExamples {clickFunction} />
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
