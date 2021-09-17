<ul class="tab" class:tab-block={block}>
	{#if items}
		{#each items as item, i (item.pos)}
			<li class:active={item.path === active} class="tab-item">
				<a class:badge={item.badge} data-badge={item.badge} href={item.path}>
					{#if item.icon}<i class="icon icon-{item.icon}" />{/if}
					{item.title}
					{#if item.clear}<span class="btn btn-clear" />{/if}
				</a>
			</li>
		{/each}
	{/if}
</ul>

<script lang="ts">
	// import { Icon } from '../Icon/'; // trouble with positioning
	// import { IconButton } from '../Button/'; // same trouble
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
	@import 'spectre.css/src/badges';
	@import 'spectre.css/src/buttons';
	@import 'spectre.css/src/icons';
	.tab-item .icon {
		margin-top: -0.35rem;
		margin-right: 0.35rem;
	}
</style>
