<script>
	/**
	 * @type {('GET'|'POST'|'PUT'|'PATCH'|'DELETE')} Method
	 */
	export let method;

	/**
	 * @type {String} Endpoint
	 */
	export let endpoint;

	/**
	 * @type {String} Description
	 */
	export let description;

	/**
	 * @type {Array<{name: String, type: String, required: Boolean, description: String, example: any, allowedValues?: any[]|{[key: string]: any[]}}>} Parameters
	 */
	export let parameters;

	// build the example query string
	let example = endpoint + '?';
	let queryParameters = parameters.map((parameter) => {
		return parameter.name + '=' + encodeURIComponent(parameter.example);
	});
	example += queryParameters.join('&');
</script>

<div class="card flex-card endpoint-card">
	<h4 class="endpoint-header">
		<span class="method mono {method}">{method}</span><span>&nbsp;&nbsp;</span><span class="endpoint mono">{endpoint}</span>
	</h4>

	<p class="mt-2 mb-4">{description}</p>

	<h4 class="subsection-header">Query Parameters</h4>

	<table>
		<thead>
			<tr>
				<th>Parameter</th>
				<th>Type</th>
				<th>Required</th>
				<th>Description</th>
			</tr>
		</thead>

		<tbody>
			{#each parameters as parameter}
				<tr>
					<td><code>{parameter.name}</code></td>
					<td>{parameter.type}</td>
					<td>
						{#if parameter.required}
							<span class="badge bg-success">Yes</span>
						{:else}
							<span class="badge bg-danger">No</span>
						{/if}
					</td>
					<td>
						{parameter.description}
						{#if parameter.allowedValues}
							<br />
							<details>
								<summary>Allowed values</summary>
								<ul>
									{#if Array.isArray(parameter.allowedValues)}
										{#each parameter.allowedValues as value}
											<li><code>{value}</code></li>
										{/each}
									{:else}
										{#each Object.keys(parameter.allowedValues) as key}
											<li>
												<h6>{key}</h6>
												<div class="d-flex flex-wrap gap-1 mb-2">
													{#each parameter.allowedValues[key] as value}
														<code>{value}</code>
													{/each}
												</div>
											</li>
										{/each}
									{/if}
								</ul>
							</details>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<h4 class="subsection-header my-3">Example</h4>

	<span class="mono"><a href={example}>{example}</a></span>
</div>

<style>
	.endpoint-card {
		margin: 1em 0;
		padding: 1.5em;
	}

	code {
		background: #eee;
		padding: 0.25em 0.5em;
		border-radius: 0.25em;
	}

	.endpoint-header {
		margin-top: 0;
		margin-bottom: 1em;
		font-size: 1.25em;
	}

	.subsection-header {
		margin-bottom: 0.5em;
	}

	table {
		border-collapse: collapse;
		width: 100%;
	}

	th,
	td {
		padding: 0.5em;
		border: 1px solid #ccc;
	}

	th {
		text-align: left;
	}

	.mono {
		font-family: var(--font-mono);
	}

	.method {
		color: #fff;
		padding: 0.25em 0.5em;
	}

	.method.GET {
		background: #4caf50;
	}

	.method.POST {
		background: #2196f3;
	}

	.method.PUT {
		background: #ff9800;
	}

	.method.PATCH {
		background: #9c27b0;
	}

	.method.DELETE {
		background: #f44336;
	}
</style>
