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
	const menu = routes
		.reduce<MenuProp[]>((items, { path, menu }, i) => {
			return !!menu && items.push({ path, pos: i + 1, ...menu }), items;
		}, [])
		.sort((a, b) => (a.pos > b.pos ? 1 : -1));
	const current = menu.find((item) => item.path === $path.toString());

	$: active = menu.indexOf(current as MenuProp);
</script>
