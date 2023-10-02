<script>
	import InputCalculator from './InputCalculator.svelte';
</script>

<svelte:head>
	<title>TorahCalc | English Text Input Calculator</title>
	<meta name="description" content="Use natural words to input what you want to calculate." />
</svelte:head>

<section>
	<h1 class="heading">English Text Input Calculator <span class="experimental">Experimental</span></h1>

	<InputCalculator />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 0.6;
	}

    .experimental {
        font-size: 0.5em;
        color: #999;
    }
</style>
