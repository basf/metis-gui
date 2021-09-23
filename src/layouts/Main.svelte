<Container offset="mt-2">
	<!-- <Col col="12" mx="auto" class="mt-2"> -->
	{#if $errors.length}
		{#each $errors as error}
			<Toast type="error">
				{error.message || error}
			</Toast>
		{/each}
	{/if}
	<Panel>
		<nav slot="nav">
			<Tabs items={menu} active={$path.toString()} block />
		</nav>
		<div slot="body" class="mt-2">
			<slot />
		</div>
	</Panel>
	<!-- </Col> -->
</Container>

<script>
	import { path } from 'svelte-pathfinder';
	import { Col, Container, Panel, Tabs, Toast } from 'svelte-spectre';

	import errors from '@/stores/errors';

	import { menu } from '@/routes';
</script>
