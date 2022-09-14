<Form>
	<h5>{description}</h5>
	{#each Object.entries(properties).sort() as [key, value] (key)}
		{#if value.properties && Object.keys(value.properties).length}
			<fieldset>
				<legend><h3>{key}</h3></legend>
				{#each Object.entries(value.properties).sort() as [key, value]}
					{key}
					{#if value?.enum?.length || value?.items?.enum?.length}
						<Select options={value.enum || value.items.enum} />
					{/if}
					<details class="text-gray">
						<summary>JSON</summary>
						<small><pre>{key}: {JSON.stringify(value, 0, 2)}</pre></small>
					</details>
				{/each}
			</fieldset>
		{:else}
			{#if value.type === 'boolean'}
				<Checkbox>{key}</Checkbox>
			{:else if value?.enum?.length || value?.items?.enum?.length}
				<Select options={value.enum || value.items.enum} placeholder={key} />
			{:else}
				<Input type={value.type} placeholder={value.description}>{key}</Input>
			{/if}
			<details class="text-gray">
				<summary>JSON</summary>
				<small><pre>{key}: {JSON.stringify(value, 0, 2)}</pre></small>
			</details>
		{/if}
	{/each}
</Form>

<script lang="ts" context="module">
	import { Checkbox, Form, Input, Select } from 'svelte-spectre';
</script>

<script lang="ts">
	export let template = '';
	export let schema: { [key: string]: any } = {};
	export let input = '';

	const { description, properties } = schema;

	//console.log(template, schema, input);
</script>

<style lang="scss">
	h5 {
		text-align: center;
		letter-spacing: 1px;
		color: #999;
		background: #9c9;
		padding: 8px 0;
	}
</style>
