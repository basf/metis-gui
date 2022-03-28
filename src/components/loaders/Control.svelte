<svelte:options namespace="svg" />

<ContentLoader {...$$restProps} {height} {...colors}>
	<rect x="0" y="0" rx="5" ry="5" width="100%" {height} />
</ContentLoader>

<script lang="ts" context="module">
	import ContentLoader from 'svelte-content-loader';
	import { darkTheme } from '@/stores/theme';
</script>

<script lang="ts">
	export let height;
	$: colors = $darkTheme
		? { primaryColor: '#303742', secondaryColor: '#252b33' }
		: { primaryColor: '#f9f9f9', secondaryColor: '#ecebeb' };
</script>
