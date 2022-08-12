<Form>
	<slot>Form representation placeholder</slot>
</Form>

<script lang="ts" context="module">
	import { Form } from 'svelte-spectre';
</script>

<script lang="ts">
	export let template = '';
	export let schema = {};
	export let input = '';

	console.log(template, schema, input);
</script>
