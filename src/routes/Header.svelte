<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/torahcalc.svg';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { faExternalLinkAlt } from '@danieloi/pro-solid-svg-icons';
	import { PUBLIC_ADAPTER } from '$env/static/public';

	const pages = [
		{ name: 'Home', url: '/' },
		{
			name: 'More Tools',
			children: [
				{ name: 'Biblical Unit Converter', url: '/tools/unit-converter' },
				{ name: 'Multi-Unit Charts', url: '/tools/unit-charts' },
				{ name: 'dropdown-divider' },
				{ name: 'Gematria Calculator', url: '/tools/gematria' },
				{ name: 'Gematria Search', url: '/tools/gematria-search' },
				{ name: 'Gematria Two-Word Match', url: '/tools/gematria-match' },
				{ name: 'dropdown-divider' },
				{ name: 'Date Converter', url: '/tools/date-converter' },
				{ name: 'Leap Years', url: '/tools/leap-years' },
				{ name: 'Jewish Holidays', url: '/tools/jewish-holidays' },
				{ name: 'Daily Learning / Daf Yomi', url: '/tools/daily-learning' },
				{ name: 'Molad', url: '/tools/molad' },
				{ name: 'Sefiras HaOmer', url: '/tools/sefiras-haomer' },
				{ name: 'Zmanim', url: '/tools/zmanim' },
				{ name: 'Hebrew Zodiac Signs', url: '/tools/hebrew-zodiac-signs' },
				{ name: 'Birkas Hachama', url: '/tools/birkas-hachama' },
				{ name: 'Shmita Years', url: '/tools/shmita' },
			],
		},
		{
			name: 'Information',
			children: [
				{ name: 'Gematria Methods', url: '/info/gematria' },
				{ name: 'Biblical Units', url: '/info/biblical-units' },
				{ name: 'Tanach Stats', url: '/info/tanach-stats' },
				{ name: 'Parsha Stats', url: '/info/parsha-stats' },
			],
		},
	];

	// only show the API page on the full site and not on the static site
	if (PUBLIC_ADAPTER !== 'static') {
		pages.push({ name: 'API', url: '/api' });
	}

	// current page
	$: current = $page.url.pathname;

	/**
	 * Hide all dropdown menus in the navbar
	 */
	function hideDropdowns() {
		const dropdowns = document.querySelectorAll('.navbar, .dropdown-menu.show, .navbar-collapse');
		for (const dropdown of dropdowns) {
			dropdown.classList.remove('show');
		}
	}

	/**
	 * Hide dropdowns when clicking outside of them
	 * @param {any} event - the click event
	 */
	function handleWindowClick(event) {
		if (event.target.closest('.dropdown-item, .nav-link:not(.dropdown-toggle)')) {
			return hideDropdowns();
		}
		if (event.target.closest('.navbar')) {
			return;
		}
		hideDropdowns();
	}
</script>

<svelte:window on:click={handleWindowClick} />

<header>
	<nav class="navbar navbar-expand-md bg-body-tertiary">
		<div class="container-fluid">
			<a class="navbar-brand navbar-brand-link" href="/">
				<img src={logo} alt="TorahCalc" class="logo" />
				<span>TorahCalc</span>
			</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon" />
			</button>
			<div class="collapse navbar-collapse" id="navbarMain">
				<ul class="navbar-nav me-auto mb-2 mb-md-0">
					{#each pages as page (page)}
						{#if page.url}
							<li class="nav-item">
								<a class="nav-link {current == page.url ? 'active' : ''}" aria-current={current == page.url && 'page'} href={page.url}>{page.name}</a>
							</li>
						{:else if page.children}
							<li class="nav-item dropdown">
								<a class="nav-link dropdown-toggle {page.children.find((subpage) => subpage.url == current) ? 'active' : ''}" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									{page.name}
								</a>
								<ul class="dropdown-menu">
									{#each page.children as subpage (subpage)}
										{#if subpage.name == 'dropdown-divider'}
											<li class="dropdown-divider" />
										{:else}
											<li><a class="dropdown-item {current == subpage.url ? 'active' : ''}" aria-current={current == subpage.url && 'page'} href={subpage.url}>{subpage.name}</a></li>
										{/if}
									{/each}
								</ul>
							</li>
						{/if}
					{/each}
				</ul>
				<span class="navbar-text">
					<a class="nav-link" href="https://old.torahcalc.com" target="_blank" rel="noopener noreferrer">
						<Fa icon={faExternalLinkAlt} size="1x" />
						<span>Visit Old Site</span>
					</a>
					<a class="github" href="https://github.com/torahcalc/torahcalc" target="_blank" rel="noopener noreferrer">
						<Fa icon={faGithub} size="1.5x" />
						<span>Contribute</span>
					</a>
				</span>
			</div>
		</div>
	</nav>
</header>

<style>
	nav {
		width: 100%;
	}

	.dropdown-menu {
		--bs-dropdown-link-active-bg: var(--color-theme-1);
	}

	.logo {
		width: 2.5em;
		height: 2.5em;
	}

	.navbar-brand-link {
		color: var(--color-theme-1);
		text-decoration: none;
	}

	.navbar-brand-link:hover {
		text-decoration: none;
	}

	.navbar-text {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.navbar-text > a {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--bs-nav-link-color);
		text-decoration: none;
	}

	.navbar-text > a:hover {
		color: var(--bs-navbar-active-color);
	}
</style>
