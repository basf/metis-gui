<Autocomplete {predefined} bind:selected />

<script lang="ts" context="module">
	import { Autocomplete } from 'svelte-spectre';
	import collections from '@/stores/collections';
	import user from '@/stores/user';
</script>

<script lang="ts">
	let predefined,
		selected = [];

	export let datasourceID,
		tags = [];

	$: predefined = $collections
		.filter(
			(collection) =>
				collection.userId === $user.id &&
				['public', 'community'].includes(collection.visibility)
		)
		.map((collection) => ({
			index: collection.id,
			label: collection.title,
			value: collection,
			group: collection.visibility,
			style: `background: ${collection.typeColor} !important`,
		}));

	$: selected = predefined.filter(({ value: { dataSources } }) =>
		dataSources.includes(datasourceID)
	);

	$: tags = predefined.reduce((acc = [], tag) => {
		tag.value.dataSources = selected.some((t) => t.index === tag.index)
			? !tag.value.dataSources.includes(datasourceID)
				? [...tag.value.dataSources, datasourceID]
				: tag.value.dataSources
			: tag.value.dataSources.filter((id) => id !== datasourceID);
		acc.push(tag);
		return acc;
	}, []);
</script>

<style lang="scss">
	:global(.form-autocomplete .menu) {
		position: relative !important;
	}
</style>
