<script>
	import { convertUnits, getConverters, getOpinions } from '$lib/js/unitconverter.js';
	import { formatNumberHTML } from '$lib/js/utils';
	import { faExchange } from '@danieloi/pro-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';

	let unitType = 'length';
	let leftValue = '1';
	let rightValue = '6';
	let leftUnitId = 'amah';
	let rightUnitId = 'tefach';

	/** @type {string|undefined} The opinion to use for the conversion */
	let opinionId;

	/**
	 * @typedef {Object} OpinionResult
	 * @property {string} name - the name of the opinion
	 * @property {number} result - the result of the opinion
	 * @property {import('$lib/js/unitconverter.js').Unit} unit - the unit of the opinion
	 * @property {number|undefined} min - the minimum result of the opinion
	 * @property {number|undefined} max - the maximum result of the opinion
	 */

	/** @type {OpinionResult[]} The results of the opinions */
	let opinionResults;

	/**
	 * Format the given number as a string
	 * @param {number} number - the number to format
	 * @returns {string} the formatted number
	 */
	function formatDecimalNumber(number) {
		return number.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 12 });
	}

	/**
	 * Build the table of opinion results
	 * @param {string} unitType - the type of unit
	 * @param {string} unitFromId - the ID of the unit to convert from
	 * @param {string} unitToId - the ID of the unit to convert to
	 * @param {number} value - the amount of the unit
	 */
	async function buildOpinionsTable(unitType, unitFromId, unitToId, value) {
		const converters = await getConverters();
		const tempOpinionResults = [];
		if (getOpinions(converters)[unitType] && converters[unitType].units[leftUnitId]?.type !== converters[unitType].units[rightUnitId]?.type) {
			for (const opinionId of getOpinions(converters)[unitType]) {
				const opinion = converters[unitType]?.opinions?.[opinionId];
				const toUnit = converters[unitType]?.units?.[unitToId];
				if (!opinion || !toUnit) {
					continue;
				}
				const result = await convertUnits({ type: unitType, unitFromId: unitFromId, unitToId: unitToId, amount: value, opinionId });
				tempOpinionResults.push({
					name: opinion.name,
					result: result.result,
					min: result.min,
					max: result.max,
					unit: toUnit,
				});
			}
		}
		return tempOpinionResults;
	}

	/**
	 * Convert the left value to the right unit
	 */
	async function handleConvertLeftToRight() {
		const result = await convertUnits({ type: unitType, unitFromId: leftUnitId, unitToId: rightUnitId, amount: Number(leftValue), opinionId });
		rightValue = formatDecimalNumber(result.result);
		opinionResults = await buildOpinionsTable(unitType, leftUnitId, rightUnitId, Number(leftValue));
	}

	/**
	 * Convert the right value to the left unit
	 */
	async function handleConvertRightToLeft() {
		const result = await convertUnits({ type: unitType, unitFromId: rightUnitId, unitToId: leftUnitId, amount: Number(rightValue), opinionId });
		leftValue = formatDecimalNumber(result.result);
		opinionResults = await buildOpinionsTable(unitType, rightUnitId, leftUnitId, Number(rightValue));
	}

	/**
	 * Swap the left and right units
	 */
	function swapUnits() {
		// swap the units but keep the values
		[leftUnitId, rightUnitId] = [rightUnitId, leftUnitId];
		handleConvertLeftToRight();
	}

	/**
	 * Format the result of the given opinion
	 * @param {OpinionResult} opinion - the opinion details
	 * @returns {string} the formatted result
	 */
	function formatOpinionResult(opinion) {
		let result = `${formatNumberHTML(opinion.result, 3)} ${opinion.result === 1 ? opinion.unit.display : opinion.unit.displayPlural}`;
		if (opinion.min || opinion.max) {
			result += ' (';
			if (opinion.min) {
				result += `${formatNumberHTML(opinion.min, 3)}`;
			}
			result += ' &ndash; ';
			if (opinion.max) {
				result += `${formatNumberHTML(opinion.max, 3)}`;
			}
			result += `)`;
		}
		return result;
	}

	async function handleUnitTypeChange() {
		const defaultSelections = defaultSelection(unitType);
		if (defaultSelections) {
			leftUnitId = defaultSelections.left;
			rightUnitId = defaultSelections.right;
		}
		await handleConvertLeftToRight();
	}

	/**
	 * Return the default selections for the given unit type
	 * @param {string} unitType - the type of unit
	 * @returns {{ left: string, right: string }|undefined} the default selections
	 */
	function defaultSelection(unitType) {
		const defaultSelections = {
			length: {
				left: 'amah',
				right: 'tefach',
			},
			area: {
				left: 'beis_kor',
				right: 'beis_seah',
			},
			volume: {
				left: 'rova',
				right: 'kezayis',
			},
			weight: {
				left: 'sela',
				right: 'dinar',
			},
			coins: {
				left: 'mane',
				right: 'dinar',
			},
			time: {
				left: 'minute',
				right: 'chelek',
			},
		};
		// @ts-ignore - assume that the unit type and unit ID are valid
		return defaultSelections[unitType];
	}
</script>

{#await getConverters() then converters}
	<div class="card flex-card my-1 pb-3">
		<div class="unit-type-container mb-1">
			<div class="unit-type-icon">{@html converters[unitType]?.icon}</div>
			<div>
				<select bind:value={unitType} class="form-select" on:change={handleUnitTypeChange}>
					{#each Object.entries(converters) as [converterTypeId, converterType]}
						<option value={converterTypeId}>{converterType.name}</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="unit-converter-container my-1">
			<div>
				<input type="number" bind:value={leftValue} class="form-control mb-2" on:input={handleConvertLeftToRight} />
				<select bind:value={leftUnitId} class="form-select" on:change={handleConvertLeftToRight}>
					{#each Object.entries(converters[unitType].units) as [unitId, unit]}
						<option value={unitId} selected={unitId === defaultSelection(unitType)?.left || unitId === leftUnitId}>
							{unit.name}
						</option>
					{/each}
				</select>
			</div>
			<div class="center">
				<button class="swap-button" on:click={swapUnits}><Fa icon={faExchange} /></button>
			</div>
			<div>
				<input type="number" bind:value={rightValue} class="form-control mb-2" on:input={handleConvertRightToLeft} />
				<select bind:value={rightUnitId} class="form-select" on:change={handleConvertLeftToRight}>
					{#each Object.entries(converters[unitType].units) as [unitId, unit]}
						<option value={unitId} selected={unitId === defaultSelection(unitType)?.right || unitId === rightUnitId}>
							{unit.name}
						</option>
					{/each}
				</select>
			</div>
		</div>
		{#if opinionResults && opinionResults.length > 0}
			<div class="table-responsive">
				<table class="table table-striped table-hover">
					<thead>
						<tr>
							<th>Opinion</th>
							<th>Result</th>
						</tr>
					</thead>
					<tbody>
						{#each opinionResults as opinionResult}
							<tr>
								<td>{opinionResult.name}</td>
								<td>{@html formatOpinionResult(opinionResult)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
{:catch}
	<div>An error occurred while loading the list of units.</div>
{/await}

<style>
	.unit-converter-container {
		display: grid;
		grid-template-columns: 1fr 60px 1fr;
		align-items: center;
		justify-items: center;
		width: 100%;
	}

	.unit-converter-container > div {
		width: 100%;
	}

	.unit-type-container {
		display: grid;
		grid-template-columns: 38px 1fr;
		grid-gap: 0.5rem;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.unit-type-container > div {
		width: 100%;
	}

	.unit-type-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 1.25em;
		border-radius: 999px;
		background: #607d8b;
		color: white;
	}

	.swap-button {
		background: none;
		border: none;
		border-radius: 50%;
		width: 2em;
		height: 2em;
	}

	.swap-button:hover {
		background: #eee;
	}

	@media (max-width: 476px) {
		.unit-converter-container {
			grid-template-columns: 1fr;
		}
	}
</style>
