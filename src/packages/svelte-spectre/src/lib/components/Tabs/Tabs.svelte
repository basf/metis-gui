<ul class="tab" class:tab-block={block}>
	{#each items as item, i (item.pos)}
		<li class:active={item.path === active} class="tab-item">
			<a class:badge={item.badge} data-badge={item.badge} href={item.path}>
				{#if item.icon}<Icon icon={item.icon} />{/if}
				{#if item.title}{item.title}{/if}
				{#if item.clear}<Button variant="clear" />{/if}
			</a>
		</li>
	{/each}
</ul>

<script lang="ts">
	import { Icon } from '../Icon/';
	import { Button } from '../Button/';
	// type Item = typeof items[number]; // dynamicly get type from array (exp)

	// don't sure about place it here - need sync with received obj
	type ItemProp = {
		title: string;
		path?: string;
		pos?: number;
		icon?: string;
		badge?: string;
		clear?: boolean;
	};

	export let items: ItemProp[] = [];
	export let active: string = '';
	export let block: boolean = false;
</script>

<style lang="scss">
	@import 'spectre.css/src/tabs';

	.tab-item :global(.icon) {
		margin-top: -0.35rem;
		margin-right: 0.35rem;
	}
	.tab-item :global(.btn-clear) {
		margin-top: -0.2rem;
	}
</style>
