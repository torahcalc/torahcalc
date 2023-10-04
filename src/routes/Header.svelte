<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/torahcalc.svg';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { PUBLIC_ADAPTER } from '$env/static/public';
	import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

	const pages = [
		{
			name: 'Home',
			url: '/',
		},
		{
			name: 'Input',
			url: '/input',
		},
		{
			name: 'Calendar and Zmanim',
			children: [
				{
					name: 'Date Converter',
					url: '/dateconverter',
				},
				{
					name: 'Leap Years',
					url: '/leapyears',
				},
			],
		},
		{
			name: 'Info',
			children: [
				{
					name: 'Gematria Methods',
					url: '/info/gematria',
				},
			],
		},
	];

	// only show the API page on the full site and not on the static site
	if (PUBLIC_ADAPTER !== 'static') {
		pages.push({
			name: 'API',
			url: '/api',
		});
	}

	// current page
	$: current = $page.url.pathname;

	/**
	 * Hide all dropdown menus in the navbar
	 */
	function hideDropdowns() {
		const dropdowns = document.querySelectorAll('.navbar .dropdown-menu.show');
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
	<nav class="navbar navbar-expand-lg bg-body-tertiary">
		<div class="container-fluid">
			<a class="navbar-brand" href="/">
				<img src={logo} alt="TorahCalc" class="logo" />
			</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon" />
			</button>
			<div class="collapse navbar-collapse" id="navbarMain">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
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
										<li><a class="dropdown-item {current == subpage.url ? 'active' : ''}" aria-current={current == subpage.url && 'page'} href={subpage.url}>{subpage.name}</a></li>
									{/each}
								</ul>
							</li>
						{/if}
					{/each}
				</ul>
				<span class="navbar-text">
					<a class="nav-link" href="https://torahcalc.com" target="_blank" rel="noopener noreferrer">
						<Fa icon={faExternalLinkAlt} size="1x" />
						<span>Visit Old Site</span>
					</a>
					<a class="github" href="https://github.com/torahcalc/torahcalc" target="_blank" rel="noopener noreferrer">
						<Fa icon={faGithub} size="1.5x" />
						<span>View on GitHub</span>
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
