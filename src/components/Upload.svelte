<div class="upload">
	<Dropzone on:drop={handleFilesSelect} />
</div>
<ol>
	{#each files as item}
		<li>{item.name}</li>
	{/each}
</ol>

<script>
	import Dropzone from 'svelte-file-dropzone';

	let files = [];

	function handleFilesSelect(e) {
		const { acceptedFiles } = e.detail;

		files = [...files, ...acceptedFiles];
	}
</script>

<style>
	.upload > :global(.dropzone:focus) {
		border-color: #5755d9;
	}
</style>
