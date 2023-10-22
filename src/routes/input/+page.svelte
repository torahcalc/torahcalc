<script>
	import InputCalculator from './InputCalculator.svelte';
	import InputExamples from './InputExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;
</script>

<svelte:head>
	<title>TorahCalc | English Text Input Calculator</title>
	<meta name="description" content="Use natural words to input what you want to calculate." />
</svelte:head>

<section>
	<h1 class="heading">English Text Input Calculator <span class="experimental">Experimental</span></h1>

	<InputCalculator bind:this={inputCalculator} />

	<InputExamples {clickFunction} />
</section>

<style>
	.experimental {
		font-size: 0.5em;
		color: #999;
	}
</style>
