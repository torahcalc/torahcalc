<script>
	import MoladCalculator from './MoladCalculator.svelte';

	const description = 'Calculate the molad for any month in the Hebrew calendar.';
</script>

<svelte:head>
	<title>TorahCalc | Molad Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Molad Calculator</h1>

	<p class="center">{description}</p>

	<MoladCalculator />
</section>
