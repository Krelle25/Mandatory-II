<script>
	import './app.css';
	import { onMount } from 'svelte';
	import LoginPage from './pages/LoginPage.svelte';
	import DashboardPage from './pages/DashboardPage.svelte';
	import { getUser } from './util/fetchApi.js';
	import { currentUser } from './stores/authStore.js';
	import { Toaster } from 'svelte-5-french-toast';

	let loading = $state(true);
	let path = $state(window.location.pathname);

	function updatePath() {
		path = window.location.pathname;
	}

	function goTo(url) {
		history.pushState({}, '', url);
		updatePath();
	}

	onMount(async () => {
		window.addEventListener('popstate', updatePath);

		try {
			const data = await getUser();

			currentUser.set(data.user);
		} catch {
			currentUser.set(null);
		} finally {
			loading = false;
		}

		return () => {
			window.removeEventListener('popstate', updatePath);
		};
	});

	$effect(() => {
		if (!loading) {
			if (!$currentUser && path === '/dashboard') {
				goTo('/');
			}

			if ($currentUser && path === '/') {
				goTo('/dashboard');
			}
		}
	});
</script>

<Toaster />

{#if loading}
	<p>Checking session...</p>
{:else if path === '/dashboard' && $currentUser}
	<DashboardPage />
{:else}
	<LoginPage />
{/if}
