<Main>
	<Nodes asyncData={$collectionsAsync}>
		<div slot="filter">
			<!-- empty -->
		</div>
		<svelte:fragment let:item>
			{#if item.typeSlug === 'phases'}
				<Col col="12">
					<Collection
						id={item.id}
						title={item.title}
						description={item.description}
						visibility={item.visibility}
						userId={item.userId}
						userFirstName={item.userFirstName}
						userLastName={item.userLastName}
						typeSlug={item.typeSlug}
						typeLabel={item.typeLabel}
						typeFlavor={item.typeFlavor}
					>
						<IconButton
							slot="action"
							icon="forward"
							variant="link"
							size="xxl"
							on:click={() => goto('/?collectionIds=' + item.id + '&limit=' + PAGE_LIMIT + '&visibility=&type=')}
						/>
					</Collection>
				</Col>
			{/if}
		</svelte:fragment>
	</Nodes>
</Main>

<script lang="ts">
	import { Col, IconButton } from 'svelte-spectre';
	import { goto } from 'svelte-pathfinder';

	import { Main, Nodes } from '@/layouts';
	import { collectionsAsync } from '@/stores/collections';
	import { Collection } from '@/views/tiles';

	import { PAGE_LIMIT } from '@/config';
</script>
