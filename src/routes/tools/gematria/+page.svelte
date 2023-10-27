<script>
	import GematriaCalculator from './GematriaCalculator.svelte';

	const description = 'Calculate the Gematria according to 25+ different methods.';
</script>

<svelte:head>
	<title>TorahCalc | Gematria Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Gematria Calculator</h1>

	<p class="center">{description}</p>

	<GematriaCalculator />
</section>
