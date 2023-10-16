<script>
	import Fa from 'svelte-fa/src/fa.svelte';
	import {
		faBookOpenCover,
		faCalculator,
		faCalendarAlt,
		faCalendarPlus,
		faCalendarStar,
		faEclipse,
		faListCheck,
		faScaleBalanced,
		faSolarSystem,
		faSunBright,
		faSunrise,
		faTableColumns,
		faWheatAlt,
	} from '@danieloi/pro-solid-svg-icons';
	import { getConverters, getUnit, getUnits } from '$lib/js/unitconverter';
	import { METHOD_NAMES } from '$lib/js/gematria';
	import { ZMANIM_NAMES } from '$lib/js/zmanim';
	import InputExample from './InputExample.svelte';
	import AvailableOptionsList from './AvailableOptionsList.svelte';
	import { LEARNING_TYPE_NAMES } from '$lib/js/dailylearning';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction;

	const converters = getConverters(false);

	/** @type {string[]} The list of zmanim */
	const zmanimList = [];
	for (const zmanimType of Object.keys(ZMANIM_NAMES)) {
		// @ts-ignore - assume key exists
		zmanimList.push(...Object.values(ZMANIM_NAMES[zmanimType]).map((zmanim) => zmanim.name));
	}
</script>

<div class="card flex-card examples">
	<h4 class="mb-4">Examples of what you can enter</h4>

	<div class="row g-2 categories">
		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faScaleBalanced} class="me-1" /> Unit conversions</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="Convert 3 Tefachim to inches." /></li>
					<li><InputExample {clickFunction} query="How many Amos are in a Parsah?" /></li>
					<li><InputExample {clickFunction} query="Convert 40 Seah to US liquid gallons." /></li>
					<li><InputExample {clickFunction} query="Convert 1 US Dollar to Perutos." /></li>
					<li><InputExample {clickFunction} query="How many Chalakim are in an hour?" /></li>
					<li><InputExample {clickFunction} query="Conversion chart for 1 Mil" /></li>
				</ul>

				<div>
					{#await converters then converters}
						<details>
							<summary>Show list of units</summary>

							<AvailableOptionsList mapping={getUnits(converters)} transform={async ([unitType, unitId]) => (await getUnit(unitType, unitId)).display} />
						</details>
					{:catch error}
						<div>An error occurred while loading the list of units.</div>
					{/await}
				</div>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faCalculator} class="me-1" /> Gematria</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="Calculate Gematria of תורה." /></li>
					<li><InputExample {clickFunction} query="Calculate Mispar Gadol of מלך." /></li>
					<li><InputExample {clickFunction} query="Calculate Mispar Siduri of פרעה." /></li>
					<li><InputExample {clickFunction} query="Calculate Mispar Katan Mispari of משיח." /></li>
					<li><InputExample {clickFunction} query="Calculate Atbash of תורה." /></li>
					<li><InputExample {clickFunction} query="Calculate AvGad of משה." /></li>
				</ul>

				<div>
					<details>
						<summary>Show list of gematria methods</summary>

						<AvailableOptionsList array={Object.values(METHOD_NAMES).map((method) => method.name)} />
					</details>
				</div>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faListCheck} class="me-1" /> Gematria Search</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="What words have a gematria of 613?" /></li>
					<li><InputExample {clickFunction} query="What words have the same gematria as תורה?" /></li>
					<li><InputExample {clickFunction} query="What pesukim have a gematria of 930?" /></li>
				</ul>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faTableColumns} class="me-1" /> Gematria Two-Word Match</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="Gematria equivalences for תורה and משנה." /></li>
					<li><InputExample {clickFunction} query="Gematria equivalences for תפילין and חיים with Mispar Kolel." /></li>
					<li><InputExample {clickFunction} query="Gematria equivalences for תורה and משנה in the same method." /></li>
				</ul>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faCalendarAlt} class="me-1" /> Hebrew calendar</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="Convert 21 Kislev, 5730 to Gregorian calendar." /></li>
					<li><InputExample {clickFunction} query="Convert December 1, 1969 to Hebrew calendar." /></li>
					<li><InputExample {clickFunction} query="Convert December 1, 1969 after sunset." /></li>
					<li><InputExample {clickFunction} query="Convert 5780 to Gregorian calendar." /></li>
					<li><InputExample {clickFunction} query="When will 14 Nissan fall next year?" /></li>
					<li><InputExample {clickFunction} query="Today's date on Hebrew calendar." /></li>
				</ul>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faCalendarStar} class="me-1" /> Jewish holidays</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="When is Rosh Hashana?" /></li>
					<li><InputExample {clickFunction} query="When did Pesach fall last year?" /></li>
					<li><InputExample {clickFunction} query="When is the next Rosh Chodesh?" /></li>
					<li><InputExample {clickFunction} query="List Jewish holidays in Hebrew year 5784." /></li>
					<li><InputExample {clickFunction} query="List Jewish holidays in Gregorian year 2023." /></li>
					<li><InputExample {clickFunction} query="List upcoming Jewish holidays." /></li>
				</ul>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faCalendarPlus} class="me-1" /> Leap Years</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="Is this year a leap year?" /></li>
					<li><InputExample {clickFunction} query="Was 5775 a leap year?" /></li>
					<li><InputExample {clickFunction} query="Will 5790 be a leap year?" /></li>
					<li><InputExample {clickFunction} query="Is next year a leap year?" /></li>
					<li><InputExample {clickFunction} query="Is Gregorian year 2023 a leap year?" /></li>
					<li><InputExample {clickFunction} query="Is Hebrew year 5784 a leap year?" /></li>
				</ul>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faBookOpenCover} class="me-1" /> Daily Learning / Daf Yomi</h5>
				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="What is today's Daf Yomi?" /></li>
					<li><InputExample {clickFunction} query="What is the Daf Yomi for tomorrow?" /></li>
					<li><InputExample {clickFunction} query="What is the Nach Yomi for May 12, 2023?" /></li>
					<li><InputExample {clickFunction} query="What are the daily psalms for tomorrow?" /></li>
					<li><InputExample {clickFunction} query="What is the Weekly Daf for 18 Iyar?" /></li>
				</ul>

				<div>
					<details>
						<summary>Show list of daily learning types</summary>

						<AvailableOptionsList array={Object.values(LEARNING_TYPE_NAMES)} />
					</details>
				</div>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faEclipse} class="me-1" /> Molad</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="Calculate the molad of Sivan 5781." /></li>
					<li><InputExample {clickFunction} query="When will the molad of Elul be?" /></li>
					<li><InputExample {clickFunction} query="When is the next molad?" /></li>
					<li><InputExample {clickFunction} query="Calculate molados for 5781." /></li>
				</ul>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faWheatAlt} class="me-1" /> Sefiras HaOmer</h5>
				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="Sefiras Haomer for tonight" /></li>
					<li><InputExample {clickFunction} query="Day of Omer on May 12, 2023" /></li>
					<li><InputExample {clickFunction} query="Day of Omer on April 17, 2023 at night" /></li>
					<li><InputExample {clickFunction} query="Day of Omer on 18 Iyar" /></li>
				</ul>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faSunrise} class="me-1" /> Zmanim</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="What time is Chatzos in New York?" /></li>
					<li><InputExample {clickFunction} query="Zmanim for Denver" /></li>
					<li><InputExample {clickFunction} query="Zmanim for 1 Teves 5784 in Jerusalem" /></li>
					<li><InputExample {clickFunction} query="What time is sunset on 12/25/2023 in Los Angeles?" /></li>
					<li><InputExample {clickFunction} query="How long is a Shaah Zmanis in 31.776, 35.23?" /></li>
				</ul>

				<div>
					<details>
						<summary>Show list of zmanim</summary>

						<AvailableOptionsList array={zmanimList} />
					</details>
				</div>
			</div>
		</div>

		<div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faSolarSystem} class="me-1" /> Hebrew Zodiac Signs</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="What is the zodiac sign for March 27, 1989?" /></li>
					<li><InputExample {clickFunction} query="What is the zodiac sign for 1 Teves?" /></li>
					<li><InputExample {clickFunction} query="What is the zodiac sign for December 1, 1979?" /></li>
					<li><InputExample {clickFunction} query="What is the zodiac sign for 11 Nissan?" /></li>
				</ul>
			</div>
		</div>

       <div class="col-md-6">
			<div class="category">
				<h5><Fa icon={faSunBright} class="me-1" /> Birkas Hachama</h5>

				<ul class="list-unstyled">
					<li><InputExample {clickFunction} query="When is the next Birkas Hachama?" /></li>
					<li><InputExample {clickFunction} query="When was the last Birkas Hachama?" /></li>
					<li><InputExample {clickFunction} query="When will Birkas Hachama be after 2037?" /></li>
					<li><InputExample {clickFunction} query="When was Birkas Hachama before 2009?" /></li>
				</ul>
			</div>
	   </div>

		<div class="col-12 px-3 pt-3">
			<h6>More input types coming soon!</h6>
		</div>
	</div>
</div>

<style>
	.examples {
		padding: 1rem;
	}
	.examples > h4 {
		padding-top: 1rem;
		padding-left: 1rem;
	}
	.category {
		--category-color: 0, 0, 0;
		border: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color);
		border-radius: var(--bs-border-radius-lg);
		margin: 0.5rem;
		padding: 1rem;
		background-color: rgba(var(--category-color), 0.05);
		height: calc(100% - 1em);
	}
	.category h5 {
		color: rgba(var(--category-color), 1);
	}
	.categories > :nth-child(12n + 1) .category {
		--category-color: 56, 142, 60; /* green */
	}
	.categories > :nth-child(12n + 2) .category {
		--category-color: 63, 81, 181; /* indigo */
	}
	.categories > :nth-child(12n + 3) .category {
		--category-color: 156, 39, 176; /* purple */
	}
	.categories > :nth-child(12n + 4) .category {
		--category-color: 33, 150, 243; /* blue */
	}
	.categories > :nth-child(12n + 5) .category {
		--category-color: 233, 30, 99; /* magenta */
	}
	.categories > :nth-child(12n + 6) .category {
		--category-color: 0, 188, 212; /* cyan */
	}
	.categories > :nth-child(12n + 7) .category {
		--category-color: 244, 67, 54; /* red */
	}
	.categories > :nth-child(12n + 8) .category {
		--category-color: 96, 125, 139; /* blue-grey */
	}
	.categories > :nth-child(12n + 9) .category {
		--category-color: 0, 150, 136; /* teal */
	}
	.categories > :nth-child(12n + 10) .category {
		--category-color: 121, 85, 72; /* brown */
	}
	.categories > :nth-child(12n + 11) .category {
		--category-color: 255, 152, 0; /* orange */
	}
	.categories > :nth-child(12n + 12) .category {
		--category-color: 102, 51, 153; /* purple */
	}
</style>
