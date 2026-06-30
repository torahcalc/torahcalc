<script>
	import ParshaCalculator from './ParshaCalculator.svelte';

	const description =
		'Enter a date to calculate the weekly Torah portion (parsha) for that week. If the date is not a Saturday, the parsha of the following Shabbos is shown. Choose between the Diaspora and Israel reading schedules.';
</script>

<svelte:head>
	<title>TorahCalc | Weekly Torah Portion (Parsha) Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Weekly Torah Portion (Parsha) Calculator</h1>

	<p class="center">{description}</p>

	<ParshaCalculator />
</section>
