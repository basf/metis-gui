<Panel>
	<Tabs slot="nav" items={menu} active={findActive()} block />
	<div slot="body" class="mt-2">
		<slot />
	</div>
</Panel>

<script lang="ts">
	import { getContext } from 'svelte';
	import { pattern, query } from 'svelte-pathfinder';
	import { Panel, Tabs } from 'svelte-spectre';
	import type { MenuProp, Route } from '@/types/routes';

	const routes: Route[] = getContext('routes');

	$: menu = routes.reduce<MenuProp[]>((items, { path, menu }) => {
		path = $pattern(path) ? `${path + $query}` : path;
		return !!menu && items.push({ path, ...menu }), items;
	}, []);

	function findActive() {
		return menu.findIndex((item) => {
			const path = item.path?.match(/^[^?]*/);
			return $pattern(path?.toString());
		});
	}
</script>
