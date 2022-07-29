<Modal {...$$restProps} on:close>
	<h3 slot="header">
		{#if isNew}
			New collection
		{:else}
			Edit collection <mark>{title}</mark>
		{/if}
	</h3>
	<Grid>
		<Col sm="12">
			<FormGroup>
				<Input bind:value={title} placeholder="Input title" />
			</FormGroup>
			<FormGroup>
				<Input rows={4} placeholder="Input description" bind:value={description} />
			</FormGroup>
			<div class="my-2 py-2">
				<Divider align="horizontal center" text="Data in collection" />
			</div>
			<Autocomplete
				predefined={predefinedDataSources}
				bind:selected={selectedDataSources}
				groupBy={({ type }) => type || ''}
				placeholder="Add data"
			/>
		</Col>
		<Col sm="12">
			<div class="mb-2">
				<Panel>
					<label class="form-label" slot="header" for="types">Type</label>
					<div class="p-2" slot="body">
						<Select id="types" options={typesOptions} bind:value={typeId} />
					</div>
				</Panel>
			</div>
			<Panel>
				<label class="form-label" slot="header" for="visibility">Visibility</label>
				<div class="p-2" slot="body">
					<Select id="visibility" options={VISIBILITY} bind:value={visibility} />
					{#if visibility === 'shared'}
						<div class="my-2 py-2">
							<Divider align="horizontal center" text="Shared with" />
						</div>
						<Autocomplete
							predefined={predefinedUsers}
							bind:selected={selectedUsers}
							predictable={true}
							placeholder="Add users"
							bind:value={search}
						/>
					{/if}
				</div>
			</Panel>
		</Col>
	</Grid>
	<svelte:fragment slot="footer">
		{#if !isNew}
			<div class="float-left">
				<IconButton on:click={remove} icon="delete" variant="error" />
			</div>
		{/if}
		<Button on:click={() => dispatch('close')}>Cancel</Button>
		<Button on:click={save} variant="primary">Save</Button>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { createEventDispatcher } from 'svelte';

	import {
		Col,
		Grid,
		Input,
		Panel,
		Modal,
		Select,
		Button,
		Divider,
		FormGroup,
		IconButton,
		Autocomplete,
	} from 'svelte-spectre';

	import type { Item } from 'svelte-spectre/package/components/Autocomplete/utils';

	import { searchUsers, getUsers } from '@/services/api';
	import datasources from '@/stores/datasources';
	import user from '@/stores/user';
	import collections from '@/stores/collections';

	import { VISIBILITY } from '@/types/const';
	import type { User as UserDTO } from '@/types/dto';
</script>

<script lang="ts">
	const dispatch = createEventDispatcher();

	export let id: number;
	export let title = '';
	export let description = '';
	export let visibility = VISIBILITY[0];

	export let userId: number;
	export let userFirstName = '';
	export let userLastName = '';

	export let typeId: number;
	export let typeSlug = '';
	export let typeLabel = '';
	export let typeFlavor = '';

	export let dataSources: number[] = [];
	export let users: number[] = [];

	let search = '';

	$: userDataSources = $user
		? $datasources.data.filter(({ userId }) => userId === $user?.id)
		: [];

	$: predefinedDataSources = userDataSources?.map(({ name, id }) => ({
		index: id,
		label: name,
		value: id,
	}));

	$: selectedDataSources = dataSources
		? predefinedDataSources.filter(({ value }) => dataSources.includes(value))
		: [];

	$: typesOptions = $collections.types.map(({ label, id: value }) => ({ label, value }));
	$: if (!typeId && typesOptions?.length) {
		typeId = typesOptions[0].value;
	}

	$: isNew = !id;

	let selectedUsers: Item[] = [];
	$: (async () => {
		selectedUsers = [];
		if (users) {
			const usersList = await getUsers(users);
			selectedUsers = withoutMe(usersList);
		}
	})();

	let predefinedUsers: Item[] = [];
	$: (async () => {
		predefinedUsers = [];
		if (search) {
			const usersList = await searchUsers(search);
			predefinedUsers = withoutMe(usersList);
		}
	})();

	function save() {
		const dataSources = selectedDataSources.map(({ value }) => value);
		const users = selectedUsers.map(({ value }) => value);
		dispatch('save', { id, title, description, typeId, visibility, dataSources, users });
	}

	function remove() {
		dispatch('remove', { id });
	}

	function withoutMe(users: UserDTO[]) {
		return users.reduce<Item[]>((users, { firstName, lastName, id, email }) => {
			id !== $user?.id &&
				users.push({ index: id, label: `${firstName} ${lastName} (${email})`, value: id });
			return users;
		}, []);
	}
</script>
