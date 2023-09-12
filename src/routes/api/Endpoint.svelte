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
	 * @type {Array<{name: String, type: String, required: Boolean, description: String, example: any}>} Parameters
	 */
	export let parameters;

	// build the example query string
	let example = endpoint + '?';
	let queryParameters = parameters.map((parameter) => {
		return parameter.name + '=' + encodeURIComponent(parameter.example);
	});
	example += queryParameters.join('&');
</script>

<div class="card endpoint-card">
	<h3>
		<span class="method mono {method}">{method}</span> <span class="endpoint mono">{endpoint}</span>
	</h3>

	<span>{description}</span>

	<h4>Query Parameters</h4>

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
					<td>{parameter.name}</td>
					<td>{parameter.type}</td>
					<td>{parameter.required ? 'Yes' : 'No'}</td>
					<td>{parameter.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<h4>Example</h4>

	<span class="mono"><a href={example}>{example}</a></span>
</div>

<style>
	.endpoint-card {
		margin: 1em 0;
		padding: 1.5em;
	}

	h3 {
		margin-top: 0;
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
