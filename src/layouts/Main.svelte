<Panel>
	<nav slot="nav">
		<Tabs items={menu} bind:active block />
	</nav>
	<div slot="body" class="mt-2">
		<slot />
	</div>
</Panel>

<script lang="ts">
	import { path } from 'svelte-pathfinder';
	import { Panel, Tabs } from 'svelte-spectre';
	import { menu } from '@/routes';

	$: active = $path.toString() === '/' ? 1 : $path.toString();
</script>
