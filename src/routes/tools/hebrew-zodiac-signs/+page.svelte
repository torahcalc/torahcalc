<script>
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import InputCalculator from '../../input/InputCalculator.svelte';
	import ZodiacExamples from '../../input/examples/ZodiacExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const today = dayjs().format('MMMM D, YYYY');

	const description =
		'Enter your birthday and specify if you were born after sunset. Your full Hebrew birthday and your Hebrew astrology zodiac sign will be displayed (in Hebrew, transliterated Hebrew, and the Latin equivalent).';

	/** @type {string} The current query in the input box (not yet submitted) */
	export let queryInput = $page.url.searchParams.get('q') ?? `What is the zodiac sign for ${today}?`;
</script>

<svelte:head>
	<title>TorahCalc | Hebrew Zodiac Signs</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Hebrew Zodiac Signs</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} {queryInput} />

	<div class="examples">
		<ZodiacExamples {clickFunction} />
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
