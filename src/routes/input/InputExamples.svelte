<script>
	import UnitConversionExamples from './examples/UnitConversionExamples.svelte';
	import GematriaExamples from './examples/GematriaExamples.svelte';
	import BirkasHachamaExamples from './examples/BirkasHachamaExamples.svelte';
	import GematriaSearchExamples from './examples/GematriaSearchExamples.svelte';
	import GematriaMatchExamples from './examples/GematriaMatchExamples.svelte';
	import HebrewCalendarExamples from './examples/HebrewCalendarExamples.svelte';
	import JewishHolidayExamples from './examples/JewishHolidayExamples.svelte';
	import LeapYearExamples from './examples/LeapYearExamples.svelte';
	import DailyLearningExamples from './examples/DailyLearningExamples.svelte';
	import MoladExamples from './examples/MoladExamples.svelte';
	import SefirasHaOmerExamples from './examples/SefirasHaOmerExamples.svelte';
	import ZmanimExamples from './examples/ZmanimExamples.svelte';
	import ZodiacExamples from './examples/ZodiacExamples.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;
</script>

<div class="card flex-card examples">
	<h4 class="mb-4">Examples of what you can enter</h4>

	<div class="row g-2 categories">
		<div class="col-md-6"><UnitConversionExamples {clickFunction} /></div>
		<div class="col-md-6"><GematriaExamples {clickFunction} /></div>
		<div class="col-md-6"><GematriaSearchExamples {clickFunction} /></div>
		<div class="col-md-6"><GematriaMatchExamples {clickFunction} /></div>
		<div class="col-md-6"><HebrewCalendarExamples {clickFunction} /></div>
		<div class="col-md-6"><JewishHolidayExamples {clickFunction} /></div>
		<div class="col-md-6"><LeapYearExamples {clickFunction} /></div>
		<div class="col-md-6"><DailyLearningExamples {clickFunction} /></div>
		<div class="col-md-6"><MoladExamples {clickFunction} /></div>
		<div class="col-md-6"><SefirasHaOmerExamples {clickFunction} /></div>
		<div class="col-md-6"><ZmanimExamples {clickFunction} /></div>
		<div class="col-md-6"><ZodiacExamples {clickFunction} /></div>
		<div class="col-md-6"><BirkasHachamaExamples {clickFunction} /></div>
	</div>
</div>

<style>
	.examples {
		padding: 1rem;
	}
	.examples > h4 {
		padding-top: 1rem;
		padding-left: 1rem;
	}
</style>
