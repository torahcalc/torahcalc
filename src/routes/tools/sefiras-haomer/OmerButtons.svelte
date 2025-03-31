<script>
export let goToPreviousDay = () => {};
export let goToNextDay = () => {};
export let goToToday = () => {};
export let goToFirstNight = () => {};
export let goTo49thNight = () => {};
</script>

<div class="text-center d-flex flex-wrap gap-2 justify-content-center align-items-center">
	<button class="btn btn-sm btn-outline-primary" on:click={() => goToPreviousDay()}>
		<span class="icon">←</span> Previous Day
	</button>
	<div class="d-inline-flex flex-wrap gap-2 justify-content-center align-items-center">
		<button class="btn btn-sm btn-outline-secondary" on:click={() => goToFirstNight()}>Go to 1st Night</button>
		<button class="btn btn-sm btn-outline-secondary" on:click={() => goToToday()}>Go to Today</button>
		<button class="btn btn-sm btn-outline-secondary" on:click={() => goTo49thNight()}>Go to 49th Night</button>
	</div>
	<button class="btn btn-sm btn-outline-primary" on:click={() => goToNextDay()}>
		Next Day <span class="icon">→</span>
	</button>
</div>
