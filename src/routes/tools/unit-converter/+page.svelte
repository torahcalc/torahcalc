<script>
	import { getConverters } from '$lib/js/unitconverter';
	import Fa from 'svelte-fa/src/fa.svelte';
	import UnitConverter from './UnitConverter.svelte';
	import { faExternalLink } from '@danieloi/pro-solid-svg-icons';

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
		<span>
			<a href="/info/biblical-units"><Fa icon={faExternalLink} size=".9x" /> Information about Biblical Units and Sources</a>
		</span>
		{#await getConverters() then converters}
			<br />
			<span>Currency conversions use <a target="_blank" href="https://apilayer.com/marketplace/exchangerates_data-api">exchange rates</a> as of {converters.coins.units.usd.updated}</span>
		{/await}
	</div>
</section>
