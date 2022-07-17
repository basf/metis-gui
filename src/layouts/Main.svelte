<Panel>
	<Tabs slot="nav" items={menu} bind:active block />
	<div slot="body" class="mt-2">
		<slot />
	</div>
</Panel>

<script lang="ts">
	import { getContext } from 'svelte';
	import { path } from 'svelte-pathfinder';
	import { Panel, Tabs } from 'svelte-spectre';
	import type { MenuProp, Route } from '@/types/routes';

	const routes: Route[] = getContext('routes');

	const menu = routes.reduce<MenuProp[]>((items, { path, menu }) => {
		return !!menu && items.push({ path, ...menu }), items;
	}, []);

	$: active = menu.findIndex((item) => item.path === $path.toString());
</script>
