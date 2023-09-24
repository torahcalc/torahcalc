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
	 * @typedef Parameter
	 * @property {String} name The name of the parameter
	 * @property {String} type The type of the parameter
	 * @property {Boolean} required Whether the parameter is required
	 * @property {String} description The description of the parameter
	 * @property {any} example An example value for the parameter
	 * @property {{[key: string]: any[]}|any[]} [allowedValues] Allowed values for the parameter
	 */

	/**
	 * @type {Array<Parameter>} Parameters
	 */
	export let parameters;

	/**
	 * Build an example API endpoint URL from the parameters
	 *
	 * @param {String} endpoint The endpoint URL
	 * @param {Array<Parameter>} parameters The parameters
	 */
	const buildExample = (endpoint, parameters) => {
		let example = endpoint;
		if (parameters.length === 0) {
			return example;
		}
		example += '?';
		example += parameters.map((parameter) => `${parameter.name}=${parameter.example}`).join('&');
		return example;
	};

	// build the example query string
	const example = buildExample(endpoint, parameters);

	// build an example with only required parameters
	let requiredParameters = parameters.filter((parameter) => parameter.required);
	const requiredExample = buildExample(endpoint, requiredParameters);
</script>

<div class="card flex-card endpoint-card">
	<h4 class="endpoint-header">
		<span class="method mono {method}">{method}</span><span>&nbsp;&nbsp;</span><span class="endpoint mono">{endpoint}</span>
	</h4>

	<p class="mt-2 mb-4">{description}</p>

	<h4 class="subsection-header toc-exclude">Query Parameters</h4>

	<div class="scroll-outer">
		<div class="scroll-inner">
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
								{@html parameter.description}
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
		</div>
	</div>

	<h4 class="subsection-header toc-exclude my-3">Examples</h4>

	{#if requiredParameters.length < parameters.length}
		<p class="mono"><a href={requiredExample}>{requiredExample}</a></p>
	{/if}

	<p class="mono"><a href={example}>{example}</a></p>
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
