<Main>
	<TabSearch add bind:value={search} bind:addOpen data={$datasources} />

	<div bind:clientWidth={width}>
		{#await $datasourcesAsync}
			{#each { length: 4 } as _}
				<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
			{/each}
		{:then datasources}
			{#if addOpen || !datasources}
				{#if !datasources}
					<div class="text-center distant_msg">Upload a structure to start...</div>
				{/if}
				<div class="py-2">
					<DataSourceAdd value={search} />
				</div>
			{/if}
			{#each makeDataList(datasources, search) as datasource (datasource.id)}
				<Data
					{datasource}
					{datasources}
					on:editCalculation={() => editCalculation(datasource)}
					on:editTags={() => editTags(datasource)}
					on:editGraphic={() => editGraphic(datasource)}
					on:setCalculation={() => calculate(datasource.id)}
					on:delDatasource={() =>
						withConfirm(
							delData,
							datasource.id,
							'Are you sure?',
							false
						)?.(datasource.id)}
				/>
			{/each}
		{/await}
	</div>
</Main>

<Modal size="lg" open={!!$fragment} on:close={closeModal}>
	<h3 slot="header">{@html modal.header}</h3>
	{#if modal.component}
		<svelte:component
			this={modal.component}
			source={pointsSource}
			bind:code={editor.template}
			on:change={setInput}
			{datasourceID}
			bind:tags
		/>
	{:else}
		<span style="height: 100%" class="loading loading-lg p-centered d-block" />
	{/if}
	<svelte:fragment slot="footer">
		<Button on:click={closeModal}>Cancel</Button>
		<Button variant="primary" on:click={editor.template ? submitCalculation : submitTags}
			>Submit</Button
		>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { query, fragment } from 'svelte-pathfinder';
	import { Button, Modal, toast } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';
	import { Editor } from '@/components/Editor/';
	import { Graphic } from '@/components/Graphic/';
	import pointsSource from '@/components/Graphic/points';
	import { TabSearch, match } from '@/components/Search';
	import DataSourceAdd from '@/views/DataSource/DataSourceAdd.svelte';
	import { Data } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import { delData, setCalculation, getTemplate, HttpError } from '@/services/api';

	import datasources, { datasourcesAsync } from '@/stores/datasources';
	import { withConfirm } from '@/stores/confirmator';

	import { TagsEdit } from '@/views/modals';
	import { setCollection } from '@/services/api';

	import type { Collection, DataSource } from '@/types/dto';
	import type { SvelteComponent } from 'svelte';
</script>

<script lang="ts">
	let width: number | undefined;
	let search = '';
	let addOpen = false;
	let modal: { open?: boolean; header?: string; component?: typeof SvelteComponent } = {
		open: false,
		header: '',
		component: undefined,
	};
	let editor: {
		schema?: { [key: string]: any };
		template?: string;
		input?: string;
	} = {
		schema: {},
		template: '',
		input: '',
	};
	let datasourceID = 0;
	let tags = [];

	function makeDataList(items: DataSource[], search: string) {
		return search
			? items.filter((item) => match(item, search))
			: items.sort((a, b) => b.id - a.id);
	}

	function calculate(id: number) {
		setCalculation(id);
		toast.success({
			msg: 'Calculation in progress',
			timeout: 2000,
			pos: 'top_right',
			icon: 'forward',
		});
	}

	function closeModal() {
		modal = {};
		editor = {};
		$fragment = '';
	}

	async function editCalculation(datasource: DataSource) {
		const { template, schema } = await getTemplate('dummy');
		datasourceID = datasource.id;
		editor = { template, schema, input: template };
		modal = {
			open: true,
			header: `Edit and submit calculation for <mark> ${datasource.name} </mark>`,
			component: Editor,
		};
		$fragment = `#edit-calculation-${datasource.id}`;
	}

	function setInput(e: CustomEvent) {
		e.preventDefault();
		if (editor) editor.input = e.detail;
	}

	function submitCalculation() {
		if (editor) setCalculation(datasourceID, 'dummy', editor.input).then(() => closeModal());
	}

	function editTags(datasource: DataSource) {
		datasourceID = datasource.id;
		modal = {
			open: true,
			header: `Edit and submit Tags for <mark> ${datasource.name} </mark>`,
			component: TagsEdit,
		};
		$fragment = `#edit-tags-${datasource.id}`;
	}

	function submitTags() {
		tags.forEach(async ({ value }) => {
			const { id, title, description, userId, typeId, visibility, dataSources, users } =
				value;
			await saveCollection({
				id,
				title,
				description,
				userId,
				typeId,
				visibility,
				dataSources,
				users,
			});
		});
		closeModal();
	}

	async function saveCollection(value: Collection) {
		try {
			await setCollection(value);
		} catch (err: unknown) {
			toast.error({ msg: (err as HttpError).message, timeout: 2000, pos: 'top_right' });
		}
	}

	function editGraphic(datasource: DataSource) {
		modal = {
			open: true,
			header: `Edit and submit Graphic for <mark> ${datasource.name} </mark>`,
			component: Graphic,
		};
		$fragment = `#edit-graphic-${datasource.id}`;
	}

	function submitGraphic() {
		closeModal();
	}
</script>
