<script>
	import DateConverter from './DateConverter.svelte';
</script>

<svelte:head>
	<title>TorahCalc | Date Converter</title>
	<meta name="description" content="Convert dates between the Hebrew and Gregorian calendars." />
</svelte:head>

<section>
	<h1 class="heading">Hebrew Date Converter</h1>

	<p class="center">Enter a Gregorian calendar date or a Hebrew calendar date to convert between the two calendars.</p>

	<DateConverter />
</section>
