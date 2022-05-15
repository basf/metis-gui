<div class="py-2">
	<Grid>
		{#if add}
			<Col col="auto">
				<IconButton
					size="lg"
					icon={addOpen ? 'minus' : 'plus'}
					variant="default"
					tooltip="Add structure"
					on:click={() => (addOpen = !addOpen)}
				/>
			</Col>
		{/if}
		<Col>
			<Input
				bind:value
				options={suggested}
				placeholder="Filter by name"
				autocomplete="on"
				type="search"
				name="dataSearch"
				autofocus
				size="lg"
			>
				<IconButton
					slot="iconRight"
					type="button"
					icon={value ? 'cross' : 'search'}
					on:click={() => (value = '')}
				/>
			</Input>
		</Col>
	</Grid>
</div>

<script lang="ts" context="module">
	import { Col, Grid, IconButton, Input } from 'svelte-spectre';

	const match = (item: any, value: string) =>
		cleanup(item.name).toLowerCase().includes(value.toLowerCase());

	const cleanup = (string: string): string => string.replace(/(<([^>]+)>)/gi, '') || '';

	export { match, cleanup };
</script>

<script lang="ts">
	export let value = '',
		data: any[] = [],
		add = false,
		addOpen = false;

	$: suggested = value ? makeSuggested(data) : [];

	function makeSuggested(items: any[]): any[] {
		return items.map((item) => match(item as any, value) && cleanup(item.name)).filter(Boolean);
	}
</script>
