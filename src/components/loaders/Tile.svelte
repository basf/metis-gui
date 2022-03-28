<ContentLoader {width} {height} {...$$restProps} {...colors}>
	{#each { length: count } as _, i}
		<rect y={i * (h + y)} rx="2" ry="2" width={w} height={h} />
	{/each}
</ContentLoader>

<script lang="ts" context="module">
	import ContentLoader from 'svelte-content-loader';
	import { darkTheme } from '@/stores/theme';
</script>

<script lang="ts">
	export let width = 100;
	export let height = 100;
	export let count = 1;
	export let w = 220;
	export let h = 220;
	$: y = (height - count * h) / count + count / 2;
	$: colors = $darkTheme
		? { primaryColor: '#303742', secondaryColor: '#252b33' }
		: { primaryColor: '#f9f9f9', secondaryColor: '#ecebeb' };
</script>
