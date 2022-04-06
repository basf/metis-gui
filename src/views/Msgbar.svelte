<Toaster />

{#if offline}
	<div class="overlay">
		<slot>We are offline</slot>
		<IconButton icon="refresh" on:click={() => location.reload()} />
	</div>
{/if}

{#if $updates}
	<div class="overlay">
		<slot>New version of this software available, click to update</slot>
		<IconButton icon="download" on:click={updateAppVersion} />
	</div>
{/if}

<script lang="ts" context="module">
	import { IconButton, Toaster, toast } from 'svelte-spectre';
	import user from '@/stores/user';
	import status, { updates } from '@/stores/status';
	import errors from '@/stores/errors';

	import { updateAppVersion } from '@/helpers/utils';
</script>

<script lang="ts">
	let offline = false;
	$: {
		setTimeout(() => (offline = !$status.online || !$status.heartbeat), 500);

		if (offline && $user)
			toast.warning({ msg: 'You are logged out', timeout: 1000, pos: 'top_right' });

		$errors.forEach(({ error }) => {
			const msg = error.message || error;
			toast.error({ msg, timeout: 4000, pos: 'top_right' });
		});
	}
</script>
