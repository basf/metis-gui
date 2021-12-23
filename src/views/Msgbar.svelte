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
		toast.error({ msg, timeout: 4000 })
	});

    $: $calculations.length && toast.primary({ msg: 'Calculations updated', timeout: 2000 });
    $: $datasources.length && toast.primary({ msg: 'Datasources updated', timeout: 2000 });
</script>