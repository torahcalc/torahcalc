<script>
	const description = 'This table lists the number of verses, words, and letters in each Parsha (Torah Portion) in the Torah.';
</script>

<svelte:head>
	<title>TorahCalc | Parsha Stats</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Parsha Stats</h1>

	<p>{description}</p>

	<p>Related: <a href="/info/tanach-stats">Tanach Stats</a> - chapters, verses, words, and letters for each book in Tanach.</p>

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
					<td>5,844</td>
					<td>79,977</td>
					<td>304,801</td>
				</tr>
				<tr class="headrow">
					<td colspan="2">Sefer Bereishis - בראשית</td>
					<td>1,533</td>
					<td>20,612</td>
					<td>78,063</td>
				</tr>
				<tr>
					<td>Bereshis</td>
					<td>בראשית</td>
					<td>146</td>
					<td>1931</td>
					<td>7234</td>
				</tr>
				<tr>
					<td>Noach</td>
					<td>נוח</td>
					<td>153</td>
					<td>1861</td>
					<td>6907</td>
				</tr>
				<tr>
					<td>Lech-Lecha</td>
					<td>לך-לך</td>
					<td>126</td>
					<td>1686</td>
					<td>6336</td>
				</tr>
				<tr>
					<td>Vayeira</td>
					<td>ויירא</td>
					<td>147</td>
					<td>2085</td>
					<td>7862</td>
				</tr>
				<tr>
					<td>Chayei Sarah</td>
					<td>חיי שרה</td>
					<td>105</td>
					<td>1402</td>
					<td>5314</td>
				</tr>
				<tr>
					<td>Toledos</td>
					<td>תולדות</td>
					<td>106</td>
					<td>1432</td>
					<td>5426</td>
				</tr>
				<tr>
					<td>Vayetze</td>
					<td>וייצא</td>
					<td>148</td>
					<td>2021</td>
					<td>7512</td>
				</tr>
				<tr>
					<td>Vayishlach</td>
					<td>וישלח</td>
					<td>153</td>
					<td>1976</td>
					<td>7458</td>
				</tr>
				<tr>
					<td>Vayeshev</td>
					<td>ויישב</td>
					<td>112</td>
					<td>1558</td>
					<td>5972</td>
				</tr>
				<tr>
					<td>Miketz</td>
					<td>מקץ</td>
					<td>146</td>
					<td>2022</td>
					<td>7914</td>
				</tr>
				<tr>
					<td>Vayigash</td>
					<td>וייגש</td>
					<td>106</td>
					<td>1480</td>
					<td>5680</td>
				</tr>
				<tr>
					<td>Vayechi</td>
					<td>ויחי</td>
					<td>85</td>
					<td>1158</td>
					<td>4448</td>
				</tr>
				<tr class="headrow">
					<td colspan="2">Sefer Shemos - שמות</td>
					<td>1,209</td>
					<td>16,713</td>
					<td>63,527</td>
				</tr>
				<tr>
					<td>Shemos</td>
					<td>שמות</td>
					<td>124</td>
					<td>1763</td>
					<td>6762</td>
				</tr>
				<tr>
					<td>Va'eira</td>
					<td>ואירא</td>
					<td>121</td>
					<td>1748</td>
					<td>6701</td>
				</tr>
				<tr>
					<td>Bo</td>
					<td>בוא</td>
					<td>106</td>
					<td>1655</td>
					<td>6149</td>
				</tr>
				<tr>
					<td>Beshalach</td>
					<td>בשלח</td>
					<td>116</td>
					<td>1681</td>
					<td>6423</td>
				</tr>
				<tr>
					<td>Yisro</td>
					<td>יתרו</td>
					<td>74*</td>
					<td>1105</td>
					<td>4022</td>
				</tr>
				<tr>
					<td>Mishpatim</td>
					<td>משפטים</td>
					<td>118</td>
					<td>1462</td>
					<td>5313</td>
				</tr>
				<tr>
					<td>Terumah</td>
					<td>תרומה</td>
					<td>96</td>
					<td>1145</td>
					<td>4691</td>
				</tr>
				<tr>
					<td>Tetzaveh</td>
					<td>תצווה</td>
					<td>101</td>
					<td>1412</td>
					<td>5429</td>
				</tr>
				<tr>
					<td>Ki Sisa</td>
					<td>כי תישא</td>
					<td>139</td>
					<td>2002</td>
					<td>7424</td>
				</tr>
				<tr>
					<td>Vayakhel</td>
					<td>ויקהל</td>
					<td>122</td>
					<td>1558</td>
					<td>6181</td>
				</tr>
				<tr>
					<td>Pekudei</td>
					<td>פקודי</td>
					<td>92</td>
					<td>1182</td>
					<td>4432</td>
				</tr>
				<tr class="headrow">
					<td colspan="2">Sefer Vayikra - ויקרא</td>
					<td>859</td>
					<td>11,950</td>
					<td>44,790</td>
				</tr>
				<tr>
					<td>Vayikra</td>
					<td>ויקרא</td>
					<td>111</td>
					<td>1673</td>
					<td>6222</td>
				</tr>
				<tr>
					<td>Tzav</td>
					<td>צו</td>
					<td>97</td>
					<td>1353</td>
					<td>5096</td>
				</tr>
				<tr>
					<td>Shemini</td>
					<td>שמיני</td>
					<td>91</td>
					<td>1238</td>
					<td>4670</td>
				</tr>
				<tr>
					<td>Tazria</td>
					<td>תזריע</td>
					<td>67</td>
					<td>1010</td>
					<td>3667</td>
				</tr>
				<tr>
					<td>Metzora</td>
					<td>מצורע</td>
					<td>90</td>
					<td>1274</td>
					<td>4697</td>
				</tr>
				<tr>
					<td>Acharei Mos</td>
					<td>אחרי מות</td>
					<td>80</td>
					<td>1170</td>
					<td>4294</td>
				</tr>
				<tr>
					<td>Kedoshim</td>
					<td>קדושים</td>
					<td>64</td>
					<td>868</td>
					<td>3229</td>
				</tr>
				<tr>
					<td>Emor</td>
					<td>אמור</td>
					<td>124</td>
					<td>1614</td>
					<td>6106</td>
				</tr>
				<tr>
					<td>Behar</td>
					<td>בהר סיניי</td>
					<td>57</td>
					<td>737</td>
					<td>2817</td>
				</tr>
				<tr>
					<td>Bechukosai</td>
					<td>בחוקותיי</td>
					<td>78</td>
					<td>1013</td>
					<td>3992</td>
				</tr>
				<tr class="headrow">
					<td colspan="2">Sefer Bamidbar - במדבר</td>
					<td>1,288</td>
					<td>16,408</td>
					<td>63,529</td>
				</tr>
				<tr>
					<td>Bamidbar</td>
					<td>במדבר</td>
					<td>159</td>
					<td>1823</td>
					<td>7392</td>
				</tr>
				<tr>
					<td>Naso</td>
					<td>נשוא</td>
					<td>176</td>
					<td>2264</td>
					<td>8632</td>
				</tr>
				<tr>
					<td>Behaalosecha</td>
					<td>בהעלותך</td>
					<td>136</td>
					<td>1840</td>
					<td>7056</td>
				</tr>
				<tr>
					<td>Shlach</td>
					<td>שלח-לך</td>
					<td>119</td>
					<td>1540</td>
					<td>5820</td>
				</tr>
				<tr>
					<td>Korach</td>
					<td>קורח</td>
					<td>95</td>
					<td>1409</td>
					<td>5325</td>
				</tr>
				<tr>
					<td>Chukas</td>
					<td>חוקת</td>
					<td>87</td>
					<td>1245</td>
					<td>4670</td>
				</tr>
				<tr>
					<td>Balak</td>
					<td>בלק</td>
					<td>104</td>
					<td>1455</td>
					<td>5356</td>
				</tr>
				<tr>
					<td>Pinchas</td>
					<td>פינחס</td>
					<td>168</td>
					<td>1887</td>
					<td>7853</td>
				</tr>
				<tr>
					<td>Matos</td>
					<td>מטות</td>
					<td>112</td>
					<td>1484</td>
					<td>5652</td>
				</tr>
				<tr>
					<td>Masei</td>
					<td>מסעי</td>
					<td>132</td>
					<td>1461</td>
					<td>5773</td>
				</tr>
				<tr class="headrow">
					<td colspan="2">Sefer Devarim - דברים</td>
					<td>955</td>
					<td>14,294</td>
					<td>54,892</td>
				</tr>
				<tr>
					<td>Devarim</td>
					<td>דברים</td>
					<td>105</td>
					<td>1548</td>
					<td>5972</td>
				</tr>
				<tr>
					<td>Va'eschanan</td>
					<td>ואתחנן</td>
					<td>121*</td>
					<td>1878</td>
					<td>7343</td>
				</tr>
				<tr>
					<td>Eikev</td>
					<td>עקב</td>
					<td>111</td>
					<td>1747</td>
					<td>6865</td>
				</tr>
				<tr>
					<td>Re'eh</td>
					<td>ראה</td>
					<td>126</td>
					<td>1932</td>
					<td>7442</td>
				</tr>
				<tr>
					<td>Shoftim</td>
					<td>שופטים</td>
					<td>97</td>
					<td>1523</td>
					<td>5590</td>
				</tr>
				<tr>
					<td>Ki Seitzei</td>
					<td>כי-תצא</td>
					<td>110</td>
					<td>1582</td>
					<td>5856</td>
				</tr>
				<tr>
					<td>Ki Savo</td>
					<td>כי-תבוא</td>
					<td>122</td>
					<td>1747</td>
					<td>6811</td>
				</tr>
				<tr>
					<td>Nitzavim</td>
					<td>ניצבים</td>
					<td>40</td>
					<td>657</td>
					<td>2575</td>
				</tr>
				<tr>
					<td>Vayelech</td>
					<td>וילך</td>
					<td>30</td>
					<td>553</td>
					<td>2123</td>
				</tr>
				<tr>
					<td>Haazinu</td>
					<td>האזינו</td>
					<td>52</td>
					<td>615</td>
					<td>2326</td>
				</tr>
				<tr>
					<td>V'zos HaBerachah</td>
					<td>וזאת הברכה</td>
					<td>41</td>
					<td>512</td>
					<td>1989</td>
				</tr>
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
