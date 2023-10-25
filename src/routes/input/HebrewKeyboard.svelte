<script>
	/**
	 * Function to add a character to the query input
	 * @type {(character: string) => void}
	 */
	export let addCharacter;

	/**
	 * Function to remove a character from the query input
	 * @type {() => void}
	 */
	export let backspace;

	/**
	 * Function to clear the query input
	 * @type {() => void}
	 */
	export let clear;

	const hebrewLetters = 'אבגדהוזחטיכךלמםנןסעפףצץקרשת';
</script>

<div class="hebrew-keyboard">
	<div class="action-row">
		<button class="btn btn-outline-secondary" on:click={() => addCharacter(' ')}>Space</button>
		<button class="btn btn-outline-secondary" on:click={() => backspace()}>Backspace</button>
		<button class="btn btn-outline-secondary" on:click={() => clear()}>Clear</button>
	</div>
	<div class="letters">
		{#each hebrewLetters as letter}
			<button class="btn btn-outline-secondary" on:click={() => addCharacter(letter)}>{letter}</button>
		{/each}
	</div>
</div>

<style>
	.hebrew-keyboard {
		display: flex;
		flex-direction: column;
		margin-top: 0.5rem;
	}
	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.2rem;
		margin-bottom: 0.5rem;
	}
	.letters {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		direction: rtl;
		gap: 0.2rem;
		width: 100%;
		max-width: 404px;
		margin: auto;
	}
	.letters > button {
		width: 42px;
		font-size: 1.167rem;
	}
</style>
