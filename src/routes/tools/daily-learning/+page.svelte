<script>
	import DailyLearningCalculator from './DailyLearningCalculator.svelte';

	const description =
		'Calculate the Daf Yomi, Mishnah Yomi, Nach Yomi, Yerushalmi Yomi, Chofetz Chaim, Daily Rambam, Shemirat HaLashon, Daily Psalms, Weekly Daf, Arukh HaShulchan, and Pirkei Avot for any date.';
</script>

<svelte:head>
	<title>TorahCalc | Daf Yomi and Other Daily Learning</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Daf Yomi and Other Daily Learning</h1>

	<p class="center">{description}</p>

	<DailyLearningCalculator />
</section>
