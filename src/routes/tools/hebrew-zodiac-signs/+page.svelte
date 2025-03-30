<script>
	import ZodiacCalculator from './ZodiacCalculator.svelte';

	const description = 'Enter your birthday and specify if you were born after sunset. Your full Hebrew birthday and your Hebrew astrology zodiac sign will be displayed (in Hebrew, transliterated Hebrew, and the Latin equivalent).';
</script>

<svelte:head>
	<title>TorahCalc | Hebrew Zodiac Sign Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Hebrew Zodiac Sign Calculator</h1>

	<p class="center">{description}</p>

	<ZodiacCalculator />
</section>
