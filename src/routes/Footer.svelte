<script>
	const date = new Date();
	const year = date.getFullYear();
</script>

<footer>
	<p style="display:inline;" id="footerText">
		© {year}
		<a href="http://torahcalc.com" style="text-decoration:none;color:#343434;">TorahCalc.com</a>, Fresh Idea Inc., all rights reserved.
		<span> | </span>
		<a href="/terms/privacy">Privacy&nbsp;Policy</a>
		<span> | </span>
		<a href="/terms/tos">Terms&nbsp;and&nbsp;Conditions</a>
	</p>
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
		width: 90%;
		margin: 0 auto;
		text-align: center;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
