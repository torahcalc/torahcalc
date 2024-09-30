<script>
	import { getNextHebrewMonth } from '$lib/js/utils';

	const description = 'Create a candle-lighting and Havdalah Zmanim chart for any location and year.';

	const nextHebrewMonth = getNextHebrewMonth();

	let hebYear = nextHebrewMonth.year;
	let location = 'New York, NY';
	let candlelightingMinutes = 18;
</script>

<svelte:head>
	<title>TorahCalc | Candle-lighting and Havdalah Charts</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Candle-lighting and Havdalah Charts (Beta)</h1>

	<p class="center">{description}</p>

	<div class="card flex-card input-control">
		<div class="card-body">
			<div class="form-group">
				<label for="year">Hebrew Year</label>
				<input type="number" id="year" bind:value={hebYear} class="form-control" placeholder={`${nextHebrewMonth.year}`} required />
			</div>
			<div class="form-group mt-3">
				<label for="location">Location <span class="text-muted small">(Enter a city, zip code, latitude/longitude, etc.)</span></label>
				<input type="text" id="location" bind:value={location} class="form-control" placeholder="New York, NY" required />
			</div>
			<div class="form-group mt-3">
				<label for="candlelightingMinutes">Minutes before sunset for candle lighting</label>
				<input type="number" id="candlelightingMinutes" bind:value={candlelightingMinutes} class="form-control" placeholder="18" required />
			</div>
			<details class="mt-3">
				<summary>Advanced Options</summary>

				<div class="form-group mt-3">
					<label for="headingColor">Heading Color</label>
					<input type="color" id="headingColor" class="form-control" value="#000000" />
				</div>
				<div class="form-group mt-3">
					<label for="monthHeadingColor">Month Heading Color</label>
					<input type="color" id="monthHeadingColor" class="form-control" value="#000000" />
				</div>
				<div class="form-group mt-3">
					<label for="backgroundColor">Background Color</label>
					<input type="color" id="backgroundColor" class="form-control" value="#FFFFFF" />
				</div>
				<div class="form-group mt-3">
					<label for="rowColor1">Row Color 1</label>
					<input type="color" id="rowColor1" class="form-control" value="#EDF7FF" />
				</div>
				<div class="form-group mt-3">
					<label for="rowColor2">Row Color 2</label>
					<input type="color" id="rowColor2" class="form-control" value="#C3E3FF" />
				</div>
				<div class="form-group mt-3">
					<label for="fontSize">Font Size</label>
					<input type="text" id="fontSize" class="form-control" placeholder="14px" />
				</div>
				<div class="form-group mt-3">
					<label for="mainFont">Main Font</label>
					<input type="text" id="mainFont" class="form-control" placeholder="Open Sans" />
				</div>
				<div class="form-group mt-3">
					<label for="bodyFont">Body Font</label>
					<input type="text" id="bodyFont" class="form-control" placeholder="Open Sans" />
				</div>
				<div class="form-group mt-3">
					<label for="logoUrl">Logo URL (optional)</label>
					<input type="text" id="logoUrl" class="form-control" placeholder="" />
				</div>
				<div class="form-group mt-3">
					<label for="secondaryImageUrl">Secondary Image URL (optional)</label>
					<input type="text" id="secondaryImageUrl" class="form-control" placeholder="" />
				</div>
				<div class="form-group mt-3">
					<label for="footerText">Override Footer Text (optional)</label>
					<input type="text" id="footerText" class="form-control" placeholder="" />
				</div>
			</details>

			<button
				class="btn btn-primary mt-3"
				on:click={() => {
					const url = `/api/zmanimchart?year=${hebYear}&location=${encodeURIComponent(location)}&candleLightingMinutes=${candlelightingMinutes}`;
					window.open(url, '_blank');
				}}>Create Zmanim Chart</button
			>
		</div>
	</div>
</section>
