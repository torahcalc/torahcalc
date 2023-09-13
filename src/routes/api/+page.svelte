<script>
	import { HDate } from '@hebcal/core';
	import Endpoint from './Endpoint.svelte';
</script>

<svelte:head>
	<title>TorahCalc | API</title>
	<meta name="description" content="TorahCalc API" />
</svelte:head>

<section>
	<h1>TorahCalc API</h1>

	<p>Welcome to the TorahCalc API. This API is currently in beta, and is subject to change.</p>

	<h2>Endpoints</h2>

	<Endpoint
		method="GET"
		endpoint="/api/leapyears/hebrew"
		description="Check if a year is a leap year in the Hebrew calendar"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The year to check (defaults to current year)',
				example: new HDate().getFullYear(),
			},
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/leapyears/gregorian"
		description="Check if a year is a leap year in the Gregorian calendar"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The year to check (defaults to current year)',
				example: new Date().getFullYear(),
			},
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/dateconverter/gregtoheb"
		description="Convert a Gregorian date to a Hebrew date"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The Gregorian year (defaults to current year)',
				example: new Date().getFullYear(),
			},
			{
				name: 'month',
				type: 'Number',
				required: false,
				description: 'The Gregorian month 1-12 (defaults to current month)',
				example: new Date().getMonth() + 1,
			},
			{
				name: 'day',
				type: 'Number',
				required: false,
				description: 'The Gregorian day 1-31 (defaults to current day)',
				example: new Date().getDate(),
			},
			{
				name: 'afterSunset',
				type: 'Boolean',
				required: false,
				description: 'Whether the date is after sunset (defaults to false)',
				example: false,
			},
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/dateconverter/hebtogreg"
		description="Convert a Hebrew date to a Gregorian date"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The Hebrew year (defaults to current year)',
				example: new HDate().getFullYear(),
			},
			{
				name: 'month',
				type: 'Number',
				required: false,
				description:
					'The Hebrew month - 1=NISSAN, 2=IYAR, 3=SIVAN, 4=TAMMUZ, 5=AV, 6=ELUL, 7=TISHREI, 8=CHESHVAN, 9=KISLEV, 10=TEVET, 11=SHEVAT, 12=ADAR, 13=ADAR II (defaults to current month)',
				example: new HDate().getMonth(),
			},
			{
				name: 'day',
				type: 'Number',
				required: false,
				description: 'The Hebrew day 1-30 (defaults to current day)',
				example: new HDate().getDate(),
			},
			{
				name: 'afterSunset',
				type: 'Boolean',
				required: false,
				description: 'Whether the date is after sunset of the previous day (defaults to false)',
				example: false,
			},
		]}
	/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 0.6;
	}
</style>
