<script>
	import { gregorianToHebrew, hebrewToGregorian, hebrewMonths, formatHebrewDateEn } from '$lib/js/dateconverter';
	import { calculateOmerDate, calculateOmerHebrew, calculateOmerYear } from '$lib/js/omer';
	import { formatDate } from '$lib/js/utils';
	import dayjs from 'dayjs';
	import { HDate, greg } from '@hebcal/core';
	import { onMount } from 'svelte';
	import OmerButtons from './OmerButtons.svelte';

	onMount(handleGregorianToHebrew);

	const gDate = new Date();
	let gregorianYear = gDate.getFullYear();
	let gregorianMonth = gDate.getMonth() + 1;
	let gregorianDay = gDate.getDate();
	let formattedGregorianDate = formatDate(gregorianYear, gregorianMonth, gregorianDay);

	const hDate = new HDate(gDate);
	let hebrewYear = hDate.getFullYear();
	let hebrewMonth = hDate.getMonth();
	let hebrewDay = hDate.getDate();
	let formattedHebrewDate = formatHebrewDateEn(hDate);

	/** @type {{ class?: string, html?: string }} The warning object if any */
	let warning = {};

	/** @type {{ dayCount?: import('$lib/js/omer').Omer|null, nightCount?: import('$lib/js/omer').Omer|null, count?: import('$lib/js/omer').Omer|null }} The results of the sefiras haomer calculation */
	let results = {};

	/** @type {Record<string, import('$lib/js/omer').Omer>} Year of sefiras haomer */
	let omerYear = {};

	function handleGregorianToHebrew() {
		if (!gregorianYear || !gregorianMonth || !gregorianDay) {
			return;
		}
		warning = {};
		try {
			const result = gregorianToHebrew({ year: gregorianYear, month: gregorianMonth, day: gregorianDay });
			hebrewYear = result.year;
			hebrewMonth = result.month;
			hebrewDay = result.day;
			formattedHebrewDate = result.displayEn;
			formattedGregorianDate = formatDate(gregorianYear, gregorianMonth, gregorianDay);
			if (result.warning) {
				warning = { class: 'warning', html: result.warning };
			}
		} catch (error) {
			warning = { class: 'danger', html: error instanceof Error ? error.message : String(error) };
		}
		updateResults('gregorian');
	}

	function handleHebrewToGregorian() {
		if (!hebrewYear || !hebrewMonth || !hebrewDay) {
			return;
		}
		warning = {};
		try {
			const result = hebrewToGregorian({ year: hebrewYear, month: hebrewMonth, day: hebrewDay });
			gregorianYear = result.year;
			gregorianMonth = result.month;
			gregorianDay = result.day;
			formattedGregorianDate = result.display;
			formattedHebrewDate = formatHebrewDateEn(new HDate(hebrewDay, hebrewMonth, hebrewYear));
			if (result.warning) {
				warning = { class: 'warning', html: result.warning };
			}
		} catch (error) {
			warning = { class: 'danger', html: error instanceof Error ? error.message : String(error) };
		}
		updateResults('hebrew');
	}

	/**
	 * Read the options from the UI and update the results
	 * @param {'hebrew'|'gregorian'} calendar - The calendar to use for the calculation
	 */
	async function updateResults(calendar) {
		// if calendar is Gregorian and date is out of range for month, set to first valid date in month
		if (calendar === 'hebrew') {
			results = calculateOmerHebrew(hebrewYear, hebrewMonth, hebrewDay);
		} else if (calendar === 'gregorian') {
			const date = dayjs(new Date(gregorianYear, gregorianMonth - 1, gregorianDay)).format('YYYY-MM-DD');
			results = calculateOmerDate(date);
		}
		omerYear = calculateOmerYear(gregorianYear);
	}

	/**
	 * Add an ordinal suffix to a number (1st, 2nd, 3rd, etc.)
	 * @param {number} num - The number to add the suffix to
	 * @returns {string} The number with the ordinal suffix
	 */
	function addOrdinalSuffix(num) {
		const suffixes = ['th', 'st', 'nd', 'rd'];
		const value = num % 100;
		return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
	}

	/**
	 * Changes the current date based on the specified type and updates the Gregorian and Hebrew date values.
	 *
	 * @param {string} type - The type of date change. Possible values:
	 *   - 'previous': Moves the date to the previous day.
	 *   - 'next': Moves the date to the next day.
	 *   - 'today': Sets the date to the current day.
	 *   - 'firstNight': Sets the date to Nissan 15 (assumed to be April 6).
	 *   - 'lastNight': Sets the date to the 49th night of the Omer (assumed to be May 24).
	 */
	function changeDate(type) {
		const date = dayjs(new Date(gregorianYear, gregorianMonth - 1, gregorianDay));
		let newDate;

		switch (type) {
			case 'previous':
				newDate = date.subtract(1, 'day');
				break;
			case 'next':
				newDate = date.add(1, 'day');
				break;
			case 'today':
				newDate = dayjs();
				break;
			case 'firstNight':
				newDate = dayjs(new Date(nissan15Gregorian.year, nissan15Gregorian.month - 1, nissan15Gregorian.day));
				break;
			case 'lastNight':
				newDate = dayjs(new Date(sivan4Gregorian.year, sivan4Gregorian.month - 1, sivan4Gregorian.day));
				break;
			default:
				throw new Error('Invalid date change type');
		}

		gregorianYear = newDate.year();
		gregorianMonth = newDate.month() + 1;
		gregorianDay = newDate.date();
		handleGregorianToHebrew();
	}

	/**
	 * Moves the date to the previous day by calling `changeDate` with the 'previous' type.
	 */
	function goToPreviousDay() {
		changeDate('previous');
	}

	/**
	 * Moves the date to the next day by calling `changeDate` with the 'next' type.
	 */
	function goToNextDay() {
		changeDate('next');
	}

	/**
	 * Sets the date to today by calling `changeDate` with the 'today' type.
	 */
	function goToToday() {
		changeDate('today');
	}

	/**
	 * Sets the date to the first night of the Omer by calling `changeDate` with the 'firstNight' type.
	 */
	function goToFirstNight() {
		changeDate('firstNight');
	}

	/**
	 * Sets the date to the 49th night of the Omer by calling `changeDate` with the 'lastNight' type.
	 */
	function goTo49thNight() {
		changeDate('lastNight');
	}

	$: disableAdarII = !new HDate(hebrewDay, hebrewMonth, hebrewYear).isLeapYear();

	$: gregorianDateObj = new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
	$: dayOfWeek = formatDate(gregorianYear, gregorianMonth, gregorianDay, 'dddd');
	$: lastDayOfWeek = formatDate(gregorianYear, gregorianMonth, gregorianDay - 1, 'dddd');

	$: nissan15Gregorian = hebrewToGregorian({ year: hebrewYear, month: 1, day: 15 });
	$: sivan4Gregorian = hebrewToGregorian({ year: hebrewYear, month: 3, day: 4 });
	$: afterShavuos = dayjs(gregorianDateObj).isAfter(dayjs(new Date(gregorianYear, 5, 1))); // assumes Shavuos is always after May 1
	$: nextNissan15Gregorian = afterShavuos ? hebrewToGregorian({ year: hebrewYear + 1, month: 1, day: 15 }) : nissan15Gregorian;
	$: nextNissan15GregorianDate = formatDate(nextNissan15Gregorian.year, nextNissan15Gregorian.month, nextNissan15Gregorian.day, 'dddd [night], MMMM D, YYYY');
</script>

<!-- Controls -->
<div class="card flex-card center mb-0">
	{#if warning.html && warning.class}
		<div class="mb-3">
			<div class="alert alert-{warning.class}" role="alert">
				{@html warning.html}
			</div>
		</div>
	{/if}

	<div class="row no-gutters align-items-center justify-content-center gap-3">
		<div class="col-md-4 d-flex flex-column gap-2">
			<span>Gregorian Date</span>
			<div class="text-center d-flex flex-column gap-2">
				<div class="input-group">
					<select class="form-select w-auto" id="gregorianMonth" bind:value={gregorianMonth} on:change={handleGregorianToHebrew}>
						{#each greg.monthNames.slice(-12) as month, i (i)}
							<option value={i + 1}>{month}</option>
						{/each}
					</select>
					<input class="form-control w-auto" type="number" min="1" max="31" id="gregorianDay" bind:value={gregorianDay} on:input={handleGregorianToHebrew} />
					<input class="form-control w-auto" type="number" min="-3761" max="275760" id="gregorianYear" bind:value={gregorianYear} on:input={handleGregorianToHebrew} />
				</div>
			</div>
		</div>
		<div class="equals col-md-3">OR</div>
		<div class="col-md-4 d-flex flex-column gap-2">
			<span>Hebrew Date</span>
			<div class="text-center d-flex flex-column gap-2">
				<div class="input-group">
					<select class="form-select w-auto" id="hebrewMonth" bind:value={hebrewMonth} on:change={handleHebrewToGregorian}>
						{#each hebrewMonths as month, i (i)}
							<option value={i + 1} disabled={i === 12 && disableAdarII}>{month}</option>
						{/each}
					</select>
					<input class="form-control w-auto" type="number" min="1" max="30" id="hebrewDay" bind:value={hebrewDay} on:input={handleHebrewToGregorian} />
					<input class="form-control w-auto" type="number" min="1" max="279516" id="hebrewYear" bind:value={hebrewYear} on:input={handleHebrewToGregorian} />
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Results for selected day -->
<div class="card flex-card mb-0">
	<OmerButtons {goToPreviousDay} {goToNextDay} {goToToday} {goToFirstNight} {goTo49thNight} />

	<div class="text-center my-5">
		<!-- Converted from Gregorian Date -->
		{#if results.dayCount}
			<h4 class="mb-3">Day of {formattedGregorianDate}:</h4>
			<p>
				<span>"{results.dayCount.formulaEn}"</span>
				<br />
				<span class="rtl">"{results.dayCount.formulaHe}"</span>
			</p>
			<p>
				<span>{results.dayCount.sefiraEn}</span>
				<br />
				<span class="rtl">{results.dayCount.sefiraHe}</span>
			</p>
		{/if}
		{#if results.nightCount}
			<h4 class="mb-3">{dayOfWeek} night, count the {addOrdinalSuffix(results.nightCount.dayOfOmer)} day:</h4>
			<p>
				<span>"{results.nightCount.formulaEn}"</span>
				<br />
				<span class="rtl">"{results.nightCount.formulaHe}"</span>
			</p>
			<p>
				<span>{results.nightCount.sefiraEn}</span>
				<br />
				<span class="rtl">{results.nightCount.sefiraHe}</span>
			</p>
		{:else if results.dayCount}
			<h4 class="mb-0">Shavuos starts at night.</h4>
		{/if}
		<!-- Converted from Hebrew Date -->
		{#if results.count}
			<h5 class="mb-3">{formattedHebrewDate}</h5>
			<h4 class="mb-3">Count the {addOrdinalSuffix(results.count.dayOfOmer)} day on {lastDayOfWeek} night:</h4>
			<p>
				<span>"{results.count.formulaEn}"</span>
				<br />
				<span class="rtl">"{results.count.formulaHe}"</span>
			</p>
			<p>
				<span>{results.count.sefiraEn}</span>
				<br />
				<span class="rtl">{results.count.sefiraHe}</span>
			</p>
		{/if}
		<!-- Show brachos if there is a night count -->
		{#if results.nightCount || results.count}
			<details>
				<summary class="text-center mt-3">Show Brachos</summary>
				<div lang="he" dir="rtl" class="rtl container">
					<div class="mb-4">
						<h3 class="d-inline">לְשֵׁם</h3>
						<p class="d-inline">
							יִחוּד קוּדְשָׁא בְרִיךְ הוּא וּשְׁכִינְתֵּיהּ בִּדְחִילוּ וּרְחִימוּ לְיַחֵד שֵׁם י"ה בְּו"ה בְּיִחוּדָא שְׁלִים בְּשֵׁם כָּל יִשְׂרָאֵל, הִנְּנִי מוּכָן וּמְזֻמָּן לְקַיֵּם מִצְוַת
							עֲשֵׂה שֶׁל סְפִירַת הָעֹמֶר כְּמוֹ שֶׁכָּתוּב בַּתּוֹרָה. וּסְפַרְתֶּם לָכֶם מִמָּחֳרַת הַשַּׁבָּת מִיּוֹם הֲבִיאֲכֶם אֶת עֹמֶר הַתְּנוּפָה שֶׁבַע שַׁבָּתוֹת תְּמִימֹת תִּהְיֶינָה. עַד
							מִמָּחֳרַת הַשַּׁבָּת הַשְּׁבִיעִת תִּסְפְּרוּ חֲמִשִּׁים יוֹם וְהִקְרַבְתֶּם מִנְחָה חֲדָשָׁה לַייָ. וִיהִי נֹעַם אֲדֹנָי אֱלֹהֵינוּ עָלֵינוּ וּמַעֲשֵׂה יָדֵינוּ כּוֹנְנָה עָלֵינוּ
							וּמַעֲשֵׂה יָדֵינוּ כּוֹנְנֵהוּ.
						</p>
					</div>

					<div class="mb-4">
						<h3 class="d-inline">בָּרוּך</h3>
						<p class="d-inline">אַתָּה יְיָ אֱלֹהֵֽינוּ מֶֽלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָֽׁנוּ בְּמִצְוֺתָיו וְצִוָּֽנוּ עַל סְפִירַת הָעֹֽמֶר.</p>
						<div class="text-center">
							<p class="my-3 ltr">For the {addOrdinalSuffix(results.nightCount?.dayOfOmer ?? results.count?.dayOfOmer ?? 0)} night of the Omer:</p>
							<h4>{results?.nightCount?.formulaHe ?? results?.count?.formulaHe ?? ''}</h4>
						</div>
					</div>

					<div class="mb-4">
						<h3 class="d-inline">הָרַחֲמָן</h3>
						<p class="d-inline">הוּא יַחֲזִיר לָנוּ עֲבוֹדַת בֵּית הַמִּקְדָּשׁ לִמְקוֹמָהּ בִּמְהֵרָה בְּיָמֵינוּ, אָמֵן סֶלָה.</p>
					</div>

					<div class="mb-4">
						<h3 class="d-inline">לַמְנַצֵּח</h3>
						<p class="d-inline">
							בִּנְגִינֹת מִזְמוֹר שִׁיר. אֱלֹהִים יְחָנֵּנוּ וִיבָרְכֵנוּ יָאֵר פָּנָיו אִתָּנוּ סֶלָה. לָדַעַת בָּאָרֶץ דַּרְכֶּךָ בְּכָל־גּוֹיִם יְשׁוּעָתֶךָ. יוֹדוּךָ עַמִּים אֱלֹהִים יוֹדוּךָ
							עַמִּים כֻּלָּם. יִשְׂמְחוּ וִירַנְּנוּ לְאֻמִּים כִּי־תִשְׁפֹּט עַמִּים מִישׁוֹר וּלְאֻמִּים בָּאָרֶץ תַּנְחֵם סֶלָה.
						</p>
					</div>

					<div class="mb-4">
						<h3 class="d-inline">אָנָּא</h3>
						<p class="d-inline">
							בְּכֹחַ גְדֻּלַּת יְמִינְךָ תַּתִּיר צְרוּרָה. (אב"ג ית"ץ)<br />
							קַבֵּל רִנַּת עַמְּךָ, שַׂגְּבֵנוּ, טַהֲרֵנוּ, נוֹרָא. (קר"ע שט"ן)<br />
							נָא גִבּוֹר, דוֹרְשֵׁי יִחוּדְךָ כְּבָבַת שָׁמְרֵם. (נג"ד יכ"ש)<br />
							בָּרְכֵם, טַהֲרֵם, רַחֲמֵי צִדְקָתְךָ תָּמִיד גָמְלֵם. (בט"ר צת"ג)<br />
							חֲסִין קָדוֹשׁ, בְּרוֹב טוּבְךָ נַהֵל עֲדָתְךָ. (חק"ב טנ"ע)<br />
							יָחִיד גֵּאָה, לְעַמְּךְ פְּנֵה, זוֹכְרֵי קְדֻשָּׁתְךָ. (יג"ל פז"ק)<br />
							שַׁוְעָתֵנוּ קַבֵּל וּשְׁמַע צַעֲקָתֵנוּ, יוֹדֵעַ תַעֲלֻמוֹת. (שק"ו צי"ת)<br />
							בָּרוּךְ שֵׁם כְּבוד מַלְכוּתו לְעולָם וָעֶד.
						</p>
					</div>

					<div class="mb-4">
						<h3 class="d-inline">רִבּוֹנוֹ</h3>
						<p class="d-inline">
							שֶׁל עוֹלָם, אַתָּה צִוִּיתָנוּ עַל יְדֵי משֶׁה עַבְדֶּךָ לִסְפּוֹר סְפִירַת הָעוֹמֶר כְּדֵי לְטַהֲרֵנוּ מִקְלִפּוֹתֵינוּ וּמִטֻמְאוֹתֵינוּ, כְּמוֹ שֶׁכָּתַבְתָּ בְּתוֹרָתֶךָ.
							וּסְפַרְתֶּם לָכֶם מִמָּחֳרַת הַשַּׁבָּת מִיֹּום הֲבִיאֲכֶם אֶת־עֹמֶר הַתְּנוּפָה שֶׁבַע שַׁבָּתֹות תְּמִימֹת תִּהְיֶינָה. עַד מִמָּחֳרַת הַשַּׁבָּת הַשְּׁבִיעִת תִּסְפְּרוּ חֲמִשִּׁים
							יֹום.
						</p>
						<div class="text-center mb-3">
							<p class="my-3 ltr">For the {addOrdinalSuffix(results.nightCount?.dayOfOmer ?? results.count?.dayOfOmer ?? 0)} night of the Omer:</p>
							<h4>{results?.nightCount?.sefiraHe ?? results?.count?.sefiraHe ?? ''}</h4>
						</div>
						<p class="d-inline">
							וְאֶטָּהֵר וְאֶתְקַדֵּשׁ בִּקְדֻשָּׁה שֶׁל מַעְלָה, וְעַל יְדֵי זֶה יֻשְׁפַּע שֶׁפַע רַב בְּכָל הָעוֹלָמוֹת וּלְתַקֵּן אֶת נַפְשׁוֹתֵינוּ וְרוּחוֹתֵינוּ וְנִשְׁמוֹתֵינוּ מִכָּל סִיג
							וּפְגַם, וּלְטַהֲרֵנוּ וּלְקַדְּשֵׁנוּ בִּקְדֻשָׁתְךָ הָעֶלְיוֹנָה, אָמֵן סֶלָה.
						</p>
					</div>
				</div>
			</details>
		{/if}
		<!-- No results -->
		{#if !results.nightCount && !results.dayCount && !results.count}
			<p>There is no Omer count for the date {formattedGregorianDate}.</p>
			<p class="mb-0"><b>The count of the Omer will start on {nextNissan15GregorianDate}.</b></p>
		{/if}
	</div>

	<OmerButtons {goToPreviousDay} {goToNextDay} {goToToday} {goToFirstNight} {goTo49thNight} />
</div>

<!-- Table of full year -->
<div class="card flex-card mb-0">
	<h4 class="text-center mb-3">Sefiras HaOmer for {gregorianYear}</h4>

	<p class="scroll-for-more">Scroll horizontally in the table to view more.</p>

	<div class="table-responsive">
		<table class="table table-light table-sm table-striped table-bordered">
			<thead class="table-dark">
				<tr>
					<th scope="col" class="center">Day</th>
					<th scope="col" class="center">Count</th>
					<th scope="col" class="center">Sefira</th>
				</tr>
			</thead>
			<tbody>
				{#each Object.values(omerYear) as count}
					<tr
						class={results.dayCount?.dayOfOmer === count.dayOfOmer || (results.count?.dayOfOmer ?? 0) - 1 === count.dayOfOmer
							? 'omer-day'
							: results.nightCount?.dayOfOmer === count.dayOfOmer || results.count?.dayOfOmer === count.dayOfOmer
								? 'omer-night'
								: ''}
					>
						<td class="nowrap">
							<span class="badge bg-dark omer-badge">
								Day {count.dayOfOmer}
							</span>
							<span class="small">
								<b>{count.hebrewDate}</b>
								<br />
								{count.night}
							</span>
						</td>
						<td class="center">
							<b>{count.formulaEn}</b>
							<br />
							<span class="rtl">{count.formulaHe}</span>
						</td>
						<td class="center">
							<b>{count.sefiraEn}</b>
							<br />
							<span class="rtl">{count.sefiraHe}</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=David+Libre:wght@400&family=David+Libre:wght@700&display=swap');

	.equals {
		font-size: 140%;
	}

	.rtl {
		display: block;
		direction: rtl;
		font-family: 'David Libre', sans-serif;
	}

	.ltr {
		display: block;
		direction: ltr;
	}

	details > summary {
		width: max-content;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		margin: auto;
	}

	details > summary:hover {
		background-color: #eee;
	}

	.table > :not(caption) > tr > td {
		vertical-align: middle !important;
	}

	.nowrap {
		white-space: nowrap;
	}

	.omer-day .omer-badge {
		background-color: #cce5ff !important;
		color: black !important;
	}

	.omer-night .omer-badge {
		background-color: #004085 !important;
		color: white !important;
	}

	.scroll-for-more {
		display: none;
		text-align: center;
		font-size: 92%;
		background: #ebecee;
		border-radius: 0.25rem;
		padding: 0.5em;
	}

	@media screen and (max-width: 510px) {
		.scroll-for-more {
			display: block;
		}
	}
</style>
