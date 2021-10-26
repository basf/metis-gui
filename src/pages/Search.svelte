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
		{#await $providersAsync}
			<Loaders.Control height="40px" />
		{:then providers}
			<Select
				on:select={clearPagination}
				bind:value={$query.params.provider}
				options={providersOptions(providers)}
				let:option
				size="lg"
			/>
		{/await}
	</InputGroup>
	<Pagination
		bind:total
		bind:limit={$query.params.limit}
		bind:page={$query.params.page}
		bind:limits
		rest={9}
	/>
	<div class="p-2" />

	<div bind:clientWidth={width}>
		{#await $resultsAsync}
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
					<OptimadeApis {apis} bind:meta bind:data /> <!-- get data from apis not sure -->
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

<script lang="ts" context="module">
	import { query, redirect } from 'svelte-pathfinder';
	import * as storage from '@/helpers/storage';

	import { Icon, IconButton, Input, InputGroup, Pagination, Select, Tile } from 'svelte-spectre';

	import * as Loaders from '@/components/loaders';
	import OptimadeApis from '@/views/optimade/OptimadeApis.svelte';

	import Main from '@/layouts/Main.svelte';

	import { structuresAsync as resultsAsync, providersAsync } from '@/stores/optimade';
	import { Types } from '@/services/optimade';

	export async function preload({ query }) {
		if (!query.params.q || !query.params.provider) {
			const query = storage.getItem<string>('optimade_query', sessionStorage);
			if (query) {
				redirect(`${location.pathname}${query}`);
			}
		}
	}
</script>

<script lang="ts">
	let width,
		total = 0,
		limits = [10],
		meta,
		data;

	function clearPagination() {
		$query.params.page = 1;
		$query.params.limit = 10;
		limits = [10];
		total = 0;
	}

	function clearSearch() {
		$query.params.q = '';
		clearPagination();
	}

	function makeLimits(limits: number[], data: number) {
		if (limits[0] > 10) {
			const length = data <= 100 ? Math.ceil(data / 10) : 10;
			return Array.from({ length }, (_, i) => (i + 1) * 10);
		} else {
			return limits;
		}
	}

	// fix for provider MP from reduce data_returned per page
	function setTotal(provider: string, data: number, page: number) {
		return provider === 'mp' && data < total && page && page > 1 ? total : data;
	}
	function setLimits(limits: number[], data: number) {
		return limits?.length === 1 ? makeLimits(limits, data) : limits;
	}

	$: total = setTotal($query.params.provider, meta?.data_returned, $query.params.page);
	$: limits = setLimits(meta?.limits, meta?.data_returned);

	function providersOptions(providers: Types.Provider[]) {
		return providers.map((p) => ({ value: p.id, label: p.attributes.name }));
	}
</script>
