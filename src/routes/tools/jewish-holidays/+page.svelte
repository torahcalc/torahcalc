<script>
	import HolidayCalculator from './HolidayCalculator.svelte';

	const description = 'Enter a Gregorian or Hebrew Year below to display the dates for Jewish holidays for the given year, or enter a Jewish holiday to find out when it will occur in a given year.';
</script>

<svelte:head>
	<title>TorahCalc | Jewish Holidays</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Jewish Holidays</h1>

	<p class="center">{description}</p>

	<HolidayCalculator />
</section>
