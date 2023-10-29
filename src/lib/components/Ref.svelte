<script>
	/* Reference link to scroll to an anchor when clicked */

	/**
	 * @type {string} The number of the anchor to scroll to.
	 */
	export let id;

	const refId = `ref-${id}`;

	/**
	 * Scrolls to the anchor with the given id.
	 */
	function scrollToAnchor() {
		const anchor = document.getElementById(refId);
		if (anchor) {
			anchor.scrollIntoView();
		}
	}
</script>

<sup>
	<a href="#{refId}" on:click={scrollToAnchor}>[{id}]</a>
</sup>
