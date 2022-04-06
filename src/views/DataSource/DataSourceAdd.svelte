<Grid>
	<Col sm="12">
		<Input rows={4} placeholder="Paste POSCAR, CIF, or Optimade JSON" bind:value />
	</Col>
	<Divider align={!$media.sm ? 'vertical' : 'horizontal center'} text="OR" />
	<Col sm="12">
		<Upload on:files bind:clearFiles />
	</Col>
</Grid>
<Button variant="primary" block on:click>
	{contents.length ? 'Add data' : 'Add structure'}
</Button>

<script lang="ts" context="module">
	import { Button, Col, Divider, Grid, Input } from 'svelte-spectre';
	import { Upload } from '@/components/Upload/';

	import { media } from '@/stores/media';
</script>

<script lang="ts">
	export let value = '',
		clearFiles: () => void,
		contents: string[];
</script>
