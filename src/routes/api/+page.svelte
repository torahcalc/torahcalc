<script>
	import Endpoint from './Endpoint.svelte';
</script>

<svelte:head>
	<title>API</title>
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
				description: 'The year to check',
				example: new Date().getFullYear() + 3760
			}
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
				description: 'The year to check',
				example: new Date().getFullYear()
			}
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
