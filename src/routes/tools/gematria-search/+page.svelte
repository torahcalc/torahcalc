<script>
	import GematriaSearchCalculator from './GematriaSearchCalculator.svelte';

	const description = 'Enter a number or a word to calculate its gematria (numerical value) and find common Hebrew words and words and verses in the Torah with an equivalent gematria value.';
</script>

<svelte:head>
	<title>TorahCalc | Gematria Search</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Gematria Search</h1>

	<p class="center">{description}</p>

	<GematriaSearchCalculator />
</section>
