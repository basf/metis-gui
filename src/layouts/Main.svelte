<Container offset="mt-2">
	<Panel>
		<nav slot="nav">
			<Tabs {items} active={$url} block />
		</nav>
		<div slot="body" class="mt-2">
			<slot />
		</div>
	</Panel>
</Container>

<script lang="ts">
	import { url, path, query } from 'svelte-pathfinder';
	import { Container, Panel, Tabs } from 'svelte-spectre';
	import { menu } from '@/routes';

	$: items = menu.map((m) => ($path.toString() === m.path ? { ...m, path: $url } : m));
</script>
