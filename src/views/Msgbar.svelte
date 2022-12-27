{#if !$status.online}
	<Overlay>Internet connection lost</Overlay>
{:else if !$status.heartbeat}
	<Overlay>No connection to BFF server</Overlay>
{:else if $updates}
	<Overlay icon="download" action={updateAppVersion}>
		New version of this software available, click to update
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
