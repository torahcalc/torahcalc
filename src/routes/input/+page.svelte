<script>
	import InputCalculator from './InputCalculator.svelte';
	import InputExamples from './InputExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const description = 'Use natural words to input what you want to calculate.';
</script>

<svelte:head>
	<title>TorahCalc | English Text Input Calculator for Torah Study</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">TorahCalc English Input Calculator</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} />

	<InputExamples {clickFunction} />
</section>
