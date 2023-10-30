<script>
	import { LETTER_SPELLING_VALUES } from '$lib/js/gematria.js';
	import { calculateOmerHebrew, calculateOmerYear } from '$lib/js/omer';
	import { getConverters, getUnits, getOpinions, getUnitOpinions } from '$lib/js/unitconverter.js';
	import { HDate } from '@hebcal/core';
	import dayjs from 'dayjs';
	import Endpoint from './Endpoint.svelte';
	import Toc from 'svelte-toc';

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

	const hebrewMonthAllowedValues = {
		Nissan: [1],
		Iyar: [2],
		Sivan: [3],
		Tammuz: [4],
		Av: [5],
		Elul: [6],
		Tishrei: [7],
		Cheshvan: [8],
		Kislev: [9],
		Tevet: [10],
		Shevat: [11],
		Adar: [12],
		'Adar II': [13],
	};

	const gregorianMonthAllowedValues = {
		January: [1],
		February: [2],
		March: [3],
		April: [4],
		May: [5],
		June: [6],
		July: [7],
		August: [8],
		September: [9],
		October: [10],
		November: [11],
		December: [12],
	};

	const todayYMD = dayjs().format('YYYY-MM-DD');
	const omerYear = calculateOmerYear(new Date().getFullYear());
	const exampleOmerDate = todayYMD in omerYear ? todayYMD : Object.keys(omerYear)[0];

	const hebrewOmer = calculateOmerHebrew(new HDate().getFullYear(), new HDate().getMonth(), new HDate().getDate());
	const exampleHebrewOmerMonth = hebrewOmer.count ? new HDate().getMonth() : 1;
	const exampleHebrewOmerDay = hebrewOmer.count ? new HDate().getDate() : 16;

	const holidayTypeParameters = [
		{
			name: 'diaspora',
			type: 'Boolean',
			required: false,
			description: 'Whether to calculate holidays for the diaspora holiday schedule. Set to <code>false</code> for Israel. (defaults to <code>true</code>)',
			example: true,
		},
		{
			name: 'major',
			type: 'Boolean',
			required: false,
			description: 'Whether to include major holidays (defaults to <code>true</code>)',
			example: true,
		},
		{
			name: 'minor',
			type: 'Boolean',
			required: false,
			description: 'Whether to include minor holidays (defaults to <code>true</code>)',
			example: true,
		},
		{
			name: 'fasts',
			type: 'Boolean',
			required: false,
			description: 'Whether to include fast days (defaults to <code>true</code>)',
			example: true,
		},
		{
			name: 'roshChodesh',
			type: 'Boolean',
			required: false,
			description: 'Whether to include Rosh Chodesh (defaults to <code>true</code>)',
			example: true,
		},
		{
			name: 'shabbosMevorchim',
			type: 'Boolean',
			required: false,
			description: 'Whether to include Shabbos Mevorchim (defaults to <code>false</code>)',
			example: false,
		},
		{
			name: 'specialShabbos',
			type: 'Boolean',
			required: false,
			description: 'Whether to include special Shabbos days (defaults to <code>false</code>)',
			example: false,
		},
		{
			name: 'modern',
			type: 'Boolean',
			required: false,
			description: 'Whether to include modern / Israel national holidays (defaults to <code>false</code>)',
			example: false,
		},
		{
			name: 'chabad',
			type: 'Boolean',
			required: false,
			description: 'Whether to include Chabad events (defaults to <code>false</code>)',
			example: false,
		},
	];
</script>

<svelte:head>
	<title>TorahCalc | API</title>
	<meta name="description" content="TorahCalc API" />
</svelte:head>

<section>
	<h1 class="heading">TorahCalc API</h1>

	<p>Welcome to the TorahCalc API. This API is currently in beta, and is subject to change.</p>

	<h2 class="category">English Text Input Calculator</h2>

	<Endpoint
		method="GET"
		endpoint="/api/input"
		description="Use natural words to input what you want to calculate."
		parameters={[
			{
				name: 'query',
				type: 'String',
				required: true,
				description: 'The query to evaluate',
				example: 'Convert 3 amos to inches.',
			},
		]}
	/>

	<h2 class="category">Biblical and Talmudic Units</h2>

	{#await converters}
		<h3>Unit Converter</h3>

		<Endpoint method="GET" endpoint="/api/unitconverter" description="Loading..." parameters={[]} />

		<h3>Multi Unit Converter</h3>

		<Endpoint method="GET" endpoint="/api/unitcharts" description="Loading..." parameters={[]} />
	{:then converters}
		<h3>Unit Converter</h3>

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
				{
					name: 'unitOpinion',
					type: 'String[]',
					required: false,
					description: "Opinions for specific units such as Hiluch Mil and K'dei Achilas Pras. This parameter can be used multiple times to specify multiple unit opinions.",
					example: 'kdei_achilas_pras.chasam_sofer',
					allowedValues: getUnitOpinions(converters),
				},
			]}
			examples={[
				'/api/unitconverter?type=length&from=tefach&to=amah&amount=12',
				'/api/unitconverter?type=length&from=amah&to=meter&amount=3&opinion=rabbi_avraham_chaim_naeh',
				'/api/unitconverter?type=time&from=kdei_achilas_pras&to=minute&amount=1&unitOpinion=kdei_achilas_pras.aruch_hashulchan',
				'/api/unitconverter?type=time&from=kdei_achilas_pras&to=hiluch_mil&amount=1&unitOpinion=kdei_achilas_pras.aruch_hashulchan&unitOpinion=hiluch_mil.biur_hagra',
			]}
		/>

		<h3>Multi Unit Converter</h3>

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
				{
					name: 'unitOpinion',
					type: 'String[]',
					required: false,
					description: "Opinions for specific units such as Hiluch Mil and K'dei Achilas Pras. This parameter can be used multiple times to specify multiple unit opinions.",
					example: 'kdei_achilas_pras.chasam_sofer',
					allowedValues: getUnitOpinions(converters),
				},
			]}
			examples={[
				'/api/unitcharts?type=coins&from=shekel&amount=1000',
				'/api/unitcharts?type=length&from=derech_yom&amount=1&opinion=rabbi_avraham_chaim_naeh',
				'/api/unitcharts?type=time&from=kdei_achilas_pras&amount=1&unitOpinion=kdei_achilas_pras.aruch_hashulchan&unitOpinion=hiluch_mil.biur_hagra',
			]}
		/>
	{:catch}
		<Endpoint method="GET" endpoint="/api/unitconverter" description="Error loading parameters" parameters={[]} />
	{/await}

	<h2 class="category">Calendar and Zmanim</h2>

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
				allowedValues: gregorianMonthAllowedValues,
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
				allowedValues: hebrewMonthAllowedValues,
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

	<h3>Holidays</h3>

	<Endpoint
		method="GET"
		endpoint="/api/holidays/gregorianyear"
		description="Calculate the holidays for a given Gregorian year."
		parameters={[
			{
				name: 'gregorianYear',
				type: 'Number',
				required: false,
				description: 'The Gregorian year to calculate holidays for (defaults to current year)',
				example: new Date().getFullYear(),
			},
			...holidayTypeParameters,
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/holidays/hebrewyear"
		description="Calculate the holidays for a given Hebrew calendar year."
		parameters={[
			{
				name: 'hebrewYear',
				type: 'Number',
				required: false,
				description: 'The Hebrew year to calculate holidays for (defaults to current year)',
				example: new HDate().getFullYear(),
			},
			...holidayTypeParameters,
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/holidays/startdate"
		description="Calculate the holidays for a given year from a given start date in the Hebrew calendar."
		parameters={[
			{
				name: 'hebrewYear',
				type: 'Number',
				required: false,
				description: 'The Hebrew year to start calculating holidays from (defaults to current year)',
				example: new HDate().getFullYear(),
			},
			{
				name: 'hebrewMonth',
				type: 'Number',
				required: false,
				description: 'The Hebrew month (1-13 where 1=Nissan) to start calculating holidays from (defaults to current month)',
				example: new HDate().getMonth(),
				allowedValues: hebrewMonthAllowedValues,
			},
			{
				name: 'hebrewDay',
				type: 'Number',
				required: false,
				description: 'The Hebrew day 1-30 to start calculating holidays from (defaults to current day)',
				example: new HDate().getDate(),
			},
			...holidayTypeParameters,
		]}
	/>

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
				allowedValues: hebrewMonthAllowedValues,
			},
		]}
	/>

	<h3>Sefiras HaOmer</h3>

	<Endpoint
		method="GET"
		endpoint="/api/omer/gregorian"
		description="Calculate the Sefiras HaOmer count for a given Gregorian date"
		parameters={[
			{
				name: 'date',
				type: 'String',
				required: false,
				description: 'The date to calculate the Sefiras HaOmer count for in YYYY-MM-DD format (defaults to current date)',
				example: exampleOmerDate,
			},
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/omer/hebrew"
		description="Calculate the Sefiras HaOmer count for a given Hebrew date"
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
				description: 'The Hebrew month - 1 for Nissan, 2 for Iyar, 3 for Sivan (defaults to current month)',
				example: exampleHebrewOmerMonth,
				allowedValues: { Nissan: [1], Iyar: [2], Sivan: [3] },
			},
			{
				name: 'day',
				type: 'Number',
				required: false,
				description: 'The Hebrew day 1-30 (defaults to current day)',
				example: exampleHebrewOmerDay,
			},
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/omer/year"
		description="Calculate the Sefiras HaOmer count for a given Gregorian year"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The Gregorian year (defaults to current year)',
				example: new Date().getFullYear(),
			},
		]}
	/>

	<h3>Shmita Years</h3>

	<Endpoint
		method="GET"
		endpoint="/api/shmita/check"
		description="Check if a given year is a Shmita year"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The Hebrew year to check. Defaults to current year.',
				example: new HDate().getFullYear(),
			},
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/shmita/next"
		description="Calculate the next Shmita year from a given year"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The Hebrew year. The Shmita year returned will be the occurrence on or after this year. Defaults to current year.',
				example: new HDate().getFullYear(),
			},
		]}
	/>

	<Endpoint
		method="GET"
		endpoint="/api/shmita/previous"
		description="Calculate the previous Shmita year from a given year"
		parameters={[
			{
				name: 'year',
				type: 'Number',
				required: false,
				description: 'The Hebrew year. The Shmita year returned will be the occurrence on or before this year. Defaults to current year.',
				example: new HDate().getFullYear(),
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
				example: 40.7127753,
			},
			{
				name: 'longitude',
				type: 'Number',
				required: true,
				description: 'The longitude of the location to calculate zmanim for',
				example: -74.0059728,
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

	<h2 class="category">Gematria</h2>

	<h3>Gematria Calculator</h3>

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

	<h3>Gematria Lookup</h3>

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

	<h3>Gematria Match Finder</h3>

	<Endpoint
		method="GET"
		endpoint="/api/gematriamatch"
		description="Find pairs of gematria methods where the given words have the same gematria value. For example, 53 = Mispar Siduri of &quot;תורה&quot; = AtBach of &quot;עבודה&quot;"
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
</section>

<Toc activeHeadingScrollOffset={200} blurParams={{ duration: 400 }} breakpoint={1200} title="" />

<style>
	@media screen and (min-width: 1200px) {
		section {
			max-width: calc(100vw - 30em);
		}
	}

	h2.category {
		padding: 0.5em 1em;
		text-align: center;
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
