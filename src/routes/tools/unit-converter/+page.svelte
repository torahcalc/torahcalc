<script>
	import UnitConverter from './UnitConverter.svelte';

	const description = 'Convert between any Biblical and modern units of length, area, volume, mass (weight), coins, and time.';
</script>

<svelte:head>
	<title>TorahCalc | Biblical and Talmudic Unit Converter</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Biblical and Talmudic Unit Converter</h1>

	<p class="center">{description}</p>

	<UnitConverter />

	<div class="card flex-card center">
		<a href="/info/biblical-units">Information about Biblical Units and Sources</a>
	</div>
</section>
