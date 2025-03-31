<script>
	import { nextBirkasHachama } from '$lib/js/hachama';

	/** @type {number} The current year */
	const currentYear = new Date().getFullYear();

	/** @type {number} The year to search for the next Birkas Hachama after */
	let year = new Date().getFullYear();

	/** @type {import('$lib/js/hachama').BirkasHachamaResult} The next Birkas Hachama result */
	$: birkasHachama = nextBirkasHachama(year);

	const LIST_YEARS = 200;

	/** @type {import('$lib/js/hachama').BirkasHachamaResult[]} The Birkas Hachama results from the past */
	const pastBirkasHachamaList = [];

	/** @type {import('$lib/js/hachama').BirkasHachamaResult[]} The Birkas Hachama results from the future */
	const futureBirkasHachamaList = [];

	for (let i = -LIST_YEARS; i < LIST_YEARS; i+= 28) {
		const yearToCheck = currentYear + i;
		const result = nextBirkasHachama(yearToCheck);
		if (result.gregorianDate.year < currentYear) {
			pastBirkasHachamaList.push(result);
		} else if (result.gregorianDate.year > currentYear) {
			futureBirkasHachamaList.push(result);
		}
	}

	/**
	 * Change the year to search for the next or previous Birkas Hachama
	 * @param {number} direction - The direction to search for the next Birkas Hachama
	 */
	function changeYear(direction) {
		year += direction * 28;
	}
</script>

<div class="card flex-card mb-0 text-center">
	<h4 class="mb-3">{`Birkas Hachama ${year < currentYear ? (year === currentYear - 28 ? 'last took place' : 'took place') : year === currentYear ? 'will next take place' : 'will take place'}:`}</h4>
	<h5 class="mb-3"><strong>{birkasHachama.gregorianDate.display}</strong></h5>
	<h5 class="mb-4">(<strong>{birkasHachama.hebrewDate.displayEn}</strong>)</h5>
	{#if birkasHachama.hebrewDate.warning}
		<p class="text-danger">{@html birkasHachama.hebrewDate.warning}</p>
	{/if}

	<div class="d-flex justify-content-center gap-2">
		<button class="btn btn-outline-secondary" on:click={() => changeYear(-1)}><span class="icon">←</span> Previous</button>
		<button class="btn btn-outline-secondary" on:click={() => changeYear(1)}>Next <span class="icon">→</span></button>
	</div>
</div>

<div class="card flex-card mb-0">
	<h5 class="mb-3 text-center">When Birkas Hachama occurred in the past {LIST_YEARS} years:</h5>
	{#if pastBirkasHachamaList.length > 0}
		<div class="d-flex flex-wrap gap-1 justify-content-center">
			{#each pastBirkasHachamaList as result}
				<div class="border p-2 w-100 text-center m-0">{result.gregorianDate.display} ({result.hebrewDate.displayEn})</div>
			{/each}
		</div>
	{/if}
	<h5 class="mt-4 mb-3 text-center">When Birkas Hachama will occur in the next {LIST_YEARS} years:</h5>
	{#if futureBirkasHachamaList.length > 0}
		<div class="d-flex flex-wrap gap-1 justify-content-center">
			{#each futureBirkasHachamaList as result}
				<div class="border p-2 w-100 text-center m-0">{result.gregorianDate.display} ({result.hebrewDate.displayEn})</div>
			{/each}
		</div>
	{/if}
</div>
