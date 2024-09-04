<script>
	import { page } from '$app/stores';
	import { hebrewMonthMap } from '$lib/js/dateconverter';
	import { getNextHebrewMonth } from '$lib/js/utils';
	import InputCalculator from '../../input/InputCalculator.svelte';
	import MoladExamples from '../../input/examples/MoladExamples.svelte';

	/** @type {InputCalculator} */
	let inputCalculator;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	$: clickFunction = inputCalculator?.setSections;

	const description = 'Calculate the molad for any month in the Hebrew calendar.';

	const nextHebrewMonth = getNextHebrewMonth();
	const monthName = `${hebrewMonthMap[nextHebrewMonth.month]} ${nextHebrewMonth.year}`;

	/** @type {string} The current query in the input box (not yet submitted) */
	export let queryInput = $page.url.searchParams.get('q') ?? `Calculate the molad of ${monthName}.`;
</script>

<svelte:head>
	<title>TorahCalc | Molad Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Molad Calculator</h1>

	<p class="center">{description}</p>

	<InputCalculator bind:this={inputCalculator} {queryInput} />

	<div class="examples">
		<MoladExamples {clickFunction} />
	</div>

	<div class="card flex-card mt-0">
		<h3>About the Molad:</h3>
		<ul>
			<li>The molad is the time of the "birth" of the new moon (i.e. when the moon has moved far enough away from the line of sight of the Sun to become visible again).</li>
			<li>The average amount of time between one molad and the next is 29 days, 12 hours, and 793 chalakim*.</li>
			<li>Rosh Chodesh usually falls around the time of the molad.</li>
			<li>
				During the blessing of the new month which is said in the synagogue on the Shabbos before Rosh Chodesh, the time of the molad in Jerusalem is announced, usually by announcing the day of the
				week followed by the time in minutes and chalakim after the hour.
			</li>
		</ul>
		<p>* Times shown are for Jerusalem. In all locations, times are announced for Jerusalem.</p>
		<p>* A Chelek (pl. Chalakim) is a halachik measurement of time equal to 1/18 of a minute. <a href="/info/biblical-units/#time">More info.</a></p>
	</div>
</section>

<style>
	.examples {
		margin: 0.5rem;
	}
</style>
