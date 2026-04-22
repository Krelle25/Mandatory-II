<script>
	import './app.css';
	import { onMount } from 'svelte';
	import { Router, Route } from 'svelte-routing';
	import LoginPage from './pages/LoginPage.svelte';
	import DashboardPage from './pages/DashboardPage.svelte';
	import PrivateRoute from './components/PrivateRoute.svelte';
	import { getUser } from './util/fetchApi.js';
	import { currentUser } from './stores/authStore.js';
	import { Toaster } from 'svelte-5-french-toast';

	let loading = $state(true);

	onMount(async () => {
		try {
			const data = await getUser();

			currentUser.set(data.user);
		} catch {
			currentUser.set(null);
		} finally {
			loading = false;
		}
	});
</script>

<Toaster />

{#if loading}
	<p>Checking session...</p>
{:else}
	<Router>
		<Route path="/dashboard">
			<PrivateRoute>
				<DashboardPage />
			</PrivateRoute>
		</Route>
		
		<Route path="/">
			<LoginPage />
		</Route>
	</Router>
{/if}
