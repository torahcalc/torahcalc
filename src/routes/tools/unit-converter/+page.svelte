<script>
	import InputCalculator from '../../input/InputCalculator.svelte';
	import UnitConversionExamples from '../../input/examples/UnitConversionExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const description = 'Convert between any Biblical and modern units of length, area, volume, mass (weight), coins, and time.';
</script>

<svelte:head>
	<title>TorahCalc | Biblical and Talmudic Unit Converter</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Biblical and Talmudic Unit Converter</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} queryInput="Convert 3 Tefachim to inches" />

	<div class="examples">
		<UnitConversionExamples {clickFunction} />
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
