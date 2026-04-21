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

	function getInitials(email) {
		if (!email) return 'U';
		return email.slice(0, 2).toUpperCase();
	}
</script>

<div class="container">
	<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
		<div>
			<h1>Dashboard</h1>
			<p class="muted">You are logged in</p>
		</div>

		<button class="btn btn-primary" onclick={handleLogout}>
			Logout
		</button>
	</div>

	<div class="grid grid-2">
		<div class="card">
			<h3>User info</h3>

			<div class="row">
				<span class="muted">Username</span>
				<span>{$currentUser?.username}</span>
			</div>

			<div class="row">
				<span class="muted">Email</span>
				<span>{$currentUser?.email}</span>
			</div>

			<div class="row">
				<span class="muted">Role</span>
				<span>{$currentUser?.role}</span>
			</div>
		</div>

		<div class="card">
			<h3>Status</h3>

			<div class="row">
				<span class="muted">Session</span>
				<span>Active</span>
			</div>

			<div class="row">
				<span class="muted">Auth</span>
				<span style="color: var(--success)">OK</span>
			</div>
		</div>

		{#if $currentUser?.role === 'admin'}
			<div class="card" style="grid-column: span 2;">
				<h3>Admin</h3>

				<div style="margin: 1rem 0;">
					<button class="btn btn-secondary" onclick={handleViewUsers}>
						{showUsers ? 'Hide users' : 'View users'}
					</button>
				</div>

				{#if showUsers}
					<table class="table">
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
				{/if}
			</div>
		{/if}
	</div>
</div>