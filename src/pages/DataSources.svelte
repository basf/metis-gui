<Main>
	<TabSearch add bind:value={search} bind:addOpen data={$datasources} />

	{#if addOpen}
		{#if !$datasources.length}
			<div class="text-center distant_msg">Upload a structure to start...</div>
		{/if}
		<div class="py-2">
			<DataSourceAdd
				{contents}
				bind:clearFiles
				bind:value={content}
				on:files={handleFiles}
				on:click={addDataItem}
			/>
		</div>
	{/if}

	{#each makeDataList($datasources, search) as datasource (datasource.id)}
		<Tile centered={false}>
			<svelte:fragment slot="title">
				<h5 class="mt-2">{@html datasource.name}</h5>
				<ul class="collections">
					{#each getCollectionsList(datasource.id) as collection (collection.id)}
					{@const href = $user?.id === collection.userId ? `/collections#${collection.id}` : undefined}
					<li>
						<a {href}>
							<Badge style="background: {collection.typeColor}">{collection.title.substring(0, 10)}</Badge>
						</a>
					</li>
				{/each}
				</ul>
			</svelte:fragment>
			<svelte:fragment slot="subtitle">
				<small class="text-gray">
					Type &bull; {datasource.type} &bull; {showTimestamp(datasource)}
				</small>
			</svelte:fragment>
			<svelte:fragment slot="action">
				{#if $user.id === datasource.userId}
				<TileMenu
					data={$datasources}
					items={tileMenuItems}
					dataId={datasource.id}
					on:editCalculation={(e) => editCalculation(datasource, e)}
					on:editTags={(e) => editTags(datasource, e)}
					on:editGraphic={(e) => editGraphic(datasource, e)}
					on:setCalculation={() => calculate(datasource.id)}
					on:delDatasource={() =>
						withConfirm(
							delData,
							datasource.id,
							'Are you sure?',
							false
						)?.(datasource.id)}
				/>
				{/if}
			</svelte:fragment>
		</Tile>
		<!-- {:else}
		<div class="text-center distant_msg">Upload a structure to start...</div> -->
	{/each}
</Main>

<Modal bind:open={modal.open} size="fs">
	<h3 slot="header">{@html modal.header}</h3>
	{#if modalComponent}
		<svelte:component
			this={modalComponent}
			source={pointsSource}
			bind:code={editor.template}
			on:change={setInput}
		/>
	{:else}
		<span style="height: 100%" class="loading loading-lg p-centered d-block" />
	{/if}
	<svelte:fragment slot="footer">
		<Button on:click={() => (modal = {})}>Cancel</Button>
		<Button variant="primary" on:click={editor.template ? submitCalculation : submitTags}
			>Submit</Button
		>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { Button, Modal, Tile, Badge, toast } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';
	import { Editor } from '@/components/Editor/';
	import { Graphic } from '@/components/Graphic/';
	import pointsSource from '@/components/Graphic/points';
	import { TileMenu } from '@/components/Tile/';
	import { TabSearch, match } from '@/components/Search/';

	import { getData, setData, delData, setCalculation, getTemplate, getCollections } from '@/services/api';

	import { collections } from '@/stores/collections';
	import datasources from '@/stores/datasources';
	import user from '@/stores/user';
	import { withConfirm } from '@/stores/confirmator';
	import { showTimestamp } from '@/helpers/date';

	import DataSourceAdd from '@/views/DataSource/DataSourceAdd.svelte';
	import type { DataSource } from '@/types/dto';

	import Sinus from '@/assets/img/sinus.svg';
</script>

<script lang="ts">
	let content = '';
	let contents: string[] = [];
	let clearFiles: () => void;
	let points = [];
	let search = '';
	let addOpen = false;
	$: addOpen = !$datasources.length;
	let tileMenuItems = [
		{
			icon: 'edit',
			label: 'Edit Calculation',
			event: { name: 'editCalculation' },
		},
		{ icon: 'tag', label: 'Edit Tags', event: { name: 'editTags' } },
		{
			icon: Sinus,
			label: 'Edit Graphic',
			event: { name: 'editGraphic' },
		},
		{
			icon: 'forward',
			color: 'success',
			label: 'Calculate',
			event: { name: 'setCalculation' },
		},
		{
			icon: 'cross',
			color: 'error',
			label: 'Delete',
			event: { name: 'delDatasource' },
		},
	];
	let modal: { open?: boolean; header?: string } = { open: false, header: '' };
	let editor: {
		schema: { [key: string]: any };
		template: string;
		input: string;
	} = {
		schema: {},
		template: '',
		input: '',
	};
	let datasourceID = 0;

	$: $user && getCollections();
	$: $user && getData();
	$: $datasources.length &&
		toast.primary({ msg: 'Structures synced', timeout: 2000, pos: 'top_right' });
	$: modalComponent = editor.template ? Editor : points.length ? Graphic : undefined;

	$: getCollectionsList = dataSourceId => $collections.filter(({ dataSources }) => dataSources && dataSources.includes(dataSourceId));

	function makeDataList(items: DataSource[], search: string) {
		return search
			? items.filter((item) => match(item, search))
			: items.sort((a, b) => b.id - a.id);
	}

	function addDataItem() {
		setData(contents.length ? contents : content);
		content = '';
		clearFiles();
	}

	async function handleFiles(e: any) {
		const { files } = e.detail;

		if (files.length) {
			for (const file of files) {
				const content = await file.text();
				contents.push(content);
			}
			contents = [...contents];
		} else {
			contents = [];
		}
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

	async function editCalculation(datasource: DataSource) {
		points = [];
		modal = {
			open: true,
			header: `Edit and submit calculation for <mark> ${datasource.name} </mark>`,
		};

		getTemplate('dummy').then(({ template, schema }) => {
			datasourceID = datasource.id;
			editor = { template, schema, input: template };
		});
	}

	function setInput(e: CustomEvent) {
		e.preventDefault();
		if (editor) editor.input = e.detail;
	}

	function submitCalculation() {
		if (editor) setCalculation(datasourceID, 'dummy', editor.input).then(() => (modal = {}));
	}

	function editTags(datasource: DataSource, e: Event) {
		editor = {};
		points = [];
		modal = {
			open: true,
			header: `Edit and submit Tags for <mark> ${datasource.name} </mark>`,
		};
	}

	function submitTags() {
		modal = {};
	}

	function editGraphic(datasource: DataSource, e: Event) {
		editor = {};
		points = pointsSource;
		modal = {
			open: true,
			header: `Edit and submit Graphic for <mark> ${datasource.name} </mark>`,
		};
	}

	function submitGraphic() {
		modal = {};
	}
</script>

<style lang="scss">
	:global(.spectre .tile) {
		padding: 0.75em;
		margin: 0.5em 0;
		:global(.tile-action) {
			display: flex;
		}
	}
	h5 {
		display: inline;
	}
	.collections {
		list-style: none;
		margin: 0;
		padding: 0;
		display: inline-flex;
		flex-flow: row wrap;
		gap: 0.25em;
		float: right;
		li {
			margin: 0;
			padding: 0;
		}
	}
</style>
