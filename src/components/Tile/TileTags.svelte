{#if $media.sm}
	<Dropdown bind:active>
		<Button variant="link" tooltip="tags" on:click={() => openTags(datasourceId)}>Tags</Button>
		<ul class="tags" slot="content">
			{#each getCollectionsList(datasourceId, $filters.data) as tag (tag.id)}
				<li>
					<a href={setTagLink(tag.id)}>
						<Badge style={autoColor(tag.typeFlavor)}>
							{tag.title}
						</Badge>
					</a>
				</li>
			{/each}
		</ul>
	</Dropdown>
{:else}
	<ul class="tags">
		{#each getCollectionsList(datasourceId, $filters.data) as tag (tag.id)}
			<li>
				<a href={setTagLink(tag.id)}>
					<Badge style={autoColor(tag.typeFlavor)}>
						{tag.title}
					</Badge>
				</a>
			</li>
		{/each}
	</ul>
{/if}

<script lang="ts" context="module">
	import { query, path } from 'svelte-pathfinder';
	import { Badge, Button, Dropdown } from 'svelte-spectre';

	import { autoColor } from '@/helpers/style';
	import { filters } from '@/stores/filters';
	import { media } from '@/stores/media';

	import type { Collection } from '@/types/dto';
</script>

<script lang="ts">
	export let datasourceId = 0;

	let active = false,
		activeId = datasourceId;

	function openTags(id: number) {
		active = activeId === id;
	}

	function getCollectionsList(datasourceId: number, data: Collection[]) {
		return data.filter((filter) => filter.dataSources?.includes(datasourceId));
	}

	function setTagLink(id: number) {
		const iDs = `${$query.params.collectionIds}`
			.split(',')
			.map((c) => +c)
			.filter(Boolean);

		const collectionIds = new Set([...iDs, id]);

		return (
			$path +
			`?page=1&limit=${$query.params.limit}&type=&visibility=&collectionIds=${Array.from(
				collectionIds
			)}`
		);
	}
</script>

<style lang="scss">
	ul.tags {
		list-style: none;
		margin: 0;
		padding: 0;
		display: inline-flex;
		// flex-flow: row wrap;
		gap: 0.25em;
		padding-right: 0.5em;
		li {
			margin: 0;
			padding: 0;
		}
	}
</style>
