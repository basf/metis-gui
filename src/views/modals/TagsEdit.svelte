<Autocomplete {predefined} bind:selected />

<script lang="ts" context="module">
	import { Autocomplete } from 'svelte-spectre';
	import { collections } from '@/stores/collections';
	import user from '@/stores/user';

	import type { Collection } from '@/types/dto';
	import { getCollections } from '@/services/api';
	import { onMount } from 'svelte';

	type Tag = {
		index: number;
		label: string;
		group: string;
		style: string;
		value?: number[];
	};
</script>

<script lang="ts">
	export let dataSourceId: number,
		tags: number[] = [];

	let predefined: Tag[] = [],
		selected: Tag[] = [];

	onMount(getCollections);

	$: predefined = $collections?.data
		?.filter((collection: Collection) => collection.userId === $user?.id)
		.map((collection: Collection) => ({
			index: collection.id,
			label: collection.title,
			group: collection.visibility,
			style: `background: ${collection.typeFlavor} !important`,
			value: collection.dataSources,
		}));

	$: selected = predefined?.filter(({ value }) => value?.includes(dataSourceId));

	$: tags = selected?.map((s) => s.index);
</script>
