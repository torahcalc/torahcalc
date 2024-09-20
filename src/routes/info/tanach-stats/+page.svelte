<script>
	const description = 'This table lists the number of chapters, verses, words, and letters in each book of the Tanach and the number of parshios in each book of Torah.';
</script>

<svelte:head>
	<title>TorahCalc | Tanach Stats</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Tanach Stats</h1>

	<p>{description}</p>

	<p>Related: <a href="/info/parsha-stats">Parsha Stats</a> - verses, words, and letters for each portion of the Torah.</p>

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
				<tr class="secondrow">
					<td colspan="3">Tanach</td>
					<td>929</td>
					<td>23,198</td>
					<td>305,411</td>
					<td>1,196,718</td>
					<td>54</td>
				</tr>
				<tr class="headrow">
					<td colspan="3">Torah - תּוֹרָה</td>
					<td>187</td>
					<td>5,844</td>
					<td>79,977</td>
					<td>304,801</td>
					<td>54</td>
				</tr>
				<tr>
					<td>Bereishis</td>
					<td>Genesis</td>
					<td>בְּרֵאשִׁית</td>
					<td>50</td>
					<td>1,533</td>
					<td>20,612</td>
					<td>78,063</td>
					<td>12</td>
				</tr>
				<tr>
					<td>Shemos</td>
					<td>Exodus</td>
					<td>שְׁמוֹת</td>
					<td>40</td>
					<td>1,209</td>
					<td>16,713</td>
					<td>63,527</td>
					<td>11</td>
				</tr>
				<tr>
					<td>Vayikra</td>
					<td>Leviticus</td>
					<td>וַיִּקְרָא</td>
					<td>27</td>
					<td>859</td>
					<td>11,950</td>
					<td>44,790</td>
					<td>10</td>
				</tr>
				<tr>
					<td>Bamidbar</td>
					<td>Numbers</td>
					<td>בְּמִדְבַּר</td>
					<td>36</td>
					<td>1,288</td>
					<td>16,408</td>
					<td>63,529</td>
					<td>10</td>
				</tr>
				<tr>
					<td>Devarim</td>
					<td>Deuteronomy</td>
					<td>דְּבָרִים</td>
					<td>34</td>
					<td>955</td>
					<td>14,294</td>
					<td>54,892</td>
					<td>11</td>
				</tr>
				<tr class="headrow">
					<td colspan="3">Nevi'im - נְבִיאִים</td>
					<td>380</td>
					<td>9,292</td>
					<td>141,434</td>
					<td>553,581</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Yehoshua</td>
					<td>Joshua</td>
					<td>יְהוֹשֻעַ</td>
					<td>24</td>
					<td>656</td>
					<td>10,031</td>
					<td>39,730</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Shoftim</td>
					<td>Judges</td>
					<td>שׁוֹפְטִים</td>
					<td>21</td>
					<td>618</td>
					<td>9,885</td>
					<td>38,952</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Shmuel I</td>
					<td>Samuel I</td>
					<td>שְׁמוּאֵל א</td>
					<td>31</td>
					<td>811</td>
					<td>13,261</td>
					<td>51,357</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Shmuel II</td>
					<td>Samuel II</td>
					<td>שְׁמוּאֵל ב</td>
					<td>24</td>
					<td>695</td>
					<td>11,033</td>
					<td>42,179</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Malachim I</td>
					<td>Kings I</td>
					<td>מלכים א</td>
					<td>22</td>
					<td>817</td>
					<td>13,140</td>
					<td>50,625</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Melachim II</td>
					<td>Kings II</td>
					<td>מלכים ב</td>
					<td>25</td>
					<td>717</td>
					<td>12,245</td>
					<td>47,704</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Yeshayahu</td>
					<td>Isaiah</td>
					<td>יְשַׁעְיָהוּ</td>
					<td>66</td>
					<td>1,291</td>
					<td>16,925</td>
					<td>66,874</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Yirmeyahu</td>
					<td>Jeremiah</td>
					<td>יִרְמְיָהוּ</td>
					<td>52</td>
					<td>1,364</td>
					<td>21,831</td>
					<td>84,899</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Yechezkel</td>
					<td>Ezekiel</td>
					<td>יְחֶזְקֵיאל</td>
					<td>48</td>
					<td>1,273</td>
					<td>18,730</td>
					<td>74,511</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr class="subheadrow">
					<td colspan="3">Trei Asar - תְּרֵי עֲשַׂר</td>
					<td>67</td>
					<td>1,050</td>
					<td>14,353</td>
					<td>56,750</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Hoshea</td>
					<td>Hosea</td>
					<td>הוֹשֵׁעַ</td>
					<td>14</td>
					<td>197</td>
					<td>2,381</td>
					<td>9,389</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Yoel</td>
					<td>Joel</td>
					<td>יוֹאֵל</td>
					<td>4</td>
					<td>73</td>
					<td>957</td>
					<td>3,872</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Amos</td>
					<td>Amos</td>
					<td>עָמוֹס</td>
					<td>9</td>
					<td>146</td>
					<td>2,042</td>
					<td>8,034</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Ovadyah</td>
					<td>Obadiah</td>
					<td>עֹבַדְיָה</td>
					<td>1</td>
					<td>21</td>
					<td>291</td>
					<td>1,119</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Yonah</td>
					<td>Jonah</td>
					<td>יוֹנָה</td>
					<td>4</td>
					<td>48</td>
					<td>688</td>
					<td>2,700</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Micah</td>
					<td>Micah</td>
					<td>מִיכָה</td>
					<td>7</td>
					<td>105</td>
					<td>1,396</td>
					<td>5,571</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Nachum</td>
					<td>Nahum</td>
					<td>נַחוּם</td>
					<td>3</td>
					<td>47</td>
					<td>558</td>
					<td>2,255</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Chabakuk</td>
					<td>Habakuk</td>
					<td>חֲבַקּוּק</td>
					<td>3</td>
					<td>56</td>
					<td>671</td>
					<td>2,596</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Tzefanyah</td>
					<td>Zephaniah</td>
					<td>צְפַנְיָה</td>
					<td>3</td>
					<td>53</td>
					<td>767</td>
					<td>2,995</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Chagai</td>
					<td>Haggai</td>
					<td>חַגַּי</td>
					<td>2</td>
					<td>38</td>
					<td>600</td>
					<td>2,336</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Zecharyah</td>
					<td>Zachariah</td>
					<td>זְכַרְיָה</td>
					<td>14</td>
					<td>211</td>
					<td>3,126</td>
					<td>12,433</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Malachi</td>
					<td>Malachi</td>
					<td>מַלְאָכִי</td>
					<td>3</td>
					<td>55</td>
					<td>876</td>
					<td>3,450</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr class="headrow">
					<td colspan="3">Kesuvim - כְּתוּבִים</td>
					<td>362</td>
					<td>8,064</td>
					<td>84,001</td>
					<td>338,340</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Divrei Hayamim I</td>
					<td>Chronicles I</td>
					<td>דִּבְרֵי הַיָּמִים א</td>
					<td>29</td>
					<td>943</td>
					<td>10,740</td>
					<td>44,559</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Divrei Hayamim II</td>
					<td>Chronicles II</td>
					<td>דִּבְרֵי הַיָּמִים ב</td>
					<td>36</td>
					<td>822</td>
					<td>13,315</td>
					<td>54,917</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Tehillim</td>
					<td>Psalms</td>
					<td>תְהִלִּים</td>
					<td>150</td>
					<td>2,527</td>
					<td>19,583</td>
					<td>78,822</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Iyov</td>
					<td>Job</td>
					<td>אִיּוֹב</td>
					<td>42</td>
					<td>1,070</td>
					<td>8,340</td>
					<td>31,851</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Mishlei</td>
					<td>Proverbs</td>
					<td>מִשְלֵי</td>
					<td>31</td>
					<td>915</td>
					<td>6,915</td>
					<td>26,500</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Rut</td>
					<td>Ruth</td>
					<td>רוּת</td>
					<td>4</td>
					<td>85</td>
					<td>1,294</td>
					<td>4,949</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Shir Hashirim</td>
					<td>Song of Songs</td>
					<td>שִׁיר הַשִׁירִים</td>
					<td>8</td>
					<td>117</td>
					<td>1,250</td>
					<td>5,141</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Kohelleth</td>
					<td>Ecclesiastes</td>
					<td>קֹהֶלֶת</td>
					<td>12</td>
					<td>222</td>
					<td>2,987</td>
					<td>10,967</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Eichah</td>
					<td>Lamentations</td>
					<td>אֵיכָה</td>
					<td>5</td>
					<td>154</td>
					<td>1,542</td>
					<td>5,974</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Esther</td>
					<td>Esther</td>
					<td>אֶסְתֵר</td>
					<td>10</td>
					<td>167</td>
					<td>3,045</td>
					<td>12,111</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Daniel</td>
					<td>Daniel</td>
					<td>דָּנִיֵּאל</td>
					<td>12</td>
					<td>357</td>
					<td>5,923</td>
					<td>24,277</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Ezra</td>
					<td>Ezra</td>
					<td>עֶזְרָא</td>
					<td>10</td>
					<td>280</td>
					<td>3,754</td>
					<td>15,762</td>
					<td class="empty">&nbsp;</td>
				</tr>
				<tr>
					<td>Nechemiah</td>
					<td>Nehemiah</td>
					<td>נְחֶמְיָה</td>
					<td>13</td>
					<td>405</td>
					<td>5,312</td>
					<td>22,506</td>
					<td class="empty">&nbsp;</td>
				</tr>
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
