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
					<IconButton icon="cross" on:click={clearSearch} />
				{:else}
					<Icon icon="search" offset="mx-2" />
				{/if}
			</span>
		</Input>
		{#await $providers}
			<Loaders.Control />
		{:then providers}
			<Select
				on:select={providerSelected}
				bind:value={$query.params.provider}
				options={providersOptions(providers)}
				let:option
				size="lg"
			/>
		{/await}
	</InputGroup>
	<Pagination
		{total}
		bind:limit={$query.params.limit}
		bind:page={$query.params.page}
		bind:limits
		rest={9}
	/>
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
					<Apis {apis} bind:meta bind:data /> <!-- get data from apis not sure -->
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

	import { structuresAsync as results, providersAsync as providers } from '@/stores/optimade';
	import { Types } from '@/services/optimade';

	let width,
		total = 0,
		limits = [10],
		meta,
		data;

	function providerSelected() {
		$query.params.page = 1;
		$query.params.page = 1;
		$query.params.limit = 10;
		limits = [];
		total = 0;
	}

	function clearSearch() {
		$query.params.q = '';
		$query.params.page = 1;
		$query.params.limit = 10;
		limits = [];
		total = 0;
	}

	function makeLimits() {
		if (meta?.limits[0] > 10) {
			return Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
		} else {
			return meta?.limits;
		}
	}

	$: total =
		$query.params.provider === 'mp' && meta?.data_returned < total && $query.params.page > 1
			? total
			: meta?.data_returned; // fix for provider MP from reduce data_returned per page
	$: limits = meta?.limits.length === 1 ? makeLimits() : meta?.limits;

	$: providersOptions = (providers: Types.Provider[]) =>
		providers.map((p) => ({ value: p.id, label: p.attributes.name }));
</script>
