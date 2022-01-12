<Toaster />

{#if !$status.online || !$status.heartbeat}
<div class="overlay">
	<slot>We are offline</slot>
	<IconButton icon="refresh" on:click={() => location.reload()} />
</div>
{/if}

<script lang="ts" context="module">
	import { IconButton, Toaster, toast } from 'svelte-spectre';

	import calculations from '@/stores/calculations';
	import datasources from '@/stores/datasources';
	import status from '@/stores/status';
	import errors from '@/stores/errors';
</script>

<script lang="ts">
	$: $errors.forEach(({ error }) => {
		const msg = error.message || error;
		toast.error({ msg, timeout: 4000, pos: 'top_right' })
	});

	$: $calculations.length && toast.primary({ msg: 'Calculations synced', timeout: 2000, pos: 'top_right' });
	$: $datasources.length && toast.primary({ msg: 'Structures synced', timeout: 2000, pos: 'top_right' });
</script>