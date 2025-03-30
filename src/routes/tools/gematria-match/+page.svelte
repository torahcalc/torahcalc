<script>
	import GematriaTwoWordMatchCalculator from './GematriaTwoWordMatchCalculator.svelte';

	const description = 'Enter two words and the gematria of each will be calculated according to 25 methods and a list of methods where the words have an equivalent value will be displayed.';
</script>

<svelte:head>
	<title>TorahCalc | Gematria Two-Word Match</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Gematria Two-Word Match</h1>

	<p class="center">{description}</p>

	<GematriaTwoWordMatchCalculator />
</section>
