<Main>
	<Nodes asyncData={$collectionsAsync}>
		<div slot="filter">
			<!-- empty -->
		</div>
		<svelte:fragment let:item>
			{#if item.typeSlug === 'requests' && item.userId === SERVICE_UID}
				<Col col="12">
					<Collection
						id={item.id}
						title={item.title}
						description={item.description}
						visibility={item.visibility}
						userId={item.userId}
						userFirstName={item.userFirstName}
						userLastName={item.userLastName}
						typeLabel={item.typeLabel}
						typeFlavor={item.typeFlavor}
					>
						<IconButton
							slot="action"
							icon="download"
							variant="link"
							size="xxl"
							tooltip="Download and process data"
							on:click={() => processCollection(item.id)}
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

	import { claimCollection } from '@/services/api';

	import { Main, Nodes } from '@/layouts';
	import { collectionsAsync } from '@/stores/collections';
	import { Collection } from '@/views/tiles';

	import { SERVICE_UID, PAGE_LIMIT } from '@/config';

	function processCollection(id: number) {
		claimCollection(id);
		goto('/?collectionIds=' + id + '&limit=' + PAGE_LIMIT + '&visibility=&type=');
	}
</script>
