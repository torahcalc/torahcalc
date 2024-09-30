<script>
	import { getNextHebrewMonth } from '$lib/js/utils';

	const description = 'Create a candle-lighting and Havdalah Zmanim chart for any location and year.';

	const nextHebrewMonth = getNextHebrewMonth();

	let hebYear = nextHebrewMonth.year;
	let location = 'New York, NY';
	let candlelightingMinutes = 18;
	let headingColor = '#000000';
	let monthHeadingColor = '#000000';
	let textColor = '#000000';
	let backgroundColor = '#FFFFFF';
	let rowColor1 = '#EDF7FF';
	let rowColor2 = '#C3E3FF';
	let fontSize = '14px';
	let mainFont = 'Open Sans';
	let bodyFont = 'Open Sans';
	let logoUrl = '';
	let secondaryImageUrl = '';
	let footerText = '';
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
					<input type="color" id="headingColor" bind:value={headingColor} class="form-control" />
				</div>
				<div class="form-group mt-3">
					<label for="monthHeadingColor">Month Heading Color</label>
					<input type="color" id="monthHeadingColor" bind:value={monthHeadingColor} class="form-control" />
				</div>
				<div class="form-group mt-3">
					<label for="textColor">Text Color</label>
					<input type="color" id="textColor" bind:value={textColor} class="form-control" />
				</div>
				<div class="form-group mt-3">
					<label for="backgroundColor">Background Color</label>
					<input type="color" id="backgroundColor" bind:value={backgroundColor} class="form-control"/>
				</div>
				<div class="form-group mt-3">
					<label for="rowColor1">Row Color 1</label>
					<input type="color" id="rowColor1" bind:value={rowColor1} class="form-control" />
				</div>
				<div class="form-group mt-3">
					<label for="rowColor2">Row Color 2</label>
					<input type="color" id="rowColor2" bind:value={rowColor2} class="form-control" />
				</div>
				<div class="form-group mt-3">
					<label for="fontSize">Font Size <span class="text-muted small">(for example: "14px", "1em")</span></label>
					<input type="text" id="fontSize" bind:value={fontSize} class="form-control" placeholder="14px" />
				</div>
				<div class="form-group mt-3">
					<label for="mainFont">Main Font <span class="text-muted small">(Name of font from Google Fonts)</span></label>
					<input type="text" id="mainFont" bind:value={mainFont} class="form-control" placeholder="Open Sans" />
				</div>
				<div class="form-group mt-3">
					<label for="bodyFont">Body Font <span class="text-muted small">(Name of font from Google Fonts)</span></label>
					<input type="text" id="bodyFont" bind:value={bodyFont} class="form-control" placeholder="Open Sans" />
				</div>
				<div class="form-group mt-3">
					<label for="logoUrl">Logo URL (optional)</label>
					<input type="text" id="logoUrl" bind:value={logoUrl} class="form-control" placeholder="" />
				</div>
				<div class="form-group mt-3">
					<label for="secondaryImageUrl">Secondary Image URL (optional)</label>
					<input type="text" id="secondaryImageUrl" bind:value={secondaryImageUrl} class="form-control" placeholder="" />
				</div>
				<div class="form-group mt-3">
					<label for="footerText">Override Footer Text (optional)</label>
					<input type="text" id="footerText" bind:value={footerText} class="form-control" placeholder="" />
				</div>
			</details>

			<button
				class="btn btn-primary mt-3"
				on:click={() => {
					const params = new URLSearchParams();
					params.append('year', hebYear.toString());
					params.append('location', location);
					params.append('candleLightingMinutes', candlelightingMinutes.toString());
					params.append('headingColor', headingColor);
					params.append('monthHeadingColor', monthHeadingColor);
					params.append('textColor', textColor);
					params.append('backgroundColor', backgroundColor);
					params.append('rowColor1', rowColor1);
					params.append('rowColor2', rowColor2);
					if (fontSize) params.append('fontSize', fontSize);
					if (mainFont) params.append('mainFont', mainFont);
					if (bodyFont) params.append('bodyFont', bodyFont);
					if (logoUrl) params.append('logoUrl', logoUrl);
					if (secondaryImageUrl) params.append('secondaryImageUrl', secondaryImageUrl);
					if (footerText) params.append('footerText', footerText);

					const url = `/api/zmanimchart?${params.toString()}`;
					window.open(url, '_blank');
				}}>Create Zmanim Chart</button
			>
		</div>
	</div>
</section>
