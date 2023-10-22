<script>
	import { convertUnits, getConverters, getOpinions, getUnit, getUnits } from '$lib/js/unitconverter.js';

	const converters = getConverters(false);

	let unitType = 'length';
	let leftValue = 1;
	let rightValue = 6;
	let leftUnitId = 'amah';
	let rightUnitId = 'tefach';
	/** @type {string|undefined} The opinion to use for the conversion */
	let opinionId;

	async function handleConvertLeftToRight() {
		const result = await convertUnits({ type: unitType, unitFromId: leftUnitId, unitToId: rightUnitId, amount: leftValue, opinionId });
		rightValue = result.result;
	}

	async function handleConvertRightToLeft() {
		const result = await convertUnits({ type: unitType, unitFromId: rightUnitId, unitToId: leftUnitId, amount: rightValue, opinionId });
		leftValue = result.result;
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
		<select bind:value={unitType} class="form-select mb-2" on:change={handleUnitTypeChange}>
			{#each Object.entries(converters) as [converterTypeId, converterType]}
				<option value={converterTypeId}>{converterType.name}</option>
			{/each}
		</select>
		<table class="table">
			<tr>
				<td>
					<input type="number" bind:value={leftValue} class="form-control mb-2" on:input={handleConvertLeftToRight} />
					<select bind:value={leftUnitId} class="form-select" on:change={handleConvertLeftToRight}>
						{#each Object.entries(converters[unitType].units) as [unitId, unit]}
							<option value={unitId} selected={unitId === defaultSelection(unitType)?.left || unitId === leftUnitId}>
								{unit.name}
							</option>
						{/each}
					</select>
				</td>
				<td class="equals p-2">=</td>
				<td>
					<input type="number" bind:value={rightValue} class="form-control mb-2" on:input={handleConvertRightToLeft} />
					<select bind:value={rightUnitId} class="form-select" on:change={handleConvertLeftToRight}>
						{#each Object.entries(converters[unitType].units) as [unitId, unit]}
							<option value={unitId} selected={unitId === defaultSelection(unitType)?.right || unitId === rightUnitId}>
								{unit.name}
							</option>
						{/each}
					</select>
				</td>
			</tr>
		</table>
		{#if getOpinions(converters)[unitType] && converters[unitType].units[leftUnitId]?.type !== converters[unitType].units[rightUnitId]?.type}
			<table class="table">
				<tr>
					<td>Opinion: </td>
					<td>
						<select bind:value={opinionId} class="form-select" on:change={handleConvertLeftToRight}>
							{#each getOpinions(converters)[unitType] as opinion}
								<option value={opinion}>{converters[unitType]?.opinions?.[opinion]?.name}</option>
							{/each}
						</select>
					</td>
				</tr>
			</table>
		{/if}
	</div>
{:catch}
	<div>An error occurred while loading the list of units.</div>
{/await}

<style>
	h2 {
		margin-bottom: 0.75em;
	}

	h5 {
		margin-top: 0.2em;
	}

	#gregorianYear,
	#hebrewYear {
		width: 5.2em;
	}

	#gregorianDay,
	#hebrewDay {
		width: 4.2em;
	}

	.equals {
		padding: 0.9em 0;
		font-size: 2.4em;
	}
</style>
