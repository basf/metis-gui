<Modal size="sm" bind:open={$confirmator.open}>
	<h3>{$confirmator.message}</h3>
	<Button variant="link" on:click={cancelModal}>No</Button>
	<Button variant="error" on:click={confirmModal}>Yes</Button>
</Modal>

<script lang="ts" context="module">
	import { Modal, Button } from 'svelte-spectre';
	import { confirmator } from '@/stores/confirmator';
</script>

<script lang="ts">
	function confirmModal() {
		if ('function' in $confirmator)
			$confirmator.function($confirmator.args).then(() => confirmator.set({ open: false }));
	}
	function cancelModal() {
		confirmator.set({ open: false });
	}
</script>
