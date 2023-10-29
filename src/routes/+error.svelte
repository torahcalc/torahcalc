<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/torahcalc.svg';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faHomeAlt } from '@danieloi/pro-solid-svg-icons';
	import { redirect } from '@sveltejs/kit';

	// redirect pages from the old site to the new urls if a 404 is encountered
	const redirectPath = {
		'/app': 'https://play.google.com/store/apps/details?id=com.freshidea.newtorahcalc&hl=en_US&gl=US',
		'/github': 'https://github.com/torahcalc/torahcalc',
		'/contact': 'https://github.com/torahcalc/torahcalc/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc',
		'/daf-yomi': '/tools/daily-learning',
		'/dateconverter': '/tools/date-converter',
		'/gematria-match': '/tools/gematria-match',
		'/gematria': '/tools/gematria',
		'/gematrias': '/tools/gematria-search',
		'/hachama': '/tools/birkas-hachama',
		'/holidays': '/tools/jewish-holidays',
		'/info/biblical-units': '/info/biblical-units',
		'/info/gematria': '/info/gematria',
		'/leapyears': '/tools/leap-years',
		'/molad': '/tools/molad',
		'/omer': '/tools/sefiras-haomer',
		'/pesach': 'https://old.torahcalc.com/pesach/', // TODO: migrate this page
		'/privacy': '/terms/privacy',
		'/privacy/terms-and-conditions.html': '/terms/tos',
		'/unitcharts': '/tools/unit-charts',
		'/unitconverter': '/tools/unit-converter',
		'/zmanim': '/tools/zmanim',
		'/zodiac': '/tools/hebrew-zodiac-signs',
		'/dateconverter/embedA/': 'https://old.torahcalc.com/dateconverter/embedA/',
		'/zodiac/embed/': 'https://old.torahcalc.com/zodiac/embed/',
	}[$page.url.pathname.replace(/\/(index\.html)?$/, '')];
	if ($page.status === 404 && redirectPath) {
		throw redirect(301, redirectPath);
	}
</script>

<svelte:head>
	<title>TorahCalc | {$page.status} {$page.error?.message}</title>
</svelte:head>

<section>
	<h1 class="heading d-flex align-items-center justify-content-center gap-4">
		<img src={logo} alt="TorahCalc" class="logo" />
		<div class="center">
			<div>Error {$page.status}</div>
			<div class="subtext">{$page.error?.message}</div>
		</div>
	</h1>

	{#if $page.status == 404}
		<div class="center">
			<a href="/" class="btn btn-primary"><Fa icon={faHomeAlt} />&ensp;Return Home</a>
		</div>
	{/if}
</section>

<style>
	h1 {
		width: 100%;
	}

	.subtext {
		font-size: 0.5em;
		color: #999;
		margin-top: 0.5em;
	}

	.logo {
		height: 2em;
		width: auto;
	}
</style>
