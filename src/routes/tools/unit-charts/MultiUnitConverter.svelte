<script>
	import { convertUnitsMulti, getConverters } from '$lib/js/unitconverter.js';
	import { formatNumber, properCase } from '$lib/js/utils';

	/**
	 * Handle a unit input being changed
	 * @param {Event} event - the change event
	 */
	async function handleInputChanged(event) {
		/** @ts-ignore - @type {HTMLInputElement} */
		const updatedInput = event.target;
		if (!updatedInput?.dataset?.unitId || !updatedInput?.dataset?.unitType) {
			return;
		}
		const unitId = updatedInput.dataset.unitId;
		const unitType = updatedInput.dataset.unitType;
		const value = updatedInput.value;

		// get the opinion
		/** @ts-ignore - @type {HTMLSelectElement|undefined} */
		const opinionInput = document.querySelector(`select[data-unit-type="${unitType}"]`);
		const opinionId = opinionInput ? opinionInput.value : undefined;

		// get the unit opinions
		/** @ts-ignore - @type {NodeListOf<HTMLSelectElement>} */
		const unitOpinionInputs = document.querySelectorAll(`select[data-unit-id][data-unit-type="${unitType}"]`);
		const unitOpinions = [];
		for (const unitOpinionInput of unitOpinionInputs) {
			unitOpinions.push(`${unitOpinionInput.dataset.unitId}.${unitOpinionInput.value}`);
		}

		const result = await convertUnitsMulti({ type: unitType, unitFromId: unitId, amount: Number(value), opinionId, unitOpinionIds: unitOpinions.length > 0 ? unitOpinions : undefined });
		for (const [unitId, unit] of Object.entries(result)) {
			/** @ts-ignore - @type {HTMLInputElement} */
			const inputToUpdate = document.querySelector(`input[type="number"][data-unit-id="${unitId}"][data-unit-type="${unitType}"]`);
			if (inputToUpdate === updatedInput) {
				continue;
			}
			inputToUpdate.value = formatNumber(unit.result, 4, true, '');
		}
		// update the hidden input
		/** @ts-ignore - @type {HTMLInputElement} */
		const hiddenInput = document.querySelector(`input[type="hidden"][data-unit-type="${unitType}"]`);
		const hiddenUnitId = hiddenInput.dataset.unitId;
		hiddenInput.value = formatNumber(result[hiddenUnitId || ''].result, 30, true, '');
	}

	/**
	 * Handle an opinion select being changed
	 * @param {Event} event - the change event
	 */
	async function handleSelectChanged(event) {
		/** @ts-ignore - @type {HTMLSelectElement} */
		const select = event.target;
		if (!select?.dataset?.unitType) {
			return;
		}
		// trigger a change on the first input with the same unit type
		/** @ts-ignore - @type {HTMLInputElement} */
		const hiddenInput = document.querySelector(`input[type="hidden"][data-unit-type="${select.dataset.unitType}"]`);
		/** @ts-ignore - @type {HTMLInputElement} */
		const firstInput = document.querySelector(`input[type="number"][data-unit-type="${select.dataset.unitType}"]`);
		firstInput.value = hiddenInput.value;
		firstInput.dispatchEvent(new Event('input'));
	}
</script>

{#await getConverters() then converters}
	{#each Object.entries(converters) as [unitTypeId, unitType]}
		<div class="card flex-card center pt-1">
			<h2 class="heading">{@html unitType.icon} &nbsp;{unitType.name} Units</h2>
			<!-- Biblical Units -->
			<div class="d-flex flex-wrap gap-2 align-items-center my-2">
				{#each Object.entries(unitType.units) as [unitId, unit]}
					{#if unit.type === 'BIBLICAL'}
						<div class="unit">
							<div class="unit-name">{properCase(unit.display)}</div>
							<input type="number" class="form-control" value={formatNumber(unit.value, 4, true, '')} data-unit-id={unitId} data-unit-type={unitTypeId} on:input={handleInputChanged} />
						</div>
					{/if}
				{/each}
			</div>
			<!-- Standard Units -->
			<div class="d-flex flex-wrap gap-2 align-items-center my-2">
				{#each Object.entries(unitType.units) as [unitId, unit]}
					{#if unit.type === 'STANDARD'}
						<div class="unit">
							<div class="unit-name">{properCase(unit.display)}</div>
							<input type="number" class="form-control" value={formatNumber(unit.value, 4, true, '')} data-unit-id={unitId} data-unit-type={unitTypeId} on:input={handleInputChanged} />
						</div>
					{/if}
				{/each}
			</div>
			{#if unitType.opinions}
				<!-- Select Opinion -->
				<div class="opinion-container my-2">
					<label for="opinion-select">Opinion:</label>
					<select class="form-select" data-unit-type={unitTypeId} on:change={handleSelectChanged}>
						{#each Object.entries(unitType.opinions) as [opinionId, opinion]}
							<option value={opinionId}>{opinion.name}</option>
						{/each}
					</select>
				</div>
			{/if}
			{#if unitType.unitOpinions}
				<!-- Select Opinion -->
				<div class="unit-opinion-container my-2">
					{#each Object.entries(unitType.unitOpinions) as [unitId, unitOpinions]}
						<label for="opinion-select">{unitType.units[unitId].display} Opinion:</label>
						<select class="form-select" data-unit-id={unitId} data-unit-type={unitTypeId} on:change={handleSelectChanged}>
							{#each Object.entries(unitOpinions) as [opinionId, opinion]}
								<option value={opinionId}>{opinion.name}</option>
							{/each}
						</select>
					{/each}
				</div>
			{/if}
			<!-- Hidden field for first unit with full precision for triggering full update -->
			<input type="hidden" class="form-control" value={unitType.units[Object.keys(unitType.units)[0]].value} data-unit-id={Object.keys(unitType.units)[0]} data-unit-type={unitTypeId} />
		</div>
	{/each}
{:catch}
	<div>An error occurred while loading the list of units.</div>
{/await}

<style>
	.unit {
		width: 160px;
	}

	.opinion-container {
		display: grid;
		grid-template-columns: 80px 1fr;
		align-items: center;
		justify-items: start;
		grid-gap: 0.5rem;
	}

	.unit-opinion-container {
		display: grid;
		grid-template-columns: 200px 1fr;
		align-items: center;
		justify-items: start;
		grid-gap: 0.5rem;
	}
</style>
