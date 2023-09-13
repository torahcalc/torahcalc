<script>
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';

	export let success = false;
	export let reason = '';
</script>

<div class="reason">
	{#if success}
		<!-- Green checkmark -->
		<span class="icon check">
			<Fa icon={faCheck} />
		</span>
	{:else}
		<!-- Red X -->
		<span class="icon x">
			<Fa icon={faX} />
		</span>
	{/if}
	<span>{reason}</span>
</div>

<style>
	.reason {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		background-color: #fff;
		padding: 1.5rem;
		margin: 1rem 0;
		gap: 0.5rem;
	}

	.reason span.icon {
		margin-right: 1rem;
	}

	.reason span.icon.check {
		color: #10b981;
	}

	.reason span.icon.x {
		color: #ef4444;
	}
</style>
