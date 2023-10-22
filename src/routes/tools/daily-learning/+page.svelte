<script>
	import dayjs from 'dayjs';
	import InputCalculator from '../../input/InputCalculator.svelte';
	import DailyLearningExamples from '../../input/examples/DailyLearningExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const today = dayjs().format('MMMM D, YYYY');

	const description = 'Calculate the Daf Yomi, Nach Yomi, Yerushalmi Yomi, Chofetz Chaim, Daily Rambam, Shemirat HaLashon, Daily Psalms, and Weekly Daf for any date.';
</script>

<svelte:head>
	<title>TorahCalc | Daf Yomi and Other Daily Learning</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Daily Learning / Daf Yomi</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} queryInput="What is the Daf Yomi for {today}?" />

	<div class="examples">
		<DailyLearningExamples {clickFunction} />
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
