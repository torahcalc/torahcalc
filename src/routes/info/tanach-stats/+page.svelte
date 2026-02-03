<script>
	import { getStats } from '$lib/js/tanach-stats.js';

	const description = 'This table lists the number of chapters, verses, words, and letters in each book of the Tanach and the number of parshios in each book of Torah.';

	// Define the structure of all sections and books
	const sections = [
		{
			type: 'overall',
			name: 'tanach',
			displayNames: ['Tanach', '', ''],
			cssClass: 'secondrow',
		},
		{
			type: 'section',
			name: 'the torah',
			displayNames: ['Torah', '', 'תּוֹרָה'],
			cssClass: 'headrow',
			books: [
				{ name: 'sefer bereishis', displayNames: ['Bereishis', 'Genesis', 'בְּרֵאשִׁית'] },
				{ name: 'sefer shemos', displayNames: ['Shemos', 'Exodus', 'שְׁמוֹת'] },
				{ name: 'sefer vayikra', displayNames: ['Vayikra', 'Leviticus', 'וַיִּקְרָא'] },
				{ name: 'sefer bamidbar', displayNames: ['Bamidbar', 'Numbers', 'בְּמִדְבַּר'] },
				{ name: 'sefer devarim', displayNames: ['Devarim', 'Deuteronomy', 'דְּבָרִים'] },
			],
		},
		{
			type: 'section',
			name: 'neviim',
			displayNames: ["Nevi'im", '', 'נְבִיאִים'],
			cssClass: 'headrow',
			books: [
				{ name: 'yehoshua', displayNames: ['Yehoshua', 'Joshua', 'יְהוֹשֻעַ'] },
				{ name: 'shoftim', displayNames: ['Shoftim', 'Judges', 'שׁוֹפְטִים'] },
				{ name: 'shmuel i', displayNames: ['Shmuel I', 'Samuel I', 'שְׁמוּאֵל א'] },
				{ name: 'shmuel ii', displayNames: ['Shmuel II', 'Samuel II', 'שְׁמוּאֵל ב'] },
				{ name: 'melachim i', displayNames: ['Malachim I', 'Kings I', 'מלכים א'] },
				{ name: 'melachim ii', displayNames: ['Melachim II', 'Kings II', 'מלכים ב'] },
				{ name: 'yeshayahu', displayNames: ['Yeshayahu', 'Isaiah', 'יְשַׁעְיָהוּ'] },
				{ name: 'yirmeyahu', displayNames: ['Yirmeyahu', 'Jeremiah', 'יִרְמְיָהוּ'] },
				{ name: 'yechezkel', displayNames: ['Yechezkel', 'Ezekiel', 'יְחֶזְקֵיאל'] },
			],
		},
		{
			type: 'subsection',
			name: 'trei asar',
			displayNames: ['Trei Asar', '', 'תְּרֵי עֲשַׂר'],
			cssClass: 'subheadrow',
			books: [
				{ name: 'hoshea', displayNames: ['Hoshea', 'Hosea', 'הוֹשֵׁעַ'] },
				{ name: 'yoel', displayNames: ['Yoel', 'Joel', 'יוֹאֵל'] },
				{ name: 'amos', displayNames: ['Amos', 'Amos', 'עָמוֹס'] },
				{ name: 'ovadyah', displayNames: ['Ovadyah', 'Obadiah', 'עֹבַדְיָה'] },
				{ name: 'yonah', displayNames: ['Yonah', 'Jonah', 'יוֹנָה'] },
				{ name: 'michah', displayNames: ['Micah', 'Micah', 'מִיכָה'] },
				{ name: 'nachum', displayNames: ['Nachum', 'Nahum', 'נַחוּם'] },
				{ name: 'chavakuk', displayNames: ['Chabakuk', 'Habakuk', 'חֲבַקּוּק'] },
				{ name: 'tzefanyah', displayNames: ['Tzefanyah', 'Zephaniah', 'צְפַנְיָה'] },
				{ name: 'chagai', displayNames: ['Chagai', 'Haggai', 'חַגַּי'] },
				{ name: 'zecharyah', displayNames: ['Zecharyah', 'Zachariah', 'זְכַרְיָה'] },
				{ name: 'malachi', displayNames: ['Malachi', 'Malachi', 'מַלְאָכִי'] },
			],
		},
		{
			type: 'section',
			name: 'kesuvim',
			displayNames: ['Kesuvim', '', 'כְּתוּבִים'],
			cssClass: 'headrow',
			books: [
				{ name: 'divrei hayamim i', displayNames: ['Divrei Hayamim I', 'Chronicles I', 'דִּבְרֵי הַיָּמִים א'] },
				{ name: 'divrei hayamim ii', displayNames: ['Divrei Hayamim II', 'Chronicles II', 'דִּבְרֵי הַיָּמִים ב'] },
				{ name: 'tehillim', displayNames: ['Tehillim', 'Psalms', 'תְהִלִּים'] },
				{ name: 'iyov', displayNames: ['Iyov', 'Job', 'אִיּוֹב'] },
				{ name: 'mishlei', displayNames: ['Mishlei', 'Proverbs', 'מִשְלֵי'] },
				{ name: 'rut', displayNames: ['Rut', 'Ruth', 'רוּת'] },
				{ name: 'shir hashirim', displayNames: ['Shir Hashirim', 'Song of Songs', 'שִׁיר הַשִׁירִים'] },
				{ name: 'koheles', displayNames: ['Kohelleth', 'Ecclesiastes', 'קֹהֶלֶת'] },
				{ name: 'eichah', displayNames: ['Eichah', 'Lamentations', 'אֵיכָה'] },
				{ name: 'esther', displayNames: ['Esther', 'Esther', 'אֶסְתֵר'] },
				{ name: 'daniel', displayNames: ['Daniel', 'Daniel', 'דָּנִיֵּאל'] },
				{ name: 'ezra', displayNames: ['Ezra', 'Ezra', 'עֶזְרָא'] },
				{ name: 'nechemiah', displayNames: ['Nechemiah', 'Nehemiah', 'נְחֶמְיָה'] },
			],
		},
	];

	/**
	 * Format number with comma separators
	 * @param {number} num
	 * @returns {string}
	 */
	function formatNumber(num) {
		return num.toLocaleString();
	}

	/**
	 * Format statistic value with empty cell for undefined
	 * @param {number | undefined} value
	 * @returns {string}
	 */
	function formatStat(value) {
		return value !== undefined ? formatNumber(value) : '';
	}
</script>

<svelte:head>
	<title>TorahCalc | Tanach Stats</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Tanach Stats</h1>

	<p>{description}</p>

	<span>Related:</span>
	<ul>
		<li><a href="/info/tanach-verses-by-chapter">Tanach Verses By Chapter</a> - number of verses in each chapter of the Tanach.</li>
		<li><a href="/info/parsha-stats">Parsha Stats</a> - verses, words, and letters for each portion of the Torah.</li>
	</ul>

	<p class="scroll-for-more">Scroll horizontally in the table to view more.</p>

	<div class="table-responsive">
		<table class="table table-bordered table-striped table-hover">
			<thead>
				<tr class="firstrow">
					<th colspan="3">Book / ספר</th>
					<th>Chapters / פרקים</th>
					<th>Verses / פסוקים</th>
					<th>Words / מילים</th>
					<th>Letters / אותיות</th>
					<th>Portions / פרשיות</th>
				</tr>
			</thead>
			<tbody>
				{#each sections as section}
					{@const sectionStats = getStats(section.name, 'book')}
					{#if section.type === 'overall'}
						<tr class={section.cssClass}>
							<td colspan="3">{section.displayNames[0]}</td>
							<td>{formatStat(sectionStats.chapters)}</td>
							<td>{formatNumber(sectionStats.verses)}</td>
							<td>{formatNumber(sectionStats.words)}</td>
							<td>{formatNumber(sectionStats.letters)}</td>
							<td>{formatStat(sectionStats.portions)}</td>
						</tr>
					{:else}
						<tr class={section.cssClass}>
							<td colspan="3">
								{section.displayNames[0]}{#if section.displayNames[2]}
									- {section.displayNames[2]}{/if}
							</td>
							<td>{formatStat(sectionStats.chapters)}</td>
							<td>{formatNumber(sectionStats.verses)}</td>
							<td>{formatNumber(sectionStats.words)}</td>
							<td>{formatNumber(sectionStats.letters)}</td>
							<td class={sectionStats.portions ? '' : 'empty'}>{formatStat(sectionStats.portions) || '\u00A0'}</td>
						</tr>
						{#each section.books as book}
							{@const bookStats = getStats(book.name, 'book')}
							<tr>
								<td>{book.displayNames[0]}</td>
								<td>{book.displayNames[1]}</td>
								<td>{book.displayNames[2]}</td>
								<td>{formatStat(bookStats.chapters)}</td>
								<td>{formatNumber(bookStats.verses)}</td>
								<td>{formatNumber(bookStats.words)}</td>
								<td>{formatNumber(bookStats.letters)}</td>
								<td class={bookStats.portions ? '' : 'empty'}>{formatStat(bookStats.portions) || '\u00A0'}</td>
							</tr>
						{/each}
					{/if}
				{/each}
			</tbody>
		</table>
	</div>

	<h3 class="mt-3">About this data</h3>

	<p>
		This data was calculated using a
		<a href="https://pastebin.com/N4PpNN2h">Python script</a>
		on the
		<a href="https://www.mechon-mamre.org/dlx.htm"><i>"Hebrew without vowels - masoretic spelling"</i></a>
		files downloaded from
		<a href="https://www.mechon-mamre.org/">https://www.mechon-mamre.org/</a>.
	</p>
</section>

<style>
	.scroll-for-more {
		display: none;
		text-align: center;
		font-size: 92%;
		background: #fff;
		border-radius: 0.25rem;
		padding: 0.5em;
	}

	@media screen and (max-width: 708px) {
		.scroll-for-more {
			display: block;
		}
	}

	th {
		background-color: #0d3c61;
		color: #fff;
		font-weight: bold;
	}
	tr.secondrow > td {
		background-color: #145a92;
		color: #fff;
		font-weight: bold;
	}
	tr.headrow > td {
		background-color: #2196f3;
		color: #fff;
		font-weight: bold;
	}
	tr.subheadrow > td {
		background-color: #7ac0f8;
		color: #111;
		font-weight: bold;
	}
</style>
