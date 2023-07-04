{#if !$status.online}
	<Overlay>internet connection lost</Overlay>
{:else if !$status.heartbeat}
	<Overlay>no connection to the server</Overlay>
{:else if $updates}
	<Overlay icon="download" action={updateAppVersion}>
		new version of this software available, click to update
	</Overlay>
{/if}

<Toaster />

<script lang="ts" context="module">
	import { Toaster, toast } from 'svelte-spectre';
	import { Overlay } from '@/layouts';

	import status, { updates } from '@/stores/status';
	import errors from '@/stores/errors';

	import { updateAppVersion } from '@/helpers/utils';
</script>

<script lang="ts">
	$: $errors.forEach(({ error }) => {
		const msg = error.message || error;
		toast.error({ msg, timeout: 4000, pos: 'top_right' });
	});
</script>
