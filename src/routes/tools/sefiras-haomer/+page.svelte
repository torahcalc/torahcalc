<script>
	import addIcal from './images/add-ical.png';
	import addToGoogleCalendar from './images/add-to-google-calendar.png';
	import SefirasHaOmerCalculator from './SefirasHaOmerCalculator.svelte';

	const description = 'Calculate the day of the Omer to count and the Sefiros for any day of the Omer in any year.';


	/**
	 * Open the link to add the Sefiras HaOmer calendar to Google Calendar
	 * @param {MouseEvent} event The click event
	 */
	 function openAddToGoogleCalendarLink(event) {
		event.preventDefault();
		window.open('http://bit.ly/omercalendar');
	}

	/**
	 * Open a popup to show instructions for adding the Sefiras HaOmer calendar to iCal
	 * @param {MouseEvent} event The click event
	 */
	function openAddToICal(event) {
		event.preventDefault();
		const icsUrl = 'https://calendar.google.com/calendar/ical/5veponjj3c27jf17kelu53tl98%40group.calendar.google.com/public/basic.ics';
		const html = `<style> body { font-family: sans-serif; } </style>
                        <p>You can copy and paste this into any calendar product that supports the iCal format to access the Sefiras HaOmer Calendar:</p>
                        <p><a href="${icsUrl}">${icsUrl}</a></p>
                        <p>How to add Sefiras HaOmer to Google Calendar using this link:</p>
                        <ul>
                            <li>1. Open Google Calendar.</li>
                            <li>2. Next to "Other calendars" on the left, click the Down arrow.</li>
                            <li>3. Select Add by URL.</li>
                            <li>4. Copy the address above. (Right click and select copy.)</li>
                            <li>5. Paste the address in the field provided.</li>
                            <li>6. Click Add Calendar. The calendar will appear on the left side under "Other calendars".</li>
                        </ul>`;
		const popup = window.open('', 'popUpWindow', 'height=270,width=840,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no, status=no');
		if (!popup) {
			alert('Please allow popups for this site.');
			return;
		}
		popup.document.write(html);
	}
</script>

<svelte:head>
	<title>TorahCalc | Sefiras HaOmer Calculator</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
	<h1 class="heading">Sefiras HaOmer Calculator</h1>

	<p class="center">{description}</p>

	<div class="d-flex justify-content-center">
		<button class="sefirah-link" style="background-image: url({addToGoogleCalendar})" on:click={openAddToGoogleCalendarLink}></button>
		<button class="sefirah-link" style="background-image: url({addIcal})" on:click={openAddToICal}></button>
	</div>

	<SefirasHaOmerCalculator />
</section>

<style>
	.examples {
		margin: 0.5rem;
	}

	.sefirah-link {
		background-color: #fff;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		width: 200px;
		height: 50px;
		margin: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		transition: filter 0.2s;
	}

	.sefirah-link:hover {
		filter: brightness(0.9);
	}
</style>