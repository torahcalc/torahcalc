<script>
	import LeapYear from './LeapYear.svelte';
</script>

<svelte:head>
	<title>Leap Years</title>
	<meta name="description" content="Calculate leap years in the Hebrew and Gregorian calendars." />
</svelte:head>

<section>
	<h1>Calculate Leap Years</h1>

	<LeapYear />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 0.6;
	}
</style>
