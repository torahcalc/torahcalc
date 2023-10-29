<script>
	import { convertUnits, getConverters, getOpinions } from '$lib/js/unitconverter';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faExternalLink } from '@danieloi/pro-solid-svg-icons';
	import Ref from '$lib/components/Ref.svelte';
	import Anchor from '$lib/components/Anchor.svelte';

	async function getPerutahValue() {
		const converters = await getConverters();
		const opinions = await getOpinions(converters)['coins'];
		/** @type {Record<string, number>} */
		const values = {};
		for (const opinionId of opinions) {
			const result = await convertUnits({ type: 'coins', unitFromId: 'perutah', unitToId: 'usd', amount: 1, opinionId: opinionId });
			values[opinionId] = Math.round(result.result * 1000) / 1000;
		}
		return values;
	}
</script>

<svelte:head>
	<title>TorahCalc | Information on Biblical / Talmudic Units</title>
	<meta name="description" content="Information on biblical and talmudic units of measure with conversions to modern units and sources." />
</svelte:head>

<section>
	<h1 class="heading">Biblical / Talmudic Units of Measure</h1>

	<a href="/tools/unit-converter"><Fa icon={faExternalLink} size=".9x" /> Biblical and Talmudic Unit Converter</a>

	<h3>Contents</h3>
	<ul>
		<li><a href="#length">Length</a></li>
		<li><a href="#area">Area</a></li>
		<li><a href="#volume">Volume</a></li>
		<li><a href="#mass">Mass (Weight)</a></li>
		<li><a href="#coins">Coins</a></li>
		<li><a href="#time">Time</a></li>
		<li><a href="#sources">Sources</a></li>
	</ul>

	<h3 id="length">Length</h3>
	<ul>
		<li>
			<b>Etzbah / Agudal (Hebrew: אצבע / אגודל, pl. Etzbaos): </b>Fingerbreadths, the width of an average thumb.
			<br />
		</li>
		<ul>
			<li>
				Rabbi Avraham Chaim Naeh<Ref id="1" />:
				<blockquote>
					[Standard] 0.787 in (2 cm)<br />
					[Stringent] 0.804 in (2.042 cm)
				</blockquote>
			</li>
			<li>
				Aruch Hashulchan / Mishna Brurah<Ref id="2" />:
				<blockquote>0.875 in (2.223 cm)</blockquote>
			</li>
			<li>
				Rabbi Moshe Feinstein<Ref id="3" />:
				<blockquote>
					[Standard] 0.885 in (2.249 cm)<br />
					[Stringent] 0.958 in (2.434 cm)
				</blockquote>
			</li>
			<li>
				Chazon Ish<Ref id="4" />:
				<blockquote>
					[Standard] 0.947 in (2.405 cm)<br />
					[Stringent] 0.967 in (2.455 cm)
				</blockquote>
			</li>
		</ul>
		<li><b>Tefach (Hebrew: טפח, pl. Tefachim): </b>Handbreadths, a fist measured from the widest part of the thumb. <i>= 4 Etzbaos.</i></li>
		<li><b>Zeres (Hebrew: זרת, pl. Zaros): </b>Spans. <i>= 3 Tefachim.</i></li>
		<li><b>Amah (Hebrew: אמה, pl. Amos): </b>Cubits, Arm-lengths, Ells <i>= 2 Zaros.</i></li>
		<li><b>Short Amah (Hebrew: אמה בת חמשה): </b>Short cubit of five handbreadths instead of six. <i>= 5/6 Amah.</i></li>
		<li><b>Kaneh (Hebrew: קנה, pl. Kanim): </b>Reed <i>= 6 Amos.</i></li>
		<li><b>Ris (Hebrew: ריס, pl. Risim): </b>Greek stadium. <i>= 44.4444 Kaneh.</i></li>
		<li><b>Mil (Hebrew: מיל, pl. Milim): </b>Talmudic miles. <i>= 7 ½ Ris.</i></li>
		<li><b>Parsah (Hebrew: פרסה, pl. Parsaos): </b>Parasangs, Persian miles. <i>= 4 Mil.</i></li>
		<li><b>Derech Yom / Mahalach Yom (Hebrew: דרך יום / מהלך יום): </b>A day's journey. <i>= 10 Parsaos.</i></li>
	</ul>
	<h3 id="area">Area</h3>
	<ul>
		<li>
			<b>Se'arah (Hebrew: שערות, pl. Se'aros): </b>Hairbreadths (space between two adjacent hairs).
			<ul>
				<li>
					Rabbi Avraham Chaim Naeh<Ref id="1" />:
					<blockquote>
						[Standard] 0.014 in<sup>2</sup> (9 mm<sup>2</sup>)<br />
						[Stringent] 0.015 in<sup>2</sup> (9.379 mm<sup>2</sup>)
					</blockquote>
				</li>
				<li>
					Aruch Hashulchan / Mishna Brurah<Ref id="2" />:
					<blockquote>0.017 in<sup>2</sup> (11.114 mm<sup>2</sup>)</blockquote>
				</li>
				<li>
					Rabbi Moshe Feinstein<Ref id="3" />:
					<blockquote>
						[Standard] 0.018 in<sup>2</sup> (11.380 mm<sup>2</sup>)<br />
						[Stringent] 0.021 in<sup>2</sup> (13.332 mm<sup>2</sup>)
					</blockquote>
				</li>
				<li>
					Chazon Ish<Ref id="4" />:
					<blockquote>
						[Standard] 0.020 in<sup>2</sup> (13.014 mm<sup>2</sup>)<br />
						[Stringent] 0.021 in<sup>2</sup> (13.561 mm<sup>2</sup>)
					</blockquote>
				</li>
			</ul>
		</li>
		<li><b>Adashah (Hebrew: עדשה, pl. Adashos): </b>Area of a lentil. <i>= 4 sq. Se'aros.</i></li>
		<li><b>Gris (Hebrew: גריס, pl. Grisim): </b>Area of a split bean. <i>= 9 Adashos.</i></li>
		<li><b>Etzbah Meruba'as (Hebrew: אצבע מרובעת): </b>Square Fingerbreadths. <i>= 1 19/81 Gris.</i></li>
		<li><b>Tefach Merubah (Hebrew: טפח מרובע): </b>Square Handbreadths. <i>= 16 Etzbaos Meruba'as.</i></li>
		<li><b>Amah Meruba'as (Hebrew: אמה מרובעת): </b>Square Cubits. <i>= 36 Tefachim Merubah.</i></li>
		<li><b>Beit Rova (Hebrew: בית רובע): </b>Area needed to sow ¼ Kav of produce. <i>= 104 ⅙ Amos Meruba'as.</i></li>
		<li><b>Beit Kav (Hebrew: בית קב): </b>Area needed to sow 1 Kav of produce. <i>= 4 Beit Rova.</i></li>
		<li><b>Beit Se'ah (Hebrew: בית סאה): </b>Area needed to sow 1 Se'ah of produce. <i>= 6 Beit Kav.</i></li>
		<li><b>Beit Se'asayim (Hebrew: בית סאתים): </b>Area needed to sow 2 Se'ah of produce. <i>= 12 Beit Kav.</i></li>
		<li><b>Beit Kor (Hebrew: בית כור): </b>Area needed to sow 1 Kor of produce. <i>= 30 Beit Seah.</i></li>
	</ul>
	<h3 id="volume">Volume</h3>
	<ul>
		<li>
			<b>Kortov (Hebrew: קורטוב): </b>Equal to 1/64 Log.
			<ul>
				<li>
					Minimum for Mitzvos De'oraisa:
					<ul>
						<li>
							Rabbi Mordechai Willig:<Ref id="5" />
							<blockquote>0.143 fl oz. (4.219 ml)</blockquote>
						</li>
						<li>
							Rabbi Avraham Chaim Naeh:<Ref id="6" />
							<blockquote>0.171 fl oz. (5.063 ml)</blockquote>
						</li>
						<li>
							Rabbi Moshe Feinstein:<Ref id="7" />
							<blockquote>0.198 fl oz. (5.85 ml)</blockquote>
						</li>
						<li>
							Chazon Ish:<Ref id="8" />
							<blockquote>0.211 fl oz. (6.25 ml)</blockquote>
						</li>
					</ul>
				</li>
				<li>
					Sinai Desert Measurements (מידות מדבריות):<Ref id="9" />
					<ul>
						<li>
							Rabbi Avraham Chaim Naeh:
							<blockquote>0.183 fl oz. (5.4 ml)</blockquote>
						</li>
						<li>
							Chazon Ish:
							<blockquote>0.314 fl oz. (9.3 ml)</blockquote>
						</li>
					</ul>
				</li>
				<li>
					Jerusalem Measurements (מידות ירושלמיות): (⅕ larger than Desert measurements)<Ref id="9" />
					<ul>
						<li>
							Rabbi Avraham Chaim Naeh:
							<blockquote>0.220 fl oz. (6.5 ml)</blockquote>
						</li>
						<li>
							Chazon Ish:
							<blockquote>0.379 fl oz. (11.2 ml)</blockquote>
						</li>
					</ul>
				</li>
				<li>
					Tzipori Measurements (מידות ציפוריות): (⅕ larger than Jerusalem measurements)<Ref id="9" />
					<ul>
						<li>
							Rabbi Avraham Chaim Naeh:
							<blockquote>0.264 fl oz. (7.8 ml)</blockquote>
						</li>
						<li>
							Chazon Ish:
							<blockquote>0.453 fl oz. (13.4 ml)</blockquote>
						</li>
					</ul>
				</li>
			</ul>
		</li>
		<li><b>Mesurah (Hebrew: משורה): </b>Equal to 1/32 Log. <i>= 1 7/9 Kortov.</i></li>
		<li><b>Grogeres (Hebrew: גרוגרת, pl. Grogaros): </b>A dried fig's bulk. 3/10 of a Beitzah.<Ref id="10" /> <i>= 1.8 Mesuros.</i></li>
		<li><b>Kezayis (Hebrew: כזית, pl. Kezaysim): </b>An olive's bulk. 1/2 of a Beitzah<Ref id="11" /> (1/3 of a Beitzah according to others <Ref id="20" />) <i>= 5/3 Grogeres.</i></li>
		<li><b>(Koseves HaGasah (Hebrew: כותבת הגסה): </b>A large date's bulk. Slightly less than a Beitzah.<Ref id="12" />)</li>
		<li><b>Beitzah (Hebrew: ביצה, pl. Beitzim): </b>An egg's bulk. <i>= 2 Kezaysim.</i></li>
		<li><b>Uchlah / K'lah (Hebrew: עוכלא / כלה): </b>Equal to 1/20 Kav. <i>= 1 1/5 Beitzim.</i></li>
		<li><b>Revi'is (Hebrew: רביעית): </b>A quarter of a Log. <i>= 1 1/4 Uchlah / K'lah.</i></li>
		<li><b>Tomen (Hebrew: תומן): </b>Equal to 1/8 Kav. <i>= 2 Revi'is.</i></li>
		<li><b>(Pras (Hebrew: פרס): </b>Rashi: 4 Beitzim. Rambam: 3 Beitzim.<Ref id="13" />)</li>
		<li><b>Rova / Log (Hebrew: רובע / לוג, pl. Lugin): </b>A quarter of a Kav. <i>= 2 Tomen.</i></li>
		<li><b>Kav (Hebrew: קב, pl. Kabim): </b>Equal to 1/6 Se'ah. <i>= 4 Rova / Log.</i></li>
		<li><b>Issaron / Omer (Hebrew: עשרון / עומר): </b>Equal to 1/10 Ephah. <i>= 1 4/5 Kav.</i></li>
		<li><b>Tarkav / Hin (Hebrew: תרקב / הין): </b>Equal to 1/2 Se'ah, 1/60 Kor. <i>= 1 2/3 Issaron / Omer.</i></li>
		<li><b>Se'ah (Hebrew: סאה, pl. Se'in): </b>Equal to 1/30 Kor. <i>= 2 Tarkav / Hin.</i></li>
		<li><b>Ephah / Bat (Hebrew: איפה / בת, pl. Ephos): </b>Equal to 1/10 Kor. <i>= 3 Se'ah.</i></li>
		<li><b>Lesech / Adriv (Hebrew: לתך / אדריב): </b>Equal to 1/2 Kor. <i>= 5 Ephah / Bat.</i></li>
		<li><b>Kor / Chomer (Hebrew: כור / חומר): </b>Equal to 30 Se'ah, 10 Ephah. <i>= 2 Lesech / Adriv.</i></li>
	</ul>
	<h3 id="mass">Mass (Weight)</h3>
	<ul>
		<li>
			<b>Dinar / Zuz / Zin (Hebrew: דינר / זוז / זין): </b> Equal to 1/100 Litra.
			<br /><i>= 0.158733 oz. (4500 mg)</i>
		</li>
		<li><b>Shekel (Hebrew: שקל): </b> Half a Sela. <i>= 2 Dinar.</i></li>
		<li><b>Sela (Hebrew: סלע): </b> Half an Unkeya. <i>= 2 Shekel.</i></li>
		<li><b>Unkeya (Hebrew: אונקיא): </b> Equal to 8/10 Maneh. <i>= 2 Sela.</i></li>
		<li><b>Tarteimar (Hebrew: תרטימר): </b> Half a Maneh. <i>= 6 1/4 Unkeya.</i></li>
		<li><b>Maneh (Italki) / Litra (Hebrew: מנה (איטלקי) / ליטרא): </b> Weight of an Italian Maneh. Equal to 1/60 Kikar. <i>= 2 Tarteimar.</i></li>
		<li><b>Kikar (Hebrew: כיכר): </b> Weight of a silver Kikar. <i>= 60 Maneh.</i></li>
	</ul>
	<h3 id="coins">Coins</h3>
	<ul>
		<li>
			<b>Perutah (Hebrew: פרוטה) </b>
			<ul>
				<li>
					Shulchan Aruch / Rambam<Ref id="14" /><Ref id="15" />:
					<blockquote>
						0.024 g of silver (0.00077 troy oz.)
						{#await getPerutahValue() then values}
							(Currently approx. ${values['shulchan_aruch_rambam']} USD)
						{/await}
					</blockquote>
				</li>
				<li>
					Rashi<Ref id="16" />:
					<blockquote>
						0.02 g of silver (0.00064 troy oz.)
						{#await getPerutahValue() then values}
							(Currently approx. ${values['rashi']} USD)
						{/await}
					</blockquote>
				</li>
				<li>
					Some other authorities:
					<blockquote>
						0.027 g of silver (0.00087 troy oz.)
						{#await getPerutahValue() then values}
							(Currently approx. ${values['other']} USD)
						{/await}
					</blockquote>
				</li>
			</ul>
		</li>
		<li><b>Kontrank (Hebrew: קונטרנק) </b> <i>Equals 2 Perutos.</i></li>
		<li><b>Mesimas (Hebrew: מסימס) </b> <i>Equals 4 Perutos.</i></li>
		<li><b>Issar (Hebrew: איסר) </b> <i>Equals 8 Perutos.</i></li>
		<li><b>Pundyon (Hebrew: פונדיון) </b> <i>Equals 2 Issar.</i></li>
		<li><b>Me'ah (Hebrew: מעה, pl. Ma'os) </b> <i>Equals 2 Pundyon.</i><Ref id="14" /></li>
		<li><b>Istera / Tarpik (Hebrew: אסתרא / טרפעיק) </b> <i>Equals 3 Me'ah.</i></li>
		<li><b>Dinar / Zuz (Hebrew: דינר / זוז) </b> <i>Equals 2 Istera.</i></li>
		<li><b>Shekel (Hebrew: שקל) </b> <i>Equals 2 Dinar.</i></li>
		<li><b>Sela (Hebrew: סלע) </b> <i>Equals 2 Shekel.</i></li>
		<li><b>Dinar Zahav (Hebrew: דינר זהב) </b> <i>Equals 6 1/4 Sela.</i></li>
		<li><b>Maneh (Hebrew: מנה) </b> <i>Equals 4 Dinar Zahav.</i></li>
		<li><b>Maneh Shel Kodesh (Hebrew: מנה של קודש) </b> <i>Equals 2 Maneh.</i></li>
		<li><b>Kikar (Hebrew: כיכר) </b> <i>Equals 60 Maneh.</i></li>
		<li><b>Kikar Shel Kodesh (Hebrew: כיכר של קודש) </b> <i>Equals 2 Kikaros.</i></li>
	</ul>
	<h3 id="time">Time</h3>
	<ul>
		<li>
			<b>Rega (Hebrew רגע, pl. Regaim): </b>"Moment." 1/76 of Chelek.
			<br /><i>= 0.04386 seconds</i>
		</li>
		<li><b>Chelek (Hebrew חלק, pl. Chalakim): </b>"Part." 1/1080 of Sha'ah. <i>= 76 Rega.</i></li>
		<li><b>Et (Hebrew עת, pl. Etim): </b>"Times." 1/24 Onah. <i>= 1 7/8 Chelek.</i></li>
		<li><b>Small Onah (Hebrew עונה, pl. Onos): </b>"Period" of 1/24 of Sha'ah. <i>= 24 Etim.</i></li>
		<li><b>K'dei Achilas Pras (Hebrew כדי אכילת פרס): </b>Time to eat 3/4 of a loaf of bread. Opinions range from 2 minutes to 11 minutes and 9 seconds.</li>
		<li><b>Hiluch Mil (Hebrew הלוך מיל): </b>Time to walk 1 Mil. Opinions range from 18 minutes to 24 minutes.</li>
		<li><b>Sha'ah (Hebrew שעה, pl. Sha'os): </b>An hour. <i>= 24 Small Ona'os.</i></li>
		<li><b>Onah (Hebrew עונה, pl. Onos): </b>"Period" of daytime or nightime. 1/2 of a day. <i>About 12 Sha'os.</i></li>
		<li><b>Yom (Hebrew יום, pl. Yamim): </b>A day. <i>= 2 Ona'os</i></li>
		<li><b>Shavua (Hebrew שבוע, pl. Shavuos): </b>A week. <i>= 7 days.</i></li>
		<li><b>Chodesh (Hebrew חודש, pl. Chadashim): </b>A month. 29 or 30 days. <i>About 4.214 weeks.</i></li>
		<li><b>Tekufah (Hebrew תקופה, pl. Tekufos): </b>A quarter / season. "Turn of the sun." <i>About 3 months.</i></li>
		<li><b>Shanah (Hebrew שנה, pl. Shanim): </b>A lunar year. <i>= 4 Tekufos.</i></li>
		<li><b>Shmittah (Hebrew שמיטה, Shmittos): </b>Sabbatical Cycle. <i>= 7 lunar years.</i></li>
		<li><b>Yovel (Hebrew יובל, pl. Yovelim): </b>Jubilee. <i>= 50 lunar years.</i></li>
	</ul>
	<h3 id="sources">Sources</h3>
	<ul>
		<li>
			<Anchor id="1" />Naeh, Rabbi Avraham Chaim, 1947. <a href="https://www.hebrewbooks.org/pdfpager.aspx?req=20888&pgnum=326">Shiurei Torah 3:25 pp. 249-250</a> writes that the <i>etzba</i> is 2 cm,
			making an <i>amah</i> equal 48 cm and when measuring an upper or lower bound, it is best to be stringent and use 47 cm or 49 cm per <i>amah</i>, depending on which direction you are measuring.
			Since an <i>etzbah</i> is 2 cm, this makes an <i>etzbah meruba'as</i> (square etzbah) equal to 4 cm<sup>2</sup>.
		</li>
		<li>
			<Anchor id="2" />The Aruch Hashulchan <a href="https://www.sefaria.org/Arukh_HaShulchan%2C_Yoreh_De'ah.286.21">YD 286:21</a> sets 4 amot as one Russian <i>sazhen</i> (7 feet). Dr. Gideon
			Freedman proves Aruch Hashulchan <a href="https://www.sefaria.org/Arukh_HaShulchan%2C_Yoreh_De'ah.201.3">YD 201:3</a> and
			<a href="https://www.sefaria.org/Mishnah_Berurah.358.7">Mishna Brurah 358:7</a> hold that the amah is 21 inches. The Aruch Hashulchan defines the amah as three-quarters of a 71.12 cm
			<i>arshin</i>, while Mishna Brurah correlates 53 Russian <i>arshins</i> with 70.83 amot.
			<a target="_blank" href="https://halachipedia.com/index.php?title=Reference_of_Measurements_in_Halacha#cite_note-20">Source</a>.
		</li>
		<li>
			<Anchor id="3" />Feinstein, Rabbi Moshe. Iggerot Moshe, 1964. <a href="https://hebrewbooks.org/916">OC 1:136 p. 228</a> writes that the <i>amah</i> is 21.25 inches and one can be stringent and use
			23 inches.
		</li>
		<li><Anchor id="4" />Kanievsky, Rabbi Yaakov Y. quoting Chazon Ish (Avrohom Yeshaya Karelitz). Shiurin Shel Torah. p. 3.</li>
		<li>
			<Anchor id="5" />Rabbi Mordechai I. Willig, 2011. <a href="https://www.yutorah.org/lectures/760487/">Pesach To-Go, How Much Matzah Do You Need to Eat?</a>, p. 60, writes that the <i>kezayis</i>
			is 22.5 cm<sup>3</sup>. His calculations are primarily based on Rabbi Hadar Margolin.
			<a target="_blank" href="https://halachipedia.com/index.php?title=Reference_of_Measurements_in_Halacha#cite_note-20">Source</a>.
		</li>
		<li>
			<Anchor id="6" />Naeh, Rabbi Avraham Chaim, 1947. <a href="https://www.hebrewbooks.org/pdfpager.aspx?req=20888&pgnum=270">Shiurei Torah 3:11 pp. 193</a> writes that a
			<i>kezayis</i> for mitvos de'oraisa is 28.8 cm<sup>3</sup>, however, in <a href="https://www.hebrewbooks.org/pdfpager.aspx?req=35168&pgnum=69">Shiurei Tzion, 1949. p. 70</a>
			he writes that it is 27 cm<sup>3</sup>. Vezos HaBracha (Birur Halacha 1) explains that he retracted from his original ruling.
			<a target="_blank" href="https://halachipedia.com/index.php?title=Reference_of_Measurements_in_Halacha#cite_note-20">Source</a>.
		</li>
		<li>
			<Anchor id="7" />Vezot HaBracha (Birur Halacha 1) quotes Haggadat Kol Dodi which quotes Rav Moshe Feinstein as saying that a Kezayit is 31.2 cm<sup>3</sup>.
			<a target="_blank" href="https://halachipedia.com/index.php?title=Reference_of_Measurements_in_Halacha#cite_note-20">Source</a>.
		</li>
		<li>
			<Anchor id="8" />Kanievsky, Rabbi Yaakov Y. quoting Chazon Ish (Avrohom Yeshaya Karelitz). Shiurin Shel Torah. second ed, pp. 65-66. He writes that the <i>kezayis</i> is 2/3 of a modern egg
			which today measures 45-50 grams. The <i>kezayis</i> would therefore be 30-33.333 grams. Vezot HaBracha (Birur Halacha 1:3) records this opinion of the Chazon Ish as 33.3 cm<sup>3</sup>.
			<a target="_blank" href="https://halachipedia.com/index.php?title=Reference_of_Measurements_in_Halacha#cite_note-20">Source</a>.
		</li>
		<li><Anchor id="9" /><a href="https://www.dafyomi.co.il/general/info/units-of-measurement.pdf">Biblical and Talmudic Units of Measurement</a> by Ronnie Figdor, 2012.</li>
		<li>
			<Anchor id="10" />Karo, Yosef. Shulchan Aruch. <a target="_blank" href="https://www.sefaria.org/Shulchan_Arukh%2C_Orach_Chayim.368.3">OC 368</a> states the opinions that 18 grogeros equals 6 or 8
			beitzim.
		</li>
		<li>
			<Anchor id="11" />Karo, Yosef. Shulchan Aruch. <a target="_blank" href="https://www.sefaria.org/Shulchan_Arukh%2C_Orach_Chayim.486.1">OC 486:1</a> states that 2 kezaysim is like 1 beitzah.
		</li>
		<li>
			<Anchor id="12" />Karo, Yosef. Shulchan Aruch. <a target="_blank" href="https://www.sefaria.org/Shulchan_Arukh%2C_Orach_Chayim.612.1">OC 612:1</a> states that a Koseves HaGasah (large date) is a
			little less than a beitzah.
		</li>
		<li>
			<Anchor id="13" />Karo, Yosef. Shulchan Aruch. <a target="_blank" href="https://www.sefaria.org/Shulchan_Arukh%2C_Orach_Chayim.612.4">OC 612:4</a> states that some say a pras is 4 beitzim, while
			others say it is 3 beitzim.
		</li>
		<li>
			<Anchor id="14" />Karo, Yosef. Shulchan Aruch. <a target="_blank" href="https://www.sefaria.org/Shulchan_Arukh%2C_Choshen_Mishpat.88">CM 88:1</a> states that the calculation of a perutah is the weight
			of half a barley of clean silver and the calculation of two ma'ah is the weight of 32 barleys of clean silver.
		</li>
		<li><Anchor id="15" />"Rambam" on Mishnah Bechoros 88:46.</li>
		<li>
			<Anchor id="16" />"Rashi" on <a target="_blank" href="https://www.sefaria.org/Rashi_on_Exodus.21.32.2">Shemos 21:32</a> states the shekel is weighed as four gold dinar coins, which is half an ounce
			according to the correct weight of Cologne.
		</li>
		<li>
			<Anchor id="17" />Feinstein, Rabbi Moshe. Iggerot Moshe, 1964.
			<a href="https://hebrewbooks.org/14674">YD 1:107 p. 198</a>;
			<a href="https://hebrewbooks.org/14674">YD 1:190 pp. 380-381</a>;
			<a href="https://hebrewbooks.org/920">YD 3:46:2 p. 281</a>;
			<a href="https://hebrewbooks.org/920">YD 3:66:1 p. 314</a>.
		</li>
		<li>
			<Anchor id="18" />Steinsaltz, Adin. "Talmudic Weights and Measures." The Talmud, the Steinsaltz Edition. Random House, 1989. pp. 279-93.<br />
			<a
				target="_blank"
				href="https://www.amazon.com/gp/product/0394576659/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0394576659&linkCode=as2&tag=jelawrence-20&linkId=92849671c76d53d6b9b24392a5113c4f"
				>Buy on Amazon</a
			><img src="//ir-na.amazon-adsystem.com/e/ir?t=jelawrence-20&l=am2&o=1&a=0394576659" width="1" height="1" alt="" style="border:none !important; margin:0px !important;" />
		</li>
		<li>
			<Anchor id="19" />Frank, Yitzḥak. "Appendix II" The Practical Talmud Dictionary. Ariel, 1991-1994. pp. 297-301.<br />
			<a
				target="_blank"
				href="https://www.amazon.com/gp/product/1592644511/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1592644511&linkCode=as2&tag=jelawrence-20&linkId=8550e305385748e21980ee2c4d3037fd"
				>Buy on Amazon</a
			><img src="//ir-na.amazon-adsystem.com/e/ir?t=jelawrence-20&l=am2&o=1&a=1592644511" width="1" height="1" alt="" style="border:none !important; margin:0px !important;" />
		</li>
		<li>
			<Anchor id="20" />Bergman, Rabbi Meir Zvi. "Chapter Twelve: Weights, Measures and Currency." The Gateway to Talmud. Mesorah Publications, 1985. pp. 117-119.<br />
			<a
				target="_blank"
				href="https://www.amazon.com/Gateway-Talmud-ArtScroll-mesorah-Bergman/dp/0899062083?&_encoding=UTF8&tag=jelawrence-20&linkCode=ur2&linkId=c3d1a193ee786cb7403314bc00e8a017&camp=1789&creative=9325"
				>Buy on Amazon</a
			><img src="//ir-na.amazon-adsystem.com/e/ir?t=jelawrence-20&l=am2&o=1&a=0899062083" width="1" height="1" alt="" style="border:none !important; margin:0px !important;" />
		</li>
	</ul>
	<br />
</section>

<style>
	h3 {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}

	blockquote {
		border-left: 0.25em solid #ccc;
		padding-left: 0.5em;
		margin-left: 0;
	}
</style>
