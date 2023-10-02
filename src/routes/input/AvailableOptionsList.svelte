<script>
	/** @type {{[key: string]: any[]}} The mapping of available options */
	export let mapping = {};

	/** @type {(key: string, value: string) => string|Promise<string>} The function to call to transform the value */
	export let transform = (key, value) => value;

	const types = Object.keys(mapping);

	/**
	 * Transform a string to Proper Case
	 * @param {string} str - the string to transform
	 */
	const properCase = (str) => {
		return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	};
</script>

<table class="table table-striped">
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
							{#if transform(type, option) instanceof Promise}
								{#await transform(type, option)}
									<li><code>{option}</code></li>
								{:then transformed}
									<li><code>{transformed}</code></li>
								{:catch error}
									<li><code>{option}</code></li>
								{/await}
							{:else}
								<li><code>{transform(type, option)}</code></li>
							{/if}
						{/each}
					</ul>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
