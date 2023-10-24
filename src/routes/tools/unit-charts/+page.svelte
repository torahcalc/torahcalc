<script>
	import { getConverters } from '$lib/js/unitconverter';
	import Fa from 'svelte-fa/src/fa.svelte';
	import MultiUnitConverter from './MultiUnitConverter.svelte';
	import { faExternalLink } from '@danieloi/pro-solid-svg-icons';

	const description = 'Enter a number into any box to convert from that unit to all of the other biblical and standard units in the charts simultaneously.';
</script>

<svelte:head>
	<title>TorahCalc | Biblical and Talmudic Unit Charts</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Biblical and Talmudic Unit Charts</h1>

	<p class="center">{description}</p>

	<MultiUnitConverter />

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
