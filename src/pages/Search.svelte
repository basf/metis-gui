<Main>
	<InputGroup>
		<Input
			bind:value={$query.params.q}
			placeholder="start typing..."
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
			<Select bind:value={selectedProviderIndex} options={providers} let:option size="lg">
				{option.attributes.name}
			</Select>
		{/await}
	</InputGroup>
	<div bind:clientWidth={width}>
		{#await $results}
			<Loaders.Tile count={5} w={width} h={68} height={350} {width} />
		{:then results}
			{#each results as [structures, provider], index}
				{#each structures as structure}
					<Tile>
						<h5 class="mt-2" slot="title">{@html getStructureTitle(structure)}</h5>
						<small slot="subtitle" class="tile-subtitle text-gray"
							>ID · {structure.id} · Last modified · {structure.attributes
								.last_modified}</small
						>
						<svelte:fragment slot="action">
							<IconButton
								icon="upload"
								title="Upload this JSON to calculation"
								on:click={() => setDataContent(structure)}
							/>
						</svelte:fragment>
					</Tile>
				{/each}
			{/each}
		{/await}
	</div>
</Main>

<script lang="ts">
	import { query, goto } from 'svelte-pathfinder';

	import { Tile, IconButton, Input, InputGroup, Select, Icon, Grid, Col } from 'svelte-spectre';

	import * as Loaders from '@/components/loaders';

	import Main from '@/layouts/Main.svelte';

	import { structuresAsync as results, providersAsync, providers } from '@/stores/optimade';

	import { content } from '@/stores/data';

	import { getStructureTitle } from '@/helpers/optimade';

	let width;
	let selectedProviderIndex = 0;

	$: $query.params.provider = $providers[selectedProviderIndex]?.id;

	function setDataContent(structure) {
		$content = JSON.stringify(structure);
		goto('/');
	}
</script>
