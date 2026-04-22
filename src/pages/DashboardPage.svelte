<script>
	import { logout, getAllUsers } from '../util/fetchApi.js';
	import { currentUser } from '../stores/authStore.js';
	import toast from 'svelte-5-french-toast';

	let users = $state([]);
	let loadingUsers = $state(false);
	let showUsers = $state(false);

	async function handleLogout() {
		try {
			await logout();
			currentUser.set(null);

			toast.success('Logged out');

			history.pushState({}, '', '/');
			window.dispatchEvent(new PopStateEvent('popstate'));
		} catch (error) {
			console.error(error.message);
			toast.error('Logout failed');
		}
	}

	async function handleViewUsers() {
		if (showUsers) {
			showUsers = false;
			return;
		}

		loadingUsers = true;

		try {
			const data = await getAllUsers();
			users = data.users;
			showUsers = true;
			toast.success('Users loaded');
		} catch (error) {
			console.error(error.message);
			toast.error(error.message || 'Could not load users');
		} finally {
			loadingUsers = false;
		}
	}
</script>

<main class="container">
	<nav>
		<ul>
			<li>
				<strong>Dashboard</strong>
			</li>
		</ul>
		<ul>
			<li>
				<button class="secondary" on:click={handleLogout}>Logout</button>
			</li>
		</ul>
	</nav>

	<header>
		<h1>Welcome, {$currentUser?.username}</h1>
		<p>You are logged in and your session is active.</p>
	</header>

	<div class="dashboard-grid">
		<article>
			<h2>User info</h2>
			<p><strong>Username:</strong> {$currentUser?.username}</p>
			<p><strong>Email:</strong> {$currentUser?.email}</p>
			<p><strong>Role:</strong> {$currentUser?.role}</p>
		</article>

		<article>
			<h2>Status</h2>
			<p><strong>Session:</strong> Active</p>
			<p><strong>Authentication:</strong> OK</p>
		</article>
	</div>

	{#if $currentUser?.role === 'admin'}
		<article>
			<header>
				<h2>Admin panel</h2>
				<p>Manage and review registered users.</p>
				
				<div style="margin-top: 1rem;">
					<button on:click={handleViewUsers} aria-busy={loadingUsers}>
						{showUsers ? 'Hide users' : loadingUsers ? 'Loading...' : 'View users'}
					</button>
				</div>
			</header>

			{#if showUsers}

			<figure style="margin-top: 1.5rem;">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Username</th>
							<th>Email</th>
							<th>Role</th>
						</tr>
					</thead>

					<tbody>
						{#each users as user}
						<tr>
							<td>{user.id}</td>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>{user.role}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</figure>
		{/if}
	</article>
	{/if}
</main>

<style>
	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
		margin-bottom: 1rem;
	}
</style>