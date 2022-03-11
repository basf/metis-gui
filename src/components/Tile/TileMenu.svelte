{#if $media.sm}
	<Dropdown bind:active>
		<IconButton icon="more-horiz" tooltip="menu" on:click={() => openMenu(dataId)} />
		<Menu slot="content" nav>
			<h6 slot="header">{header}</h6>
			{#each items as item, i (item)}
				<li>
					<Button
						href={item.href || ''}
						variant="link"
						on:click={() => dispatch(item.event.name, item.event.detail)}
					>
						<Icon icon={item.icon} color={item.color}>
							{#if item.icon.includes('<svg')}
								{@html item.icon}
							{/if}
						</Icon>
						{#if item.color}
							<span class="text-{item.color}">&nbsp; {item.label}</span>
						{:else}&nbsp; {item.label}
						{/if}
					</Button>
				</li>
			{/each}
		</Menu>
	</Dropdown>
{:else}
	{#each items as item, i (item)}
		<IconButton
			icon={item.icon}
			tooltip={item.label}
			color={item.color}
			on:click={() => dispatch(item.event.name, item.event.detail)}
			>{#if item.icon.includes('<svg')}
				{@html item.icon}
			{/if}
		</IconButton>
	{/each}
{/if}

<svelte:window bind:innerWidth={wW} bind:innerHeight={wH} />

<script lang="ts" context="module">
	import { Button, Dropdown, Icon, IconButton, Menu } from 'svelte-spectre';
	import { media } from '@/stores/media';

	interface Item {
		href?: string;
		icon?: string;
		color?: string;
		label: string;
		event: { name: string; detail?: any };
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let data: any[] = [],
		dataId: number,
		header = 'Tile menu',
		items: Item[] = [];

	let active: boolean,
		wW = 0,
		wH = 0;

	function openMenu(id: number) {
		active = data.some((d) => d.id === id);
	}
</script>
