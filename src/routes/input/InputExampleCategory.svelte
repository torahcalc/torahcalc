<script>
	import Fa from 'svelte-fa/src/fa.svelte';

	/** @type {(query: string) => any} The function to call when the button is clicked */
	export let clickFunction = (query) => null;

	/** @type {import('@danieloi/pro-solid-svg-icons').IconDefinition}
	 * The icon to display next to the category name */
	export let icon;

	/** @type {string} The category name */
	export let title;

	/** @type {string[]} The array of example queries */
	export let queries = [];

	/** @type {string} The color of the category */
	export let color = 'blue';
</script>

<div class="category" data-color={color}>
	<h5><Fa {icon} class="me-1" /> {title}</h5>

	<ul class="list-unstyled">
		{#each queries as query}
			<div>
				<button on:click={() => clickFunction(query)} aria-label={query} class="btn btn-link example">
					{query}
				</button>
			</div>
		{/each}
	</ul>

	<!-- Section for available options, etc to be added nested in the slot -->
	<div>
		<slot />
	</div>
</div>

<style>
	.example {
		text-align: left;
	}
	.category {
		--category-color: 0, 0, 0;
		border: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color);
		border-radius: var(--bs-border-radius-lg);
		margin: 0.5rem;
		padding: 1rem;
		background-color: rgba(var(--category-color), 0.05);
		height: calc(100% - 1em);
	}
	.category h5 {
		color: rgba(var(--category-color), 1);
	}
	[data-color='green'] {
		--category-color: 56, 142, 60;
	}
	[data-color='indigo'] {
		--category-color: 63, 81, 181;
	}
	[data-color='purple'] {
		--category-color: 156, 39, 176;
	}
	[data-color='blue'] {
		--category-color: 33, 150, 243;
	}
	[data-color='magenta'] {
		--category-color: 233, 30, 99;
	}
	[data-color='cyan'] {
		--category-color: 0, 188, 212;
	}
	[data-color='red'] {
		--category-color: 244, 67, 54;
	}
	[data-color='blue-grey'] {
		--category-color: 96, 125, 139;
	}
	[data-color='teal'] {
		--category-color: 0, 150, 136;
	}
	[data-color='brown'] {
		--category-color: 121, 85, 72;
	}
	[data-color='orange'] {
		--category-color: 255, 152, 0;
	}
	[data-color='purple'] {
		--category-color: 102, 51, 153;
	}
</style>
