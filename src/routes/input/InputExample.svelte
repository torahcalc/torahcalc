<script>
	/** @type {string} The query to calculate */
	export let query;

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction = (query) => null;
</script>

<div>
	<button on:click={() => clickFunction(query)} aria-label={query} class="btn btn-link example">
		{query}
	</button>
</div>

<style>
	.example {
		text-align: left;
	}
</style>