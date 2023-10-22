<script>
	import logo from '$lib/images/torahcalc.svg';
	import InputCalculatorShortcut from './InputCalculatorShortcut.svelte';
</script>

<svelte:head>
	<title>TorahCalc | Home</title>
	<meta name="description" content="TorahCalc - Calculators for Torah Study" />
</svelte:head>

<section>
	<h1 class="heading d-flex align-items-center justify-content-center gap-4">
		<img src={logo} alt="TorahCalc" class="logo" />
		<div class="center">
			<div>Welcome to TorahCalc</div>
			<div class="subtext">Tools for Torah Study</div>
		</div>
	</h1>

	<InputCalculatorShortcut />
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
