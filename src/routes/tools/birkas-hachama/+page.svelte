<script>
	import BirkasHachamaCalculator from './BirkasHachamaCalculator.svelte';

	const description = 'Calculate when Birkas Hachama will occur and when it has occurred in the past.';
</script>

<svelte:head>
	<title>TorahCalc | Birkas Hachama Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Birkas Hachama Calculator</h1>

	<p class="center">{description}</p>

	<BirkasHachamaCalculator />
</section>
