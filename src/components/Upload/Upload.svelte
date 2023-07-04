<div class="upload">
	<Dropzone on:drop={select} on:droprejected={onReject}
		>Upload structure or pattern</Dropzone
	>
</div>
<ul>
	{#each files as file, i (file)}
		<li>
			{file.name}
			<IconButton variant="link" icon="cross" on:click={() => remove(i)} />
		</li>
	{/each}
</ul>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Dropzone from 'svelte-file-dropzone';
	import { IconButton, toast } from 'svelte-spectre';

	const dispatch = createEventDispatcher();

	let files: File[] = [];

	function select(e) {
		const { acceptedFiles } = e.detail;

		files = [...files, ...acceptedFiles];

		dispatch('files', { files });
	}

	function remove(i) {
		files = files.filter((_, index) => index != i);
		dispatch('files', { files });
	}

	export function clearFiles() {
		files = [];
		dispatch('files', { files });
	}

	function onReject() {
		toast.error({ msg: `Unaccepted file type`, timeout: 4000, pos: 'top_right' });
	}
</script>

<style lang="scss">
	.upload > :global(.dropzone) {
		border-width: 1px;
		border-color: $gray-color;
		&:focus {
			border-color: $primary-color;
		}
	}
	@media (prefers-color-scheme: dark) {
		.upload > :global(.dropzone) {
			background-color: $dark-secondary;
		}
	}
	:global([color-scheme='dark']) {
		.upload > :global(.dropzone) {
			background-color: $dark-secondary;
		}
	}
	:global([color-scheme='light']) {
		.upload > :global(.dropzone) {
			background-color: $gray-color-light;
		}
	}
</style>
