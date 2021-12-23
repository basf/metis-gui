<Panel>
	<nav slot="nav">
		<Tabs items={menu} active={$path.toString() === '/' ? 1 : $url} block />
	</nav>
	<div slot="body" class="mt-2">
		<slot />
	</div>
</Panel>

<script lang="ts">
	import { url, path } from 'svelte-pathfinder';
	import { Panel, Tabs } from 'svelte-spectre';
	import { menu } from '@/routes';

	// $: active = $path.toString() === '/' ? 1 : $url;

	$: console.log(items, $url, $path, items[1].path);
	let items = menu.map((m) => ($path.toString() === m.path ? { ...m, path: $url } : m));
</script>
