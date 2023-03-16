<Main>
	<Section asyncData={$collectionsAsync}>
		<svelte:fragment let:item>
			{#if item.typeFlavor === 'red'}
				<Col col="12">
					<Collection
						id="{item.id},"
						title={item.title}
						description={item.description}
						visibility={item.visibility}
						userId={item.userId}
						userFirstName={item.userFirstName}
						userLastName={item.userLastName}
						typeFlavor={item.typeFlavor}
					/>
				</Col>
			{/if}
		</svelte:fragment>
	</Section>
</Main>

<script lang="ts">
	import { Col } from 'svelte-spectre';

	import { Main, Section } from '@/layouts';
	import { collectionsAsync } from '@/stores/collections';
	import { Collection } from '@/views/tiles';
</script>
