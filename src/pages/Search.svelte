<Main>
	<form method="GET" on:submit={submit} on:submit|preventDefault={clearPagination} class="py-2">
		<InputGroup>
			<Input
				bind:value={search}
				placeholder="Formula, elements, arity, etc."
				type="search"
				width="5"
				name="q"
				autofocus
				inline
				expand
				{size}
			>
				<span slot="iconRight">
					{#if $query.params.q}
						<IconButton type="button" icon="cross" on:click={clearSearch} />
					{/if}
				</span>
			</Input>
			{#await $providersAsync}
				<Loaders.Control height="{SIZE[size]}px" />
			{:then providers}
				<Select
					options={providersOptions(providers)}
					value={$query.params.provider}
					name="provider"
					{size}
				/>
				<Button type="submit" slot="button" input variant="primary" {size}>
					<Icon icon="search" />&nbsp;Search
				</Button>
			{/await}
		</InputGroup>
		{#if guessSearch}
			<div class="mt-2">
				<Badge>
					Optimade filter={guessSearch}
				</Badge>
			</div>
		{/if}
	</form>

	{#if total > 10}
		<Pagination
			bind:total
			bind:limits
			bind:limit={$query.params.limit}
			bind:page={$query.params.page}
			{rest}
		/>
		<div class="p-2" />
	{/if}

	<div bind:clientWidth={width}>
		{#await $resultsAsync}
			<Grid stack>
				{#each { length: 20 } as _}
					<Col col="auto">
						<Loaders.Tile
							count={1}
							w={width / 4 - 12}
							h={69}
							height={69}
							width={width / 4 - 12}
						/>
					</Col>
				{/each}
			</Grid>
		{:then results}
			{#each results as [apis, provider], index}
				{#if !apis || apis.some((a) => a instanceof Error)}
					<Tile>
						<div class="text-center text-error distant_msg">
							{apis || 'Nothing found. Try another provider?'}
						</div>
					</Tile>
				{:else}
					<OptimadeApis {apis} bind:meta bind:data {width} />
				{/if}
			{:else}
				<Tile>
					<div class="text-center distant_msg">
						Type your search query, select provider, and press the search button.
					</div>
				</Tile>
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
	import { get } from 'svelte/store';
	import { Param, query, redirect, submit } from 'svelte-pathfinder';
	import * as storage from '@/helpers/storage';

	import {
		Col,
		Grid,
		Icon,
		Input,
		Button,
		IconButton,
		InputGroup,
		Pagination,
		Select,
		Badge,
		Tile,
	} from 'svelte-spectre';

	import { SIZE } from 'svelte-spectre/package/types/const';

	import * as Loaders from '@/components/loaders';
	import OptimadeApis from '@/views/optimade/OptimadeApis.svelte';

	import Main from '@/layouts/Main.svelte';

	import { structuresAsync as resultsAsync, providersAsync } from '@/stores/optimade';
	import { guess } from '@/services/optimade';
	import type { Types } from '@/services/optimade';

	const size = 'lg';

	export async function preload() {
		const $query = get(query);
		if (!$query.params.q || !$query.params.provider) {
			const query = storage.getItem<string>('optimade_query', sessionStorage);
			if (query) {
				redirect(`${location.pathname}${query}`);
			}
		}
	}
</script>

<script lang="ts">
	let width: number,
		limits: number[] | undefined = [10],
		total: number,
		meta: Types.Meta,
		data: Types.Structure[],
		search = $query.params.q;

	function clearPagination() {
		if (meta) {
			$query.params.limit = 10;
			$query.params.page = 1;
			meta.data_returned = 0;
			limits = [];
			total = 0;
		}
	}

	function clearSearch() {
		$query.params.q = search = '';
		clearPagination();
	}

	function setLimits(limits: number[] | undefined, data: number) {
		return limits?.length === 1 ? makeLimits(limits, data) : limits;

		function makeLimits(limits: number[], data: number) {
			if (limits[0] > 10) {
				const length = data <= 100 ? Math.ceil(data / 10) : 10;
				return Array.from({ length }, (_, i) => (i + 1) * 10);
			} else {
				return limits;
			}
		}
	}

	// fix for provider MP from reduce data_returned per page
	function setTotal(provider: Param, data: number, page: Param) {
		return provider === 'mp' && data < total && page && page > 1 ? total : data;
	}

	function setPage(page: Param) {
		page = page === 0 ? 1 : page;
	}

	$: total = setTotal($query.params.provider, meta?.data_returned, $query.params.page);
	$: limits = setLimits(meta?.limits, meta?.data_returned);
	$: setPage($query.params.page);
	$: rest = Math.ceil(total / $query.params.limit) > 17 ? 7 : 0;

	$: guessSearch = guess(search) || search;

	function providersOptions(providers: Types.Provider[]) {
		return providers.map((p) => ({ value: p.id, label: p.attributes.name }));
	}
</script>
