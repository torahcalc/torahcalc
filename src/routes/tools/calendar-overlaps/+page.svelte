<script>
	import CalendarOverlaps from './CalendarOverlaps.svelte';
</script>

<svelte:head>
	<title>TorahCalc | Calendar Overlaps</title>
	<meta
		name="description"
		content="Find when a specific Gregorian date overlaps with a specific Hebrew date across the years."
	/>
</svelte:head>

<section>
	<h1 class="heading">Calendar Overlap Finder</h1>

	<p class="center">
		Enter a Gregorian date (month and day) and a Hebrew date (month and day) to find all occurrences where they overlap in the past 100 years and next 100 years.
	</p>

	<CalendarOverlaps />
</section>
