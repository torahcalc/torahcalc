<script>
	import { findCalendarOverlaps } from '$lib/js/calendar-overlaps';
	import { hebrewMonths } from '$lib/js/dateconverter';
	import { HDate } from '@hebcal/core';

	const todayDate = new Date();
	const todayHebrewDate = new HDate(todayDate);
	let gregorianMonth = todayDate.getMonth() + 1;
	let gregorianDay = todayDate.getDate();
	let hebrewMonth = todayHebrewDate.getMonth();
	let hebrewDay = todayHebrewDate.getDate();

	const currentYear = new Date().getFullYear();
	let startYear = currentYear - 100;
	let endYear = currentYear + 100;

	/** @type {Array<import('$lib/js/calendar-overlaps').Overlap>} */
	let overlaps = [];
	let errorMessage = '';
	let disableAdarII = !new HDate(hebrewDay, hebrewMonth, 5784).isLeapYear();

	$: today = new Date();
	$: pastOverlaps = overlaps.filter(isPastOverlap).reverse();
	$: upcomingOverlaps = overlaps.filter((overlap) => !isPastOverlap(overlap));

	/**
	 * Updates the disableAdarII flag based on whether the selected Hebrew month is Adar II in a leap year
	 */
	function updateDisableAdarII() {
		disableAdarII = !new HDate(hebrewDay, hebrewMonth, 5784).isLeapYear();
	}

	/**
	 * Finds overlaps based on the current input values
	 */
	function findOverlaps() {
		errorMessage = '';
		try {
			overlaps = findCalendarOverlaps({
				gregorianMonth,
				gregorianDay,
				hebrewMonth,
				hebrewDay,
				startYear,
				endYear,
			});

			if (overlaps.length === 0) {
				errorMessage = 'No overlaps found in the specified range.';
			}
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : String(error);
			overlaps = [];
		}
	}

	/**
	 * Filters overlaps to only those in the past
	 * @param {import('$lib/js/calendar-overlaps').Overlap} overlap
	 * @returns {boolean} True if the overlap is in the past, false otherwise
	 */
	function isPastOverlap(overlap) {
		const overlapDate = overlap.gregorianDate;
		const today = new Date().toISOString().split('T')[0];
		return overlapDate < today;
	}

	// Initial calculation
	findOverlaps();

	// Get month names for display
	const gregorianMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	$: gregorianMonthName = gregorianMonthNames[gregorianMonth - 1];
	$: hebrewMonthName = hebrewMonths[hebrewMonth - 1];
</script>

<div class="card flex-card center">
	<h3 class="mb-4">Find Calendar Overlaps</h3>

	{#if errorMessage}
		<div class="mb-3">
			<div class="alert alert-danger" role="alert">
				{errorMessage}
			</div>
		</div>
	{/if}

	<div class="row g-3 align-items-center mb-4">
		<div class="col-md-5">
			<h4>Gregorian Date</h4>
			<div style="display: flex; justify-content: center; align-items: center; gap: 1em; flex-wrap: wrap;">
				<div>
					<label for="gregorianMonth" class="form-label">Month</label>
					<select class="form-select" id="gregorianMonth" bind:value={gregorianMonth} on:change={findOverlaps}>
						{#each gregorianMonthNames as month, i (i)}
							<option value={i + 1}>{month}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="gregorianDay" class="form-label">Day</label>
					<input class="form-control" type="number" min="1" max="31" id="gregorianDay" bind:value={gregorianDay} on:input={findOverlaps} />
				</div>
			</div>
		</div>
		<div class="col-md-2 text-center">
			<div class="overlap-symbol">⟷</div>
		</div>
		<div class="col-md-5">
			<h4>Hebrew Date</h4>
			<div style="display: flex; justify-content: center; align-items: center; gap: 1em; flex-wrap: wrap;">
				<div>
					<label for="hebrewMonth" class="form-label">Month</label>
					<select
						class="form-select"
						id="hebrewMonth"
						bind:value={hebrewMonth}
						on:change={() => {
							updateDisableAdarII();
							findOverlaps();
						}}
					>
						{#each hebrewMonths as month, i (i)}
							<option value={i + 1} disabled={i === 12 && disableAdarII}>{month}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="hebrewDay" class="form-label">Day</label>
					<input class="form-control" type="number" min="1" max="30" id="hebrewDay" bind:value={hebrewDay} on:input={findOverlaps} />
				</div>
			</div>
		</div>
	</div>
</div>

{#if overlaps.length > 0}
	<div class="card flex-card">
		<h3 class="mb-3">
			Found {overlaps.length} Overlap{overlaps.length !== 1 ? 's' : ''} ({startYear} - {endYear})
		</h3>
		<p class="text-muted mb-4">
			Showing occurrences where {gregorianMonthName}
			{gregorianDay} overlaps with {hebrewMonthName}
			{hebrewDay}
		</p>

		{#if upcomingOverlaps.length > 0}
			<h4 class="mt-4 mb-3">Upcoming Overlaps</h4>
			<div class="table-responsive">
				<table class="table table-striped table-hover">
					<thead>
						<tr>
							<th>Hebrew Date</th>
							<th>Gregorian Date</th>
							<th>Type</th>
						</tr>
					</thead>
					<tbody>
						{#each upcomingOverlaps as overlap}
							<tr>
								<td>{overlap.hebrewDate}</td>
								<td>
									{overlap.gregorianDateDisplay}
									<span class="text-muted small">
										(starts {overlap.eveningStartDateDisplay})
									</span>
								</td>
								<td>
									{#if overlap.eveningOnly}
										<span class="badge bg-secondary">Evening only</span>
									{:else}
										<span class="badge bg-success">Full day</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if pastOverlaps.length > 0}
			<h4 class="mt-5 mb-3">Past Overlaps</h4>
			<div class="table-responsive">
				<table class="table table-striped table-hover">
					<thead>
						<tr>
							<th>Hebrew Date</th>
							<th>Gregorian Date</th>
							<th>Type</th>
						</tr>
					</thead>
					<tbody>
						{#each pastOverlaps as overlap}
							<tr>
								<td>{overlap.hebrewDate}</td>
								<td>
									{overlap.gregorianDateDisplay}
									<span class="text-muted small">
										(starts {overlap.eveningStartDateDisplay})
									</span>
								</td>
								<td>
									{#if overlap.eveningOnly}
										<span class="badge bg-secondary">Evening only</span>
									{:else}
										<span class="badge bg-success">Full day</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<div class="mt-3">
			<p class="text-muted small">
				<strong>Note:</strong> Hebrew dates begin at sundown and continue through the next day until sundown. "Full day" means the Hebrew date's daytime overlaps with the Gregorian date. "Evening only"
				means only the evening (after sundown) of the Gregorian date overlaps with the Hebrew date.
			</p>
		</div>
	</div>
{/if}

<style>
	h3 {
		color: var(--bs-primary);
	}

	h4 {
		margin-bottom: 0.75em;
		font-size: 1.2em;
	}

	.overlap-symbol {
		font-size: 2.5em;
		color: var(--bs-primary);
		padding-top: 1.5em;
	}

	#gregorianDay,
	#hebrewDay {
		width: 5em;
	}

	.form-label {
		font-size: 0.9em;
		margin-bottom: 0.25rem;
	}

	.table {
		margin-top: 1em;
	}

	.table th {
		background-color: var(--bs-light);
		font-weight: 600;
	}

	.badge {
		font-size: 0.85em;
	}

	h4 {
		color: var(--bs-dark);
		font-size: 1.3em;
	}

	@media (max-width: 768px) {
		.overlap-symbol {
			padding-top: 0;
			padding-bottom: 0.5em;
		}
	}
</style>
