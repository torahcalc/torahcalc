<script>
	import { formatDate, gregorianToHebrew, hebrewToGregorian, hebrewMonths, formatHebrewDateEn } from '$lib/js/dateconverter';
	import { HDate, greg } from '@hebcal/core';

	const gDate = new Date();
	let afterSunset = false;
	let gregorianYear = gDate.getFullYear();
	let gregorianMonth = gDate.getMonth() + 1;
	let gregorianDay = gDate.getDate();
	let formattedGregorianDate = formatDate(gregorianYear, gregorianMonth, gregorianDay);

	const hDate = new HDate(gDate);
	let hebrewYear = hDate.getFullYear();
	let hebrewMonth = hDate.getMonth();
	let hebrewDay = hDate.getDate();
	let formattedHebrewDate = formatHebrewDateEn(hDate);

	/**
	 * @type {{ class?: string, html?: string }}
	 */
	let warning = {};

	function handleGregorianToHebrew() {
		warning = {};
		try {
			const result = gregorianToHebrew({ year: gregorianYear, month: gregorianMonth, day: gregorianDay, afterSunset });
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
	}

	function handleHebrewToGregorian() {
		warning = {};
		afterSunset = false;
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
	}

	$: disableAdarII = !new HDate(hebrewDay, hebrewMonth, hebrewYear).isLeapYear();
</script>

<div class="card flex-card center">
	<h5>{formattedGregorianDate}{afterSunset ? ' (after sunset)' : ''} = {formattedHebrewDate}</h5>
</div>

<div class="card flex-card center">
	{#if warning.html && warning.class}
		<div class="mb-3">
			<div class="alert alert-{warning.class}" role="alert">
				{@html warning.html}
			</div>
		</div>
	{/if}

	<div class="row no-gutters">
		<div class="col-md-5">
			<h2>Gregorian Date</h2>
			<div style="display: flex; justify-content: center; align-items: center; gap: 1em; flex-wrap: wrap;">
				<div>
					<select class="form-select" id="gregorianMonth" bind:value={gregorianMonth} on:change={handleGregorianToHebrew}>
						{#each greg.monthNames.slice(-12) as month, i (i)}
							<option value={i + 1}>{month}</option>
						{/each}
					</select>
				</div>
				<div>
					<input class="form-control" type="number" min="1" max="31" id="gregorianDay" bind:value={gregorianDay} on:input={handleGregorianToHebrew} />
				</div>
				<div>
					<input class="form-control" type="number" min="-3761" max="275760" id="gregorianYear" bind:value={gregorianYear} on:input={handleGregorianToHebrew} />
				</div>
			</div>
			<div class="mt-3" style="display: flex; justify-content: center; align-items: center; gap: 1em;">
				<div class="form-check">
					<input class="form-check-input" type="checkbox" value="" id="afterSunset" bind:checked={afterSunset} on:change={handleGregorianToHebrew} />
					<label class="form-check-label" for="afterSunset">After Sunset</label>
				</div>
			</div>
		</div>
		<div class="equals col-md-2">=</div>
		<div class="col-md-5">
			<h2>Hebrew Date</h2>
			<div style="display: flex; justify-content: center; align-items: center; gap: 1em; flex-wrap: wrap;">
				<div>
					<select class="form-select" id="hebrewMonth" bind:value={hebrewMonth} on:change={handleHebrewToGregorian}>
						{#each hebrewMonths as month, i (i)}
							<option value={i + 1} disabled={i === 12 && disableAdarII}>{month}</option>
						{/each}
					</select>
				</div>
				<div>
					<input class="form-control" type="number" min="1" max="30" id="hebrewDay" bind:value={hebrewDay} on:input={handleHebrewToGregorian} />
				</div>
				<div>
					<input class="form-control" type="number" min="1" max="279516" id="hebrewYear" bind:value={hebrewYear} on:input={handleHebrewToGregorian} />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	h2 {
		margin-bottom: 0.75em;
	}

	h5 {
		margin-top: 0.2em;
	}

	#gregorianYear,
	#hebrewYear {
		width: 5.2em;
	}

	#gregorianDay,
	#hebrewDay {
		width: 4.2em;
	}

	.equals {
		padding: 0.9em 0;
		font-size: 2.4em;
	}
</style>
