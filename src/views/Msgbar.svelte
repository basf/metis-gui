<Toaster />

{#if offline}
	<div class="overlay">
		<slot>We are offline</slot>
		<IconButton icon="refresh" on:click={() => location.reload()} />
	</div>
{/if}

<script lang="ts" context="module">
	import { IconButton, Toaster, toast } from 'svelte-spectre';
	import user from '@/stores/user';
	import status from '@/stores/status';
	import errors from '@/stores/errors';
</script>

<script lang="ts">
	let offline = false;

	$: {
		setTimeout(() => (offline = !$status.online || !$status.heartbeat), 500);

		if (offline && $user)
			toast.warning({ msg: 'You are logged out', timeout: 0, pos: 'top_right' });

		$errors.forEach(({ error }) => {
			const msg = error.message || error;
			toast.error({ msg, timeout: 4000, pos: 'top_right' });
		});
	}
</script>
