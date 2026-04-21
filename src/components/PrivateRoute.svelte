<script>
	import { navigate } from 'svelte-routing';
	import { currentUser } from '../stores/authStore.js';

	$: if (typeof window !== 'undefined' && !$currentUser) {
		navigate('/', { replace: true });
	}
</script>

{#if $currentUser}
	<slot />
{/if}