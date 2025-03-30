<script>
	import ZmanimCalculator from './ZmanimCalculator.svelte';

	const description = 'Calculate the halachic times of the day for any date and location.';
</script>

<svelte:head>
	<title>TorahCalc | Zmanim Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Zmanim Calculator</h1>

	<p class="center">{description}</p>

	<ZmanimCalculator />
</section>
