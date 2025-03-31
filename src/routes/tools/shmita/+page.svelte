<script>
	import ShmitaCalculator from './ShmitaCalculator.svelte';

	const description = 'Calculate when Shmita will occur and when it has occurred in the past.';
</script>

<svelte:head>
	<title>TorahCalc | Shmita Year Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Shmita Year Calculator</h1>

	<p class="center">{description}</p>

	<ShmitaCalculator />
</section>
