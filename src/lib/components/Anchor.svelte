<script>
	/* Anchor that is scrolled to when a Ref is clicked */

	/**
	 * @type {string} The number of the anchor
	 */
	export let id;

	const refId = `ref-${id}`;
</script>

<sup>
	<span id={refId}>{id}&thinsp;</span>
</sup>
