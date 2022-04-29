<Autocomplete {predefined} bind:selected />

<script lang="ts" context="module">
	import { Autocomplete } from 'svelte-spectre';
	import collections from '@/stores/collections';
	import user from '@/stores/user';

	import type { Collection } from '@/types/dto';

	type Tag = {
		index: number;
		label: string;
		group: string;
		style: string;
		value: Collection;
	};
</script>

<script lang="ts">
	export let dataSourceId: number,
		tags: Collection[] = [];

	let predefined: Tag[] = [],
		selected: Tag[] = [];

	$: predefined = $collections
		.filter(
			(collection: Collection) =>
				collection.userId === $user?.id &&
				['public', 'community'].includes(collection.visibility)
		)
		.map((collection: Collection) => ({
			index: collection.id,
			label: collection.title,
			group: collection.visibility,
			style: `background: ${collection.typeColor} !important`,
			value: collection,
		}));

	$: selected = predefined.filter(({ value: { dataSources } }) =>
		dataSources?.includes(dataSourceId)
	);

	$: tags = predefined.reduce((acc: Collection[] = [], tag: Tag) => {
		tag.value.dataSources = selected.some((s) => s.index === tag.index)
			? !tag.value.dataSources?.includes(dataSourceId)
				? [...(tag.value.dataSources as number[]), dataSourceId]
				: tag.value.dataSources
			: tag.value.dataSources?.filter((id) => id !== dataSourceId);
		const { id, title, description, userId, typeId, visibility, dataSources, users } =
			tag.value;
		acc.push({ id, title, description, userId, typeId, visibility, dataSources, users });
		return acc;
	}, []);
</script>

<style lang="scss">
	:global(.form-autocomplete .menu) {
		position: relative !important;
	}
</style>
