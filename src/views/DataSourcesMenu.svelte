{#if $media.sm}
	<Dropdown bind:active align="right">
		<IconButton icon="more-horiz" tooltip="menu" on:click={() => openMenu(datasource.id)} />
		<Menu slot="content" nav>
			<h6 slot="header">Tile menu</h6>
			<li>
				<Button
					href="#_"
					variant="link"
					on:click={() => dispatch('editCalculation', { datasource })}
					><Icon icon="edit" />&nbsp; Edit Calculation</Button
				>
			</li>
			<li>
				<Button
					href="#_"
					variant="link"
					on:click={() => dispatch('editTags', { datasource })}
					><Icon icon="tag" />&nbsp; Edit Tags</Button
				>
			</li>
			<li>
				<Button
					href="#_"
					variant="link"
					on:click={() => dispatch('editGraphic', { datasource })}
					><Icon>{@html Sinus}</Icon>&nbsp; Edit Graphic</Button
				>
			</li>
			<li>
				<Button
					href="#_"
					variant="link"
					on:click={() => dispatch('setCalculation', { datasource })}
					><Icon color="success" icon="forward" /><span class="text-success"
						>&nbsp; Calculate</span
					></Button
				>
			</li>
			<li>
				<Button
					href="#_"
					variant="link"
					on:click={() => dispatch('delCalculation', { datasource })}
					><Icon color="error" icon="cross" /><span class="text-error">&nbsp; Delete</span
					></Button
				>
			</li>
		</Menu>
	</Dropdown>
{:else}
	<IconButton
		icon="edit"
		tooltip="calculation"
		on:click={() => dispatch('editCalculation', { datasource })}
	/>
	<IconButton icon="tag" tooltip="tags" on:click={() => dispatch('editTags', { datasource })} />
	<IconButton tooltip="graphic" on:click={() => dispatch('editGraphic', { datasource })}>
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
	import { Button, Dropdown, Icon, IconButton, Menu } from 'svelte-spectre';
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
