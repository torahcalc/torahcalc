<script>
	import logo from '$lib/images/torahcalc.png';
</script>

<svelte:head>
	<title>TorahCalc | Home</title>
	<meta name="description" content="TorahCalc - Calculators for Torah Study" />
</svelte:head>

<section>
	<span class="logo">
		<img src={logo} alt="TorahCalc" />
	</span>
	<h1>Welcome to TorahCalc</h1>

	<p>TorahCalc is a collection of tools for the study of the Torah.</p>

	<p>The new site is under construction. Please check back soon.</p>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.logo {
		display: block;
		padding-bottom: 1rem;
	}

	.logo img {
		width: 120px;
		height: auto;
		margin: 0 auto;
	}
</style>
