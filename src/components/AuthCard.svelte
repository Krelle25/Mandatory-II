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
			<div class="flip-card-face auth-card">
				<h1>Login</h1>
				<p class="subtitle">Sign in to your account</p>

				<label for="login-email">Email</label>
				<input
					id="login-email"
					class="input"
					type="text"
					placeholder="Email"
					bind:value={loginEmail}
				/>

				<label for="login-password">Password</label>
				<input
					id="login-password"
					class="input"
					type="password"
					placeholder="Password"
					bind:value={loginPassword}
				/>

				<button class="primary-btn" type="button" onclick={handleLogin}>
					Login
				</button>

				<button class="link-btn" type="button" onclick={flipCard}>
					Create an account
				</button>
			</div>

			<div class="flip-card-face flip-card-back auth-card">
				<h1>Sign up</h1>
				<p class="subtitle">Create a new account</p>

				<label for="signup-username">Username</label>
				<input
					id="signup-username"
					class="input"
					type="text"
					placeholder="Username"
					bind:value={signupUsername}
				/>

				<label for="signup-email">Email</label>
				<input
					id="signup-email"
					class="input"
					type="text"
					placeholder="Email"
					bind:value={signupEmail}
				/>

				<label for="signup-password">Password</label>
				<input
					id="signup-password"
					class="input"
					type="password"
					placeholder="Password"
					bind:value={signupPassword}
				/>

				<button class="primary-btn" type="button" onclick={handleRegister}>
					Create account
				</button>

				<button class="link-btn" type="button" onclick={flipCard}>
					Back to login
				</button>
			</div>
		</div>
	</div>
</div>