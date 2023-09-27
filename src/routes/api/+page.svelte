<script>
	import { HDate } from '@hebcal/core';
	import { getConverters, getUnits, getOpinions } from '$lib/js/unitconverter.js';
	import { LETTER_SPELLING_VALUES } from '$lib/js/gematria.js';
	import Endpoint from './Endpoint.svelte';
	import Toc from 'svelte-toc';
	import dayjs from 'dayjs';

	const converters = getConverters(false);

	const miluiParameters = Object.keys(LETTER_SPELLING_VALUES).map((letter) => {
		const titleCaseLetter = letter.charAt(0).toUpperCase() + letter.slice(1);
		let description = `The gematria of the spelling of ${titleCaseLetter} for Milui and Ne'elam calculations.`;
		/** @type {{ name: string, value: Number }[]} */
		// @ts-ignore - The index will always be an array of letter name/value pairs
		const spellings = LETTER_SPELLING_VALUES[letter];
		// @ts-ignore - The index will always be an array of letter name/value pairs
		if (spellings.length > 1) {
			const spellingText = spellings.map((spelling) => `<code>${spelling.value}</code> for "${spelling.name}"`).join(' or ');
			description += ` Use ${spellingText}.`;
		}
		description += ` Defaults to <code>${spellings[0].value}</code>, the value of "${spellings[0].name}".`;
		return {
			name: letter,
			type: 'Number',
			required: false,
			description: description,
			example: spellings[0].value,
		};
	});
</script>

<svelte:head>
	<title>TorahCalc | API</title>
	<meta name="description" content="TorahCalc API" />
</svelte:head>

<section>
	<h1 class="heading">TorahCalc API</h1>

	<p>Welcome to the TorahCalc API. This API is currently in beta, and is subject to change.</p>

	<h3>Leap Years</h3>

	<Endpoint
		method="GET"
		endpoint="/api/leapyears/hebrew"
		description="Check if a year is a leap year in the Hebrew calendar"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The year to check (defaults to current year)',
				example: new HDate().getFullYear(),
			},
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/leapyears/gregorian"
		description="Check if a year is a leap year in the Gregorian calendar"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The year to check (defaults to current year)',
				example: new Date().getFullYear(),
			},
		]}
	/>

	<h3>Date Converter</h3>

	<Endpoint
		method="GET"
		endpoint="/api/dateconverter/gregtoheb"
		description="Convert a Gregorian date to a Hebrew date"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The Gregorian year (defaults to current year)',
				example: new Date().getFullYear(),
			},
			{
				name: 'month',
				type: 'Number',
				required: false,
				description: 'The Gregorian month 1-12 (defaults to current month)',
				example: new Date().getMonth() + 1,
				allowedValues: { January: [1], February: [2], March: [3], April: [4], May: [5], June: [6], July: [7], August: [8], September: [9], October: [10], November: [11], December: [12] },
			},
			{
				name: 'day',
				type: 'Number',
				required: false,
				description: 'The Gregorian day 1-31 (defaults to current day)',
				example: new Date().getDate(),
			},
			{
				name: 'afterSunset',
				type: 'Boolean',
				required: false,
				description: 'Whether the date is after sunset (defaults to false)',
				example: false,
			},
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/dateconverter/hebtogreg"
		description="Convert a Hebrew date to a Gregorian date"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The Hebrew year (defaults to current year)',
				example: new HDate().getFullYear(),
			},
			{
				name: 'month',
				type: 'Number',
				required: false,
				description: 'The Hebrew month 1-13 where 1=Nissan (defaults to current month)',
				example: new HDate().getMonth(),
				allowedValues: { Nissan: [1], Iyar: [2], Sivan: [3], Tammuz: [4], Av: [5], Elul: [6], Tishrei: [7], Cheshvan: [8], Kislev: [9], Tevet: [10], Shevat: [11], Adar: [12], 'Adar II': [13] },
			},
			{
				name: 'day',
				type: 'Number',
				required: false,
				description: 'The Hebrew day 1-30 (defaults to current day)',
				example: new HDate().getDate(),
			},
			{
				name: 'afterSunset',
				type: 'Boolean',
				required: false,
				description: 'Whether the date is after sunset of the previous day (defaults to false)',
				example: false,
			},
		]}
	/>

	<h3>Birkas Hachama</h3>

	<Endpoint
		method="GET"
		endpoint="/api/hachama"
		description="Calculate the next Birkas Hachama date"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The Gregorian year. The Birkas Hachama date returned will be the occurrence on or after this year. Defaults to current year.',
				example: new Date().getFullYear(),
			},
		]}
	/>

	<h3>Molad</h3>

	<Endpoint
		method="GET"
		endpoint="/api/molad"
		description="Calculate the molad for a given Hebrew month"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The Hebrew year (defaults to current year)',
				example: new HDate().getFullYear(),
			},
			{
				name: 'month',
				type: 'Number',
				required: false,
				description: 'The Hebrew month 1-13 where 1=Nissan (defaults to current month)',
				example: new HDate().getMonth(),
				allowedValues: { Nissan: [1], Iyar: [2], Sivan: [3], Tammuz: [4], Av: [5], Elul: [6], Tishrei: [7], Cheshvan: [8], Kislev: [9], Tevet: [10], Shevat: [11], Adar: [12], 'Adar II': [13] },
			},
		]}
	/>

	<h3>Unit Converter</h3>

	{#await converters}
		<Endpoint method="GET" endpoint="/api/unitconverter" description="Loading..." parameters={[]} />
	{:then converters}
		<Endpoint
			method="GET"
			endpoint="/api/unitconverter"
			description="Convert between biblical and standard units of measurement"
			parameters={[
				{
					name: 'type',
					type: 'String',
					required: true,
					description: 'The type of unit to convert',
					example: 'length',
					allowedValues: Object.keys(converters),
				},
				{
					name: 'from',
					type: 'String',
					required: true,
					description: 'The unit to convert from',
					example: 'amah',
					allowedValues: getUnits(converters),
				},
				{
					name: 'to',
					type: 'String',
					required: true,
					description: 'The unit to convert to',
					example: 'meter',
					allowedValues: getUnits(converters),
				},
				{
					name: 'amount',
					type: 'Number',
					required: false,
					description: 'The amount to convert (defaults to 1)',
					example: 3,
				},
				{
					name: 'opinion',
					type: 'String',
					required: false,
					description: 'The opinion to use for the conversion when converting between biblical and standard units',
					example: 'rabbi_avraham_chaim_naeh',
					allowedValues: getOpinions(converters),
				},
			]}
		/>

		<Endpoint
			method="GET"
			endpoint="/api/unitcharts"
			description="Convert between a biblical or standard unit of measurement to all compatible units"
			parameters={[
				{
					name: 'type',
					type: 'String',
					required: true,
					description: 'The type of unit to convert',
					example: 'length',
					allowedValues: Object.keys(converters),
				},
				{
					name: 'from',
					type: 'String',
					required: true,
					description: 'The unit to convert from',
					example: 'derech_yom',
					allowedValues: getUnits(converters),
				},
				{
					name: 'amount',
					type: 'Number',
					required: false,
					description: 'The amount to convert (defaults to 1)',
					example: 1,
				},
				{
					name: 'opinion',
					type: 'String',
					required: false,
					description: 'The opinion to use for converting between biblical and standard units when applicable',
					example: 'rabbi_avraham_chaim_naeh',
					allowedValues: getOpinions(converters),
				},
			]}
		/>
	{:catch}
		<Endpoint method="GET" endpoint="/api/unitconverter" description="Error loading parameters" parameters={[]} />
	{/await}

	<h3>Gematria</h3>

	<Endpoint
		method="GET"
		endpoint="/api/gematria"
		description="Calculate the gematria of a word or phrase according to 25+ different methods"
		parameters={[
			{
				name: 'text',
				type: 'String',
				required: true,
				description: 'The Hebrew word or phrase to calculate the gematria of',
				example: 'תורה',
			},
			...miluiParameters,
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/gematriasearch"
		description="Search for words or verses with the same gematria as a given word or phrase"
		parameters={[
			{
				name: 'text',
				type: 'String',
				required: false,
				description: 'The Hebrew word or phrase to find matching words or verses for',
				example: 'תורה',
			},
			{
				name: 'value',
				type: 'Number',
				required: false,
				description: 'The gematria value to search for',
				example: 611,
			},
		]}
		examples={['/api/gematriasearch?text=תורה', '/api/gematriasearch?value=611']}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/gematriamatch"
		description="Find pairs of gematria methods where the given words have the same gematria value\n\nFor example, 53 = Mispar Siduri of &quot;תורה&quot; = AtBach of &quot;עבודה&quot;"
		parameters={[
			{
				name: 'word1',
				type: 'String',
				required: true,
				description: 'The first word to compare',
				example: 'תורה',
			},
			{
				name: 'word2',
				type: 'String',
				required: true,
				description: 'The second word to compare',
				example: 'משנה',
			},
		]}
	/>

	<h3>Zmanim</h3>

	<Endpoint
		method="GET"
		endpoint="/api/zmanim"
		description="Calculate zmanim (halachic times) for a given date and location"
		parameters={[
			{
				name: 'date',
				type: 'String',
				required: false,
				description: 'The date to calculate zmanim for in YYYY-MM-DD format (defaults to current date)',
				example: dayjs().format('YYYY-MM-DD'),
			},
			{
				name: 'latitude',
				type: 'Number',
				required: true,
				description: 'The latitude of the location to calculate zmanim for',
				example: 42.74521,
			},
			{
				name: 'longitude',
				type: 'Number',
				required: true,
				description: 'The longitude of the location to calculate zmanim for',
				example: -73.810345,
			},
			{
				name: 'timezone',
				type: 'Number',
				required: false,
				description: 'The timezone name of the location to calculate zmanim for (defaults to the timezone of the location)',
				example: 'America/New_York',
			},
		]}
	/>

	<h3>Daily Learning</h3>

	<Endpoint
		method="GET"
		endpoint="/api/dailylearning"
		description="Calculate the Daf Yomi, Nach Yomi, Yerushalmi Yomi, Daily Chofetz Chaim, Daily Rambam Chapter, Daily Shemirat HaLashon, Daily Psalms, and Weekly Daf for a given date"
		parameters={[
			{
				name: 'date',
				type: 'String',
				required: false,
				description: 'The date to calculate the daily learning for in YYYY-MM-DD format (defaults to current date)',
				example: dayjs().format('YYYY-MM-DD'),
			},
		]}
	/>

	<h3>Zodiac</h3>

	<Endpoint
		method="GET"
		endpoint="/api/zodiac"
		description="Calculate the Hebrew zodiac sign for a given date"
		parameters={[
			{
				name: 'date',
				type: 'String',
				required: false,
				description: 'The date to calculate the zodiac sign for in YYYY-MM-DD format (defaults to current date)',
				example: dayjs().format('YYYY-MM-DD'),
			},
		]}
	/>
</section>

<Toc activeHeadingScrollOffset={200} blurParams={{ duration: 400 }} breakpoint={1200} title="" />

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 0.6;
	}

	@media screen and (min-width: 1200px) {
		section {
			max-width: calc(100vw - 30em);
		}
	}

	:global(aside.toc) {
		background-color: white;
		border-radius: var(--bs-border-radius);
		border: 1px solid var(--bs-border-color);
	}

	:global(aside.toc > nav) {
		min-width: 20em;
		padding-bottom: 1em;
	}

	:global(aside.toc.desktop) {
		position: fixed;
		top: 6em;
		right: 1em;
		min-width: 20em;
		padding-bottom: 1em;
	}
</style>
