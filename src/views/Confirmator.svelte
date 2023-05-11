<Modal size="md" bind:open={$confirmator.open}>
	<h3 slot="header">{$confirmator.message}</h3>
	<svelte:fragment slot="footer">
		<Button variant="link" on:click={cancelModal}>No</Button>
		<Button variant="error" on:click={confirmModal}>Yes</Button>
	</svelte:fragment>
</Modal>

<svelte:window on:keydown={handleKeydown} />

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

	function handleKeydown(e) {
		if ($confirmator.open) {
			switch (e.key) {
				case 'Escape':
					e.preventDefault();
					cancelModal();
					break;
				case 'Enter':
					e.preventDefault();
					confirmModal();
					break;

				default:
					break;
			}
		}
	}
</script>
