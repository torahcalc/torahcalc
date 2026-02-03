<script>
	import { getStats } from '$lib/js/tanach-stats.js';

	const description = 'This table lists the number of verses, words, and letters in each Parsha (Torah Portion) in the Torah.';

	// Define parshios by book with display names
	const books = [
		{
			name: 'sefer bereishis',
			hebrewName: 'בראשית',
			displayName: 'Sefer Bereishis',
			parshios: [
				{ name: 'parshas bereishis', displayName: 'Bereishis', hebrewName: 'בראשית' },
				{ name: 'parshas noach', displayName: 'Noach', hebrewName: 'נוח' },
				{ name: 'parshas lech lecha', displayName: 'Lech Lecha', hebrewName: 'לך-לך' },
				{ name: 'parshas vayeira', displayName: 'Vayeira', hebrewName: 'ויירא' },
				{ name: 'parshas chayei sarah', displayName: 'Chayei Sarah', hebrewName: 'חיי שרה' },
				{ name: 'parshas toldos', displayName: 'Toledos', hebrewName: 'תולדות' },
				{ name: 'parshas vayetze', displayName: 'Vayetze', hebrewName: 'וייצא' },
				{ name: 'parshas vayishlach', displayName: 'Vayishlach', hebrewName: 'וישלח' },
				{ name: 'parshas vayeshev', displayName: 'Vayeshev', hebrewName: 'ויישב' },
				{ name: 'parshas miketz', displayName: 'Miketz', hebrewName: 'מקץ' },
				{ name: 'parshas vayigash', displayName: 'Vayigash', hebrewName: 'וייגש' },
				{ name: 'parshas vayechi', displayName: 'Vayechi', hebrewName: 'ויחי' }
			]
		},
		{
			name: 'sefer shemos',
			hebrewName: 'שמות',
			displayName: 'Sefer Shemos',
			parshios: [
				{ name: 'parshas shemos', displayName: 'Shemos', hebrewName: 'שמות' },
				{ name: 'parshas vaeira', displayName: "Va'eira", hebrewName: 'ואירא' },
				{ name: 'parshas bo', displayName: 'Bo', hebrewName: 'בוא' },
				{ name: 'parshas beshalach', displayName: 'Beshalach', hebrewName: 'בשלח' },
				{ name: 'parshas yisro', displayName: 'Yisro', hebrewName: 'יתרו', versesNote: '*' },
				{ name: 'parshas mishpatim', displayName: 'Mishpatim', hebrewName: 'משפטים' },
				{ name: 'parshas terumah', displayName: 'Terumah', hebrewName: 'תרומה' },
				{ name: 'parshas tetzaveh', displayName: 'Tetzaveh', hebrewName: 'תצווה' },
				{ name: 'parshas ki sisa', displayName: 'Ki Sisa', hebrewName: 'כי תישא' },
				{ name: 'parshas vayakhel', displayName: 'Vayakhel', hebrewName: 'ויקהל' },
				{ name: 'parshas pekudei', displayName: 'Pekudei', hebrewName: 'פקודי' }
			]
		},
		{
			name: 'sefer vayikra',
			hebrewName: 'ויקרא',
			displayName: 'Sefer Vayikra',
			parshios: [
				{ name: 'parshas vayikra', displayName: 'Vayikra', hebrewName: 'ויקרא' },
				{ name: 'parshas tzav', displayName: 'Tzav', hebrewName: 'צו' },
				{ name: 'parshas shemini', displayName: 'Shemini', hebrewName: 'שמיני' },
				{ name: 'parshas tazria', displayName: 'Tazria', hebrewName: 'תזריע' },
				{ name: 'parshas metzora', displayName: 'Metzora', hebrewName: 'מצורע' },
				{ name: 'parshas acharei mos', displayName: 'Acharei Mos', hebrewName: 'אחרי מות' },
				{ name: 'parshas kedoshim', displayName: 'Kedoshim', hebrewName: 'קדושים' },
				{ name: 'parshas emor', displayName: 'Emor', hebrewName: 'אמור' },
				{ name: 'parshas behar', displayName: 'Behar', hebrewName: 'בהר סיניי' },
				{ name: 'parshas bechukosai', displayName: 'Bechukosai', hebrewName: 'בחוקותיי' }
			]
		},
		{
			name: 'sefer bamidbar',
			hebrewName: 'במדבר',
			displayName: 'Sefer Bamidbar',
			parshios: [
				{ name: 'parshas bamidbar', displayName: 'Bamidbar', hebrewName: 'במדבר' },
				{ name: 'parshas naso', displayName: 'Naso', hebrewName: 'נשוא' },
				{ name: "parshas beha'alosecha", displayName: "Beha'alosecha", hebrewName: 'בהעלותך' },
				{ name: 'parshas shlach', displayName: 'Shlach', hebrewName: 'שלח-לך' },
				{ name: 'parshas korach', displayName: 'Korach', hebrewName: 'קורח' },
				{ name: 'parshas chukas', displayName: 'Chukas', hebrewName: 'חוקת' },
				{ name: 'parshas balak', displayName: 'Balak', hebrewName: 'בלק' },
				{ name: 'parshas pinchas', displayName: 'Pinchas', hebrewName: 'פינחס' },
				{ name: 'parshas matos', displayName: 'Matos', hebrewName: 'מטות' },
				{ name: 'parshas masei', displayName: 'Masei', hebrewName: 'מסעי' }
			]
		},
		{
			name: 'sefer devarim',
			hebrewName: 'דברים',
			displayName: 'Sefer Devarim',
			parshios: [
				{ name: 'parshas devarim', displayName: 'Devarim', hebrewName: 'דברים' },
				{ name: "parshas va'eschanan", displayName: "Va'eschanan", hebrewName: 'ואתחנן', versesNote: '*' },
				{ name: 'parshas eikev', displayName: 'Eikev', hebrewName: 'עקב' },
				{ name: "parshas re'eh", displayName: "Re'eh", hebrewName: 'ראה' },
				{ name: 'parshas shoftim', displayName: 'Shoftim', hebrewName: 'שופטים' },
				{ name: 'parshas ki seitzei', displayName: 'Ki Seitzei', hebrewName: 'כי-תצא' },
				{ name: 'parshas ki savo', displayName: 'Ki Savo', hebrewName: 'כי-תבוא' },
				{ name: 'parshas nitzavim', displayName: 'Nitzavim', hebrewName: 'ניצבים' },
				{ name: 'parshas vayelech', displayName: 'Vayelech', hebrewName: 'וילך' },
				{ name: "parshas h'aazinu", displayName: "Ha'azinu", hebrewName: 'האזינו' },
				{ name: "parshas v'zos habrachah", displayName: "V'zos HaBrachah", hebrewName: 'וזאת הברכה' }
			]
		}
	];

	// Get Torah stats
	const torahStats = getStats('the torah', 'book');

	/**
	 * Format number with comma separators
	 * @param {number} num
	 * @returns {string}
	 */
	function formatNumber(num) {
		return num.toLocaleString();
	}
</script>

<svelte:head>
	<title>TorahCalc | Parsha Stats</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Parsha Stats</h1>

	<p>{description}</p>

	<span>Related:</span>
	<ul>
		<li><a href="/info/tanach-stats">Tanach Stats</a> - chapters, verses, words, and letters for each book in Tanach.</li>
		<li><a href="/info/tanach-verses-by-chapter">Tanach Verses By Chapter</a> - number of verses in each chapter of the Tanach.</li>
	</ul>

	<p class="scroll-for-more">Scroll horizontally in the table to view more.</p>

	<div class="table-responsive">
		<table class="table table-bordered table-striped table-hover">
			<thead>
				<tr class="firstrow">
					<th id="parsha" colspan="2">Portion / פרשה</th>
					<th id="verses">Verses / פסוקים</th>
					<th id="words">Words / מילים</th>
					<th id="letters">Letters / אותיות</th>
				</tr>
			</thead>
			<tbody>
				<tr class="secondrow">
					<td colspan="2">Torah - תּוֹרָה</td>
					<td>{formatNumber(torahStats.verses)}</td>
					<td>{formatNumber(torahStats.words)}</td>
					<td>{formatNumber(torahStats.letters)}</td>
				</tr>
				{#each books as book}
					{@const bookStats = getStats(book.name, 'book')}
					<tr class="headrow">
						<td colspan="2">{book.displayName} - {book.hebrewName}</td>
						<td>{formatNumber(bookStats.verses)}</td>
						<td>{formatNumber(bookStats.words)}</td>
						<td>{formatNumber(bookStats.letters)}</td>
					</tr>
					{#each book.parshios as parsha}
						{@const parshaStats = getStats(parsha.name, 'parsha')}
						<tr>
							<td>{parsha.displayName}</td>
							<td>{parsha.hebrewName}</td>
							<td>{parshaStats.verses}{parsha.versesNote || ''}</td>
							<td>{parshaStats.words}</td>
							<td>{parshaStats.letters}</td>
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
	</div>

	<p class="mt-3">*When using <a href="http://www.mechon-mamre.org/c/ct/cupper10.htm">Ta'am Elyon</a> for the 10 commandments, Yisro has 72 verses and Ve'eschanan has 119.</p>

	<h3 class="mt-3">About this data</h3>

	<p style="line-height: 28px;">
		This data was calculated using a
		<a href="https://pastebin.com/Syiv6v9J">Python script</a>
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

	@media screen and (max-width: 410px) {
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
</style>
