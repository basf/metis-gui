<Form>
	<h5>{description}</h5>
	<pre>
		{#each Object.entries(properties) as [key, value] (key)}
			{key}: {JSON.stringify(value, 0, 2)}
		{/each}
	</pre>
	<!-- <slot>Form representation placeholder</slot> -->
</Form>

<script lang="ts" context="module">
	import { Form } from 'svelte-spectre';
</script>

<script lang="ts">
	export let template = '';
	export let schema: { [key: string]: any } = {};
	export let input = '';

	const { description, properties } = schema;

	console.log(template, schema, input);
</script>
