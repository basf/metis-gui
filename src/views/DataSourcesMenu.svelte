{#if $media.sm}
	<Dropdown bind:active align="right">
		<IconButton icon="more-horiz" tooltip="menu" on:click={() => openMenu(datasource.id)} />
		<Menu slot="content" nav>
			<h6 slot="header">Tile menu</h6>
			<li>
				<a
					href="#"
					on:click={() => dispatch('editCalculation', { datasource })}
					class="text-gray"><Icon icon="edit" />&nbsp; Edit Calculation</a
				>
			</li>
			<li>
				<a
					href="#"
					on:click|preventDefault={() => dispatch('editTags', { datasource })}
					class="text-primary"><Icon icon="tag" />&nbsp; Edit Tags</a
				>
			</li>
			<li>
				<a
					href="#"
					on:click|preventDefault={() => dispatch('editGraphic', { datasource })}
					class="text-warning"><Icon>{@html Sinus}</Icon>&nbsp; Edit Graphic</a
				>
			</li>
			<li>
				<a
					href="#"
					on:click|preventDefault={() => dispatch('setCalculation', { datasource })}
					class="text-success"><Icon icon="forward" />&nbsp; Calculate</a
				>
			</li>
			<li>
				<a
					href="#"
					on:click|preventDefault={() => dispatch('delCalculation', { datasource })}
					class="text-error"><Icon icon="cross" />&nbsp; Delete</a
				>
			</li>
		</Menu>
	</Dropdown>
{:else}
	<IconButton
		icon="edit"
		color="gray"
		tooltip="edit"
		on:click={() => dispatch('editCalculation', { datasource })}
	/>
	<IconButton
		icon="tag"
		color="primary"
		tooltip="tags"
		on:click={() => dispatch('editTags', { datasource })}
	/>
	<IconButton
		color="warning"
		tooltip="graphic"
		on:click={() => dispatch('editGraphic', { datasource })}
	>
		{@html Sinus}
	</IconButton>
	<IconButton
		icon="forward"
		color="success"
		tooltip="calculate"
		on:click={() => dispatch('setCalculation', { datasource })}
	/>
	<IconButton
		icon="cross"
		color="error"
		tooltip="delete"
		on:click={() => dispatch('delCalculation', { datasource })}
	/>
{/if}

<script lang="ts" context="module">
	import { Dropdown, Icon, IconButton, Menu } from 'svelte-spectre';
	import Sinus from '@/assets/img/sinus.svg';
	import { media } from '@/stores/media';

	import type { DataSource } from '@/types/dto';
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let active = false,
		datasource: DataSource,
		data: DataSource[] = [];

	function openMenu(id: number) {
		data = data.map((d) => ({ ...d, menu: d.id === id ? true : false }));
	}
</script>

<style lang="scss">
	// fix from svelte-spectre
	:global(.spectre .icon-tag) {
		display: inline-block;
	}
</style>
