<script>
	import { getNextHebrewMonth } from '$lib/js/utils';

	const description = 'Create a candle-lighting and Havdalah Zmanim chart for any location and date.';

	const nextHebrewMonth = getNextHebrewMonth();

	let hebYear = nextHebrewMonth.year;
	let location = '';
	let candlelightingMinutes = 18;
</script>

<svelte:head>
	<title>TorahCalc | Candle-lighting and Havdalah Charts</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Candle-lighting and Havdalah Charts</h1>

	<p class="center">{description}</p>

	<!-- Input year, location, and candlelighting minutes, when the button is clicked, the chart is opened in a new tab -->
	<div class="card flex-card input-control">
		<div class="card-body">
			<div class="form-group">
				<label for="year">Hebrew Year</label>
				<input type="number" id="year" bind:value={hebYear} class="form-control" />
			</div>
			<div class="form-group mt-3">
				<label for="location">Location <span class="text-muted small">(Enter a city, zip code, latitude/longitude, etc.)</span></label>
				<input type="text" id="location" bind:value={location} class="form-control" required />
			</div>
			<div class="form-group mt-3">
				<label for="candlelightingMinutes">Minutes before sunset for candle lighting</label>
				<input type="number" id="candlelightingMinutes" bind:value={candlelightingMinutes} class="form-control" />
			</div>
			<button class="btn btn-primary mt-3" on:click={() => {
				const url = `/api/zmanimchart?year=${hebYear}&location=${encodeURIComponent(location)}&candleLightingMinutes=${candlelightingMinutes}`;
				window.open(url, '_blank');
			}}>Create Zmanim Chart</button>
		</div>
	</div>
</section>
