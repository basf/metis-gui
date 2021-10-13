<ContentLoader {width} {height} {...$$restProps}>
	{#each { length: count } as _, i}
		<rect y={i * (h + y)} rx="8" ry="8" width={w} height={h} />
	{/each}
</ContentLoader>

<script lang="ts" context="module">
	import ContentLoader from 'svelte-content-loader';
</script>

<script lang="ts">
	export let width = 100;
	export let height = 100;
	export let count = 1;
	export let w = 220;
	export let h = 220;
	$: y = (height - count * h) / count + count / 2;
</script>
