<Main>
	<Nodes asyncData={$calculationsAsync} addTooltip="Add calculation" addAction={null}>
		<div slot="filter">
			<!-- empty -->
		</div>
		<svelte:fragment let:item>
			<Col col="12">
				<Calculation calculation={item} />
			</Col>
		</svelte:fragment>
	</Nodes>
</Main>

<script lang="ts" context="module">
	import { Col } from 'svelte-spectre';

	import { Main, Nodes } from '@/layouts/';
	import { Calculation } from '@/views/tiles';

	import { calculationsAsync } from '@/stores/calculations';
</script>
