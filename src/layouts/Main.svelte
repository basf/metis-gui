<Container offset="mt-2">
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
	import { Container, Panel, Tabs } from 'svelte-spectre';
	import { menu } from '@/routes';
</script>

<style lang="scss">
	nav {
		overflow-x: auto;
	}
</style>
