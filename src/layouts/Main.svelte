<Container offset="mt-2">
	{#if $errors.length}
		{#each $errors as error}
			<Toast offset="my-2" toastItem={{ type: 'error', close: true }}>
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
</Container>

<script lang="ts">
	import { path } from 'svelte-pathfinder';
	import { Container, Panel, Tabs, Toast } from 'svelte-spectre';

	import errors from '@/stores/errors';

	import { menu } from '@/routes';
</script>
