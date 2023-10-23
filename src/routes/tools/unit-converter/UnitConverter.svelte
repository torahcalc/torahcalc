<script>
	import { convertUnits, getConverters, getOpinions, getUnit, getUnits } from '$lib/js/unitconverter.js';

	const converters = getConverters(false);

	let unitType = 'length';
	let leftValue = '1';
	let rightValue = '6';
	let leftUnitId = 'amah';
	let rightUnitId = 'tefach';
	/** @type {string|undefined} The opinion to use for the conversion */
	let opinionId;

	/**
	 * Format the given number as a string
	 * @param {number} number - the number to format
	 * @returns {string} the formatted number
	 */
	function formatDecimalNumber(number) {
		return number.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 12 });
	}

	async function handleConvertLeftToRight() {
		const result = await convertUnits({ type: unitType, unitFromId: leftUnitId, unitToId: rightUnitId, amount: Number(leftValue), opinionId });
		rightValue = formatDecimalNumber(result.result);
	}

	async function handleConvertRightToLeft() {
		const result = await convertUnits({ type: unitType, unitFromId: rightUnitId, unitToId: leftUnitId, amount: Number(rightValue), opinionId });
		leftValue = formatDecimalNumber(result.result);
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

{#await converters then converters}
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
			<div class="equals">=</div>
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
		{#if getOpinions(converters)[unitType] && converters[unitType].units[leftUnitId]?.type !== converters[unitType].units[rightUnitId]?.type}
			<div class="opinion-container my-1">
				<div>Opinion:</div>
				<div>
					<select bind:value={opinionId} class="form-select" on:change={handleConvertLeftToRight}>
						{#each getOpinions(converters)[unitType] as opinion}
							<option value={opinion}>{converters[unitType]?.opinions?.[opinion]?.name}</option>
						{/each}
					</select>
				</div>
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

	.opinion-container {
		display: grid;
		grid-template-columns: 70px 1fr;
		grid-gap: 0.5rem;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.equals {
		width: 1.5em;
		font-size: 2.25em;
		text-align: center;
	}

	@media (max-width: 476px) {
		.unit-converter-container {
			grid-template-columns: 1fr;
		}

		.opinion-container {
			margin-top: 1rem !important;
			grid-template-columns: 1fr;
		}
	}
</style>
