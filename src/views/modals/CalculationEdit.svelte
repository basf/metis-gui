{#if $editorCode.template}
	<Editor code={$editorCode.template} on:change={(e) => ($editorCode.input = e.detail)} />
{:else}
	<Loaders.Circle big />
{/if}

<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { Editor } from '@/components/Editor';
	import { editorCode } from '@/stores/editor';
	import { getTemplate } from '@/services/api';
	import * as Loaders from '@/components/loaders';
</script>

<script lang="ts">
	export const dataSourceId = 0;

	onMount(async () => {
		$editorCode = await getTemplate('dummy');
	});
</script>
