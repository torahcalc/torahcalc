<script>
	import { faKeyboard } from '@danieloi/pro-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';

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

<details class="mt-2">
	<summary><Fa icon={faKeyboard} /> Hebrew Keyboard</summary>

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
</details>

<style>
	details > summary {
		width: max-content;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}
	details > summary:hover {
		background-color: #eee;
	}
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
		max-width: 368px;
		margin: auto;
	}
	.letters > button {
		width: 38px;
		height: 38px;
		padding: 0;
		font-size: 1.2rem;
	}
</style>
