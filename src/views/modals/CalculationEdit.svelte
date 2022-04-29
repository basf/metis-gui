<Editor code={$EditorCode.template} on:change={(e) => ($EditorCode.input = e.detail)} />

<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { Editor } from '@/components/Editor';
	import { EditorCode } from '@/stores/editor';
	import { getTemplate } from '@/services/api';
</script>

<script lang="ts">
	export const dataSourceId = 0;
	onMount(async () => {
		$EditorCode = await getTemplate('dummy');
	});
</script>
