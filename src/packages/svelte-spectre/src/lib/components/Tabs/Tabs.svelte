<ul class="tab" class:tab-block={block}>
	{#if items}
		{#each items as item, i}
			<li class:active={item.path} class="tab-item">
				<a href={item.path}>{item.title}</a>
			</li>
		{/each}
	{/if}
</ul>

<script lang="ts">
	// type Item = typeof items[number]; // dynamicly get type from array

	export let items: { path: string; title: string }[] = [];
	export let active: boolean = false;
	export let block: boolean = true;
</script>

<style lang="scss">
	@import 'spectre.css/src/tabs';
</style>
