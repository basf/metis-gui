<Main>
	<div class="p-2"></div>
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
			<Select bind:value={$query.params.provider} options={providersOptions} let:option size="lg" />
		{/await}
	</InputGroup>
	<div class="p-2"></div>

	<div bind:clientWidth={width}>
		{#await $results}
			<Loaders.Tile count={5} w={width} h={65} height={400} {width} />
		{:then results}
			{#each results as [structures, provider], index}
				{#each structures as structure}
					<Tile>
						<h5 class="mt-2" slot="title">{@html getStructureTitle(structure)}</h5>
						<small slot="subtitle" class="tile-subtitle text-gray"
							>ID &bull; {structure.id}</small
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
						<div class="text-center distant_msg">Nothing found. Try another provider?</div>
					</Tile>
				{/each}
			{/each}
		{/await}
	</div>
</Main>

<script lang="ts">
	import { query, goto } from 'svelte-pathfinder';

	import { Tile, IconButton, Input, InputGroup, Select, Icon } from 'svelte-spectre';

	import * as Loaders from '@/components/loaders';

	import Main from '@/layouts/Main.svelte';

	import { structuresAsync as results, providersAsync, providers } from '@/stores/optimade';

	import { content } from '@/stores/data';

	import { getStructureTitle } from '@/helpers/optimade';

	let width;

	$: providersOptions = $providers.map(p => ({ value: p.id, label: p.attributes.name }));

	function setDataContent(structure) {
		$content = JSON.stringify(structure);
		goto('/');
	}
</script>
