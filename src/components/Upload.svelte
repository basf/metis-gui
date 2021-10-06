<div class="upload">
	<Dropzone on:drop={handleFilesSelect} />
</div>
<ol>
	{#each files as item}
		<li>{item.name}</li>
	{/each}
</ol>

<script lang="ts">
	import Dropzone from 'svelte-file-dropzone';

	let files = [];

	function handleFilesSelect(e) {
		const { acceptedFiles } = e.detail;

		files = [...files, ...acceptedFiles];
	}
</script>

<style lang="scss">
	.upload > :global(.dropzone:focus) {
		border-color: $primary-color;
	}
</style>
