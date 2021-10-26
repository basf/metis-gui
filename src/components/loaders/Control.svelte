<svelte:options namespace="svg" />

<ContentLoader {...$$props} {height}>
	<rect x="0" y="0" rx="5" ry="5" width="100%" {height} />
</ContentLoader>

<script>
	import ContentLoader from 'svelte-content-loader';
	export let height;
</script>
