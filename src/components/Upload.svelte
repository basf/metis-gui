<div class="upload">
	<Dropzone on:drop={select} />
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
	import { IconButton } from 'svelte-spectre';

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
</script>

<style lang="scss">
	.upload > :global(.dropzone) {
		&:focus {
			border-color: $primary-color;
		}
	}
	@media (prefers-color-scheme: dark) {
		.upload > :global(.dropzone) {
			border-color: $dark-secondary;
			background-color: $dark-color;
		}
	}
	[color-scheme='dark'] {
		.upload > :global(.dropzone) {
			border-color: $dark-secondary;
			background-color: $dark-secondary;
		}
	}
</style>
