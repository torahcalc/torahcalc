<script>
	import { properCase } from '$lib/js/utils';

	/** @type {{[key: string]: any[]}} The mapping of available options */
	export let mapping = {};

	/** @type {Array<string>} The array of available options */
	export let array = [];

	/** @type {(entry: string|string[]) => string|Promise<string>} The function to call to transform the value */
	export let transform = (entry) => entry.toString();

	const types = Object.keys(mapping).length > 0 ? Object.keys(mapping) : [];
</script>

<table class="table table-striped table-bordered">
	{#if Object.keys(mapping).length > 0}
		<thead>
			<tr>
				<th>Type</th>
				<th>Options</th>
			</tr>
		</thead>
		<tbody>
			{#each types as type}
				<tr>
					<td>{properCase(type)}</td>
					<td>
						<ul>
							{#each mapping[type] as option}
								{#if transform([type, option]) instanceof Promise}
									{#await transform([type, option])}
										<li><code>{option}</code></li>
									{:then transformed}
										<li><code>{transformed}</code></li>
									{:catch error}
										<li><code>{option}</code></li>
									{/await}
								{:else}
									<li><code>{transform([type, option])}</code></li>
								{/if}
							{/each}
						</ul>
					</td>
				</tr>
			{/each}
		</tbody>
	{:else if array.length > 0}
		<thead>
			<tr>
				<th>Options</th>
			</tr>
		</thead>
		<tbody>
			{#each array as option}
				{#if transform(option) instanceof Promise}
					{#await transform(option)}
						<tr>
							<td><code>{option}</code></td>
						</tr>
					{:then transformed}
						<tr>
							<td><code>{transformed}</code></td>
						</tr>
					{:catch error}
						<tr>
							<td><code>{option}</code></td>
						</tr>
					{/await}
				{:else}
					<tr>
						<td><code>{transform(option)}</code></td>
					</tr>
				{/if}
			{/each}
		</tbody>
	{/if}
</table>
