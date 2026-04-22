<script>
	import { login, register } from '../util/fetchApi.js';
	import { currentUser } from '../stores/authStore.js';
	import toast from 'svelte-5-french-toast';

	let isFlipped = $state(false);

	let loginEmail = $state('');
	let loginPassword = $state('');

	let signupUsername = $state('');
	let signupEmail = $state('');
	let signupPassword = $state('');

	function flipCard() {
		isFlipped = !isFlipped;
	}

	async function handleLogin() {
		try {
			const data = await login(loginEmail, loginPassword);
			currentUser.set(data.user);

			toast.success('Logged in successfully');

			history.pushState({}, '', '/dashboard');
			window.dispatchEvent(new PopStateEvent('popstate'));

			loginEmail = '';
			loginPassword = '';
		} catch (error) {
			toast.error(error.message || 'Login failed');
		}
	}

	async function handleRegister() {
		try {
			const data = await register(signupUsername, signupEmail, signupPassword);

			toast.success('Account created | Welcome email sent');

			if (data.emailPreview) {
				console.log('Email preview: ' + data.emailPreview);
			}

			signupUsername = '';
			signupEmail = '';
			signupPassword = '';

			isFlipped = false;
		} catch (error) {
			toast.error(error.message || 'Signup failed');
		}
	}
</script>

<div class="auth-page">
	<div class="flip-card">
		<div class:flipped={isFlipped} class="flip-card-inner">
			<section class="flip-card-face">
				<article>
					<h1>Login</h1>
					<p>Sign in to your account</p>

					<form on:submit|preventDefault={handleLogin}>
						<label for="login-email">Email</label>
						<input
							id="login-email"
							type="email"
							placeholder="Email"
							bind:value={loginEmail}
							required
						/>

						<label for="login-password">Password</label>
						<input
							id="login-password"
							type="password"
							placeholder="Password"
							bind:value={loginPassword}
							required
						/>

						<button type="submit">Login</button>
					</form>

					<footer class="auth-footer">
						<button class="secondary outline" type="button" on:click={flipCard}>
							Create an account
						</button>
					</footer>
				</article>
			</section>

			<section class="flip-card-face flip-card-back">
				<article>
					<h1>Sign up</h1>
					<p>Create a new account</p>

					<form on:submit|preventDefault={handleRegister}>
						<label for="signup-username">Username</label>
						<input
							id="signup-username"
							type="text"
							placeholder="Username"
							bind:value={signupUsername}
							required
						/>

						<label for="signup-email">Email</label>
						<input
							id="signup-email"
							type="email"
							placeholder="Email"
							bind:value={signupEmail}
							required
						/>

						<label for="signup-password">Password</label>
						<input
							id="signup-password"
							type="password"
							placeholder="Password"
							bind:value={signupPassword}
							required
						/>

						<button type="submit">Create account</button>
					</form>

					<footer class="auth-footer">
						<button class="secondary outline" type="button" on:click={flipCard}>
							Back to login
						</button>
					</footer>
				</article>
			</section>
		</div>
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 2rem;
	}

	.flip-card {
		perspective: 1200px;
		width: 100%;
		max-width: 500px;
	}

	.flip-card-inner {
		position: relative;
		width: 100%;
		transform-style: preserve-3d;
		transition: transform 0.7s ease;
	}

	.flip-card-inner.flipped {
		transform: rotateY(180deg);
	}

	.flip-card-face {
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		grid-area: 1 / 1;
	}

	.flip-card {
		display: grid;
	}

	.flip-card-inner {
		display: grid;
	}

	.flip-card-face > article {
		margin: 0;
	}

	.flip-card-back {
		transform: rotateY(180deg);
	}

	.auth-footer {
		margin-top: 1rem;
	}
</style>