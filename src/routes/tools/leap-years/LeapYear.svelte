<script>
	import { isHebrewLeapYear, isGregorianLeapYear } from '$lib/js/leapyears.js';
	import { HDate } from '@hebcal/core';
	import Reason from './Reason.svelte';

	const currentGregorianYear = new Date().getFullYear();
	const currentHebrewYear = new HDate().getFullYear();
	const currentGregorianYearResult = isGregorianLeapYear(currentGregorianYear);
	const currentHebrewYearResult = isHebrewLeapYear(currentHebrewYear);

	let gregorianYear = currentGregorianYear;
	let hebrewYear = currentHebrewYear;

	$: gregorianLeapYearResult = isGregorianLeapYear(gregorianYear);
	$: hebrewLeapYearResult = isHebrewLeapYear(hebrewYear);
</script>

<div class="card flex-card center hebrew">
	<h2>Hebrew Calendar Leap Years</h2>

	<label>
		<span>Hebrew Year:</span>
		<input type="number" bind:value={hebrewYear} min="1" max="9999" class="form-control" />
	</label>

	<Reason success={hebrewLeapYearResult.isLeapYear} reason={hebrewLeapYearResult.reason} />
</div>

<div class="card flex-card center gregorian">
	<h2>Gregorian Calendar Leap Years</h2>

	<label>
		<span>Gregorian Year:</span>
		<input type="number" bind:value={gregorianYear} min="1" max="9999" class="form-control" />
	</label>

	<Reason success={gregorianLeapYearResult.isLeapYear} reason={gregorianLeapYearResult.reason} />
</div>

<div class="card flex-card info">
	<h2>Hebrew Calendar Leap Years</h2>
	<ul>
		<li>During a Hebrew calendar leap year, an additional month of Adar is added.</li>
		<li>There are seven leap years in every 19 years.</li>
		<li>The 3rd, 6th, 8th, 11th, 14th, 17th, and 19th years of the 19-year Metonic cycle are leap years.</li>
		<li>{currentHebrewYearResult.reason}</li>
		<li>{currentHebrewYearResult.nextLeapYearReason}</li>
		<li>
			A mnemonic for remembering the years corresponding to leap years is: "גוחאדז"ט". The Hebrew letters Gimmel, Vav, Chet, Aleph, Dalet, Zayin, and Tet are used to represent the Hebrew numerals, 3,
			6, 8, 1, 4, 7, 9.
		</li>
		<li>Mathematically, it can be determined if a year is a leap year by determining whether ((7*year)+1) mod 19) is less than 7.</li>
	</ul>
	<h2>Gregorian Calendar Leap Years</h2>
	<ul>
		<li>During a Gregorian calendar leap year, an additional day is added to February.</li>
		<li>
			A Gregorian year is a leap year if it meets BOTH criteria: <ul>
				<li>It is divisible by 4.</li>
				<li>It is not divisible by 100, unless it is also divisible by 400.</li>
			</ul>
		</li>
		<li>{currentGregorianYearResult.reason}</li>
		<li>{currentGregorianYearResult.nextLeapYearReason}</li>
	</ul>
</div>

<style>
	h2 {
		margin-top: 0.2em;
		margin-bottom: 1em;
		font-size: 1.7em;
	}

	label {
		margin-bottom: 0.5em;
	}

	input {
		display: inline-flex;
		margin-left: 0.5em;
		width: 5.5em;
	}
</style>
