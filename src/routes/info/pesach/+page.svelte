<script>
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faExternalLink } from '@danieloi/pro-solid-svg-icons';
	import Ref from '$lib/components/Ref.svelte';
	import Anchor from '$lib/components/Anchor.svelte';

	// Import image URLs
	import horseradishImg from './images/horseradish.png';
	import lettuceLeafImg from './images/lettuce-leaf.png';
	import lettuceStalksImg from './images/lettuce-stalks.png';
	import matzahHand29Img from './images/matzah-hand-29.png';
	import matzahHand58Img from './images/matzah-hand-58.png';
	import matzahMachine59Img from './images/matzah-machine-59.png';
	import matzahMachine118Img from './images/matzah-machine-118.png';
	import wineImg from './images/wine.png';
</script>

<svelte:head>
	<title>TorahCalc | Pesach Shiur Requirements</title>
	<meta name="description" content="Minimum shiurim (measurements) for fulfilling Pesach obligations, including Matzah, Marror, and the Four Cups of Wine." />
</svelte:head>

<section>
	<h1 class="heading">Minimum Shiurim (Measurements) for Pesach</h1>
	<p>Below are the minimum shiur requirements to fulfill the rabbinic and Torah obligations of eating Matzah, Marror, and drinking the four cups of wine on Pesach.</p>

	<table>
		<tr>
			<th colspan="4"><h4 class="m-1 ms-2">Matzah</h4></th>
		</tr>
		<tr>
			<td></td>
			<td><strong>Motzi Matzah</strong></td>
			<td><strong>Korech</strong></td>
			<td><strong>Afikoman</strong></td>
		</tr>
		<tr>
			<td>Preferable minimum amount</td>
			<td>2 Kezaysim</td>
			<td>1 Kezayis</td>
			<td>2 Kezaysim</td>
		</tr>
		<tr>
			<td>Minimum to fulfill obligation<Ref id="1" /></td>
			<td>A piece from a whole matzah<br />and 1 other Kezayis</td>
			<td>1 Kezayis</td>
			<td>1 Kezayis</td>
		</tr>
		<tr>
			<td>Equivalent volume<Ref id="2" /></td>
			<td>1.26-1.94 fl. oz.<br />2.27-3.5 cubic in.<br />37.3-57.4 cc.</td>
			<td>0.63-0.97 fl. oz.<br />1.14-1.75 cubic in.<br />19.7-29.7 cc.</td>
			<td>1.26-1.94 fl. oz.<br />2.27-3.5 cubic in.<br />37.3-57.4 cc.</td>
		</tr>
		<tr>
			<td>Percentage of matzah<Ref id="3" /></td>
			<td><img class="h-80" src={matzahMachine118Img} alt="Machine Matzah" /><br />Machine: 80-118%<br /><img class="h-80" src={matzahHand58Img} alt="Hand Matzah" /><br />Hand: 40-58%</td>
			<td><img class="h-80" src={matzahMachine59Img} alt="Machine Matzah" /><br />Machine: 40-59%<br /><img class="h-80" src={matzahHand29Img} alt="Hand Matzah" /><br />Hand: 20-29%</td>
			<td><img class="h-80" src={matzahMachine118Img} alt="Machine Matzah" /><br />Machine: 80-118%<br /><img class="h-80" src={matzahHand58Img} alt="Hand Matzah" /><br />Hand: 40-58%</td>
		</tr>
	</table>

	<table>
		<tr>
			<th colspan="2"><h4 class="m-1 ms-2">Four Cups of Wine</h4></th>
		</tr>
		<tr>
			<td>Preferable minimum amount<Ref id="4" /></td>
			<td>1 Revi'is</td>
		</tr>
		<tr>
			<td>Minimum to fulfill obligation</td>
			<td>Majority of a Revi'is</td>
		</tr>
		<tr>
			<td>Equivalent volume<Ref id="5" /></td>
			<td><img class="h-80" src={wineImg} alt="Wine Measurement" /><br />2.9-5.1 fl. oz.<br />4.2-9.6 cubic in.<br />74-151 cc.<br />See note 4.</td>
		</tr>
	</table>

	<table>
		<tr>
			<th colspan="2"><h4 class="m-1 ms-2">Marror</h4></th>
		</tr>
		<tr>
			<td>Minimum to fulfill obligation</td>
			<td>1 Kezayis</td>
		</tr>
		<tr>
			<td>Equivalent volume<Ref id="2" /></td>
			<td>0.63-0.97 fl. oz.<br />1.14-1.75 cubic in.<br />19.7-29.7 cc.</td>
		</tr>
		<tr>
			<td>Area using romaine lettuce leaves</td>
			<td><img class="h-80" src={lettuceLeafImg} alt="Lettuce Leaves" /><br />Area covering 8x10 in. (20.4x25.4 cm.)<br />Usually about one large leaf.</td>
		</tr>
		<tr>
			<td>Area using romaine lettuce stalks</td>
			<td><img class="h-80" src={lettuceStalksImg} alt="Lettuce Stalks" /><br />Area covering 3x5 in. (7.7x12.7 cm.)<br />Usually about two and a half large stalks or four medium-sized stalks.</td>
		</tr>
		<tr>
			<td>Area using pure grated horseradish</td>
			<td><img class="h-30" src={horseradishImg} alt="Horseradish" /><br />1.1 fl. oz.<br />1.99 cubic in.<br />32.53 cc.</td>
		</tr>
	</table>

	<h3>Notes:</h3>
	<ul>
		<li><Anchor id="1" />Although the Torah level obligation is to eat only a single kezayis, it is a rabbinic requirement to eat a total of five kezaysim throughout the seder.</li>
		<li><Anchor id="2" />0.63 fl. oz. per kezayis is according to Rabbi Dovid Feinstein. 0.97 fl. oz. per kezayis is according to the stringent opinion of Rabbi Avraham Chaim Naeh.</li>
		<li><Anchor id="3" />Assuming 8 hand matzos per pound and 15 machine matzos per pound. Pictures show minimum percentage based on the most stringent opinion.</li>
		<li>
			<Anchor id="4" />
			One should fill up the cup to the top even if it is larger than a revi'is. Since some hold that one should drink the entire cup, if one plans to drink only a revi'is, one should use a cup that only
			holds a revi'is.
		</li>
		<li>
			<Anchor id="5" />
			2.9 fl. oz. per revi'is is according to Rabbi Avraham Blumenkrantz. 5.1 fl. oz. per revi'is is according to Chazon Ish. Especially on Erev Shabbos, it is preferable to use the more stringent opinion.
		</li>
	</ul>

	<h3>Sources:</h3>
	<ul>
		<li><a href="http://halachipedia.com/index.php?title=Required_Amount_of_Matzah_and_Wine_for_the_Seder" target="_blank">Halachipedia - Required Amount of Matzah and Wine for the Seder</a></li>
		<li><a href="https://oukosher.org/passover/articles/all-in-good-measure-the-shiurim-of-passover/" target="_blank">OU Kosher - All in Good Measure: The Shiurim of Passover</a></li>
		<li><a href="http://www.neveh.org/pesach/pesblm3.html" target="_blank">The Laws of Pesach (Rabbi Blumenkrantz)</a></li>
		<li><a href="https://scrollk.org/" target="_blank">Scroll K (Vaad Hakashrus of Denver)</a></li>
	</ul>
</section>

<style>
	h3 {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1em;
	}

	th,
	td {
		border: 1px solid #ccc;
		padding: 0.5em;
		text-align: left;
	}

	th {
		background-color: #f9f9f9;
	}

	img {
		max-width: 100%;
		height: auto;
	}

	table {
		background: white;
	}

	.h-80 {
		height: 80px;
	}

	.h-30 {
		height: 30px;
	}
</style>
