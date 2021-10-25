<Main>
	<div class="p-2" />
	<InputGroup>
		<Input
			bind:value={$query.params.q}
			placeholder="Optimade filter="
			name="q"
			type="search"
			size="lg"
			inline
			autofocus
			width="7"
			expand
		>
			<span slot="iconRight">
				{#if $query.params.q}
					<IconButton icon="cross" on:click={() => ($query.params.q = '')} />
				{:else}
					<Icon icon="search" offset="mx-2" />
				{/if}
			</span>
		</Input>
		{#await $providersAsync}
			<Loaders.Control />
		{:then providers}
			<Select
				on:select={providerSelected}
				bind:value={provider}
				options={providersOptions}
				let:option
				size="lg"
			/>
		{/await}
	</InputGroup>
	<Pagination bind:total bind:limit bind:page rest={9} />
	<div class="p-2" />

	<div bind:clientWidth={width}>
		{#await $results}
			<Loaders.Tile count={5} w={width} h={65} height={400} {width} />
		{:then results}
			{#each results as [apis, provider], index}
				{#if apis.some((a) => a instanceof Error)}
					<Tile>
						<div class="text-center text-error distant_msg">
							{apis}
						</div>
					</Tile>
				{:else}
					<Apis {apis} bind:meta bind:data />
				{/if}
			{/each}
		{:catch error}
			<Tile>
				<div class="text-center text-error distant_msg">
					{error}
				</div>
			</Tile>
		{/await}
	</div>
</Main>

<script lang="ts">
	import { query } from 'svelte-pathfinder';

	import { Icon, IconButton, Input, InputGroup, Pagination, Select, Tile } from 'svelte-spectre';

	import * as Loaders from '@/components/loaders';
	import Apis from '@/components/Apis.svelte';

	import Main from '@/layouts/Main.svelte';

	import { structuresAsync as results, providersAsync, providers } from '@/stores/optimade';

	let width,
		page = 1,
		total = 0,
		limit = 10,
		provider,
		meta,
		data;

	function providerSelected() {
		$query.params.page = 0;
		$query.params.returned = 0;
		page = 1;
		total = 0;
	}

	$: $query.params.page = !page ? 0 : page - 1;
	$: $query.params.limit = limit;
	$: $query.params.returned = total;
	$: $query.params.provider = provider;
	$: page = !page ? 1 : page;
	$: total = meta?.data_returned < total && page > 1 ? total : meta?.data_returned;
	$: providersOptions = $providers.map((p) => ({ value: p.id, label: p.attributes.name }));
</script>
