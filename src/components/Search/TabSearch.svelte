<form method="GET" on:submit on:submit|preventDefault class="py-2">
	<Input
		bind:value
		options={suggested}
		placeholder=" Datasource name"
		autocomplete="on"
		type="search"
		name="q"
		autofocus
		inline
		size="lg"
	>
		<span slot="iconRight">
			{#if value}
				<IconButton type="button" icon="cross" on:click={() => (value = '')} />
			{/if}
		</span>
	</Input>
</form>

<script lang="ts" context="module">
	import { IconButton, Input } from 'svelte-spectre';

	const match = (item: any, value: string) =>
		cleanup(item.name).toLowerCase().includes(value.toLowerCase());

	const cleanup = (string: string): string => string.replace(/(<([^>]+)>)/gi, '') || '';

	export { match, cleanup };
</script>

<script lang="ts">
	export let value = '',
		data: any[] = [];

	$: suggested = value ? makeSuggested(data) : [];

	function makeSuggested(items: any[]): any[] {
		return items.map((item) => match(item as any, value) && cleanup(item.name)).filter(Boolean);
	}
</script>
