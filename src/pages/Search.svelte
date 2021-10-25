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
				bind:value={$query.params.provider}
				options={providersOptions}
				let:option
				size="lg"
			/>
		{/await}
	</InputGroup>
	<!-- {#if total} -->
	<Pagination total={$query.params.returned} bind:limit bind:page rest={9} />
	<!-- {/if} -->
	<div class="p-2" />

	<div bind:clientWidth={width}>
		{#await $results}
			<Loaders.Tile count={5} w={width} h={65} height={400} {width} />
		{:then results}
			{console.log(results)}
			{#each results as [apis, provider], index}
				{#if apis.some((a) => a instanceof Error)}
					<Tile>
						<div class="text-center text-error distant_msg">
							{apis}
						</div>
					</Tile>
				{:else}
					{#each apis as { data, meta }}
						{getMeta(data, meta)}
						{#if data}
							{#each data as structure}
								<Tile>
									<h5 class="mt-2" slot="title">
										{@html getStructureTitle(structure)}
									</h5>
									<small slot="subtitle" class="tile-subtitle text-gray"
										>ID &bull; {structure.id}{provider}</small
									>
									<svelte:fragment slot="action">
										<IconButton
											icon="upload"
											title="Upload this JSON to calculation"
											on:click={() => setDataContent(structure)}
										/>
									</svelte:fragment>
								</Tile>
							{:else}
								<Tile>
									<div class="text-center text-error distant_msg">
										Nothing found. Try another provider?
									</div>
								</Tile>
							{/each}
						{/if}
					{/each}
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
	import { query, goto } from 'svelte-pathfinder';

	import { Icon, IconButton, Input, InputGroup, Pagination, Select, Tile } from 'svelte-spectre';

	import * as Loaders from '@/components/loaders';

	import Main from '@/layouts/Main.svelte';

	import { structuresAsync as results, providersAsync, providers } from '@/stores/optimade';

	import { content } from '@/stores/data';

	import { getStructureTitle } from '@/helpers/optimade';

	let width,
		page = 1,
		total,
		limit,
		api;

	function getMeta(data, meta) {
		console.log(data, meta);
		total = meta.data_returned || 0;
	}
	// $: (async () => {
	// 	api = await $results.then((r) => r[0][0][0]);
	// })();

	$: $query.params.page = !page ? 0 : page - 1;
	$: $query.params.limit = limit;
	$: $query.params.returned = total;
	$: page = !page ? 1 : page;
	$: console.log(page);

	$: providersOptions = $providers.map((p) => ({ value: p.id, label: p.attributes.name }));

	function setDataContent(structure) {
		$content = JSON.stringify(structure);
		goto('/');
	}
</script>
