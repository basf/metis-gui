{#if $media.sm}
	<Dropdown bind:active>
		<IconButton icon="more-horiz" tooltip="menu" on:click={() => openMenu(dataId)} />
		<Menu slot="content" nav>
			<h6 slot="header">{header}</h6>
			{#each items as item, i (item)}
				<li>
					<Button href={item.href || ''} variant="link" on:click={() => onClick(item)}>
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
			href={item.href || ''}
			on:click={() => onClick(item)}
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

	export interface Item {
		href?: string;
		icon?: string;
		color?: string;
		label: string;
		query?: string;
		action: (id: number, query?: string) => void;
	}
</script>

<script lang="ts">
	export let dataId: number,
		header = 'Tile menu',
		items: (Item | null)[] = [];

	let active: boolean,
		wW = 0,
		wH = 0,
		activeId = dataId;

	function openMenu(id: number) {
		active = activeId === id;
	}

	function onClick(item: Item) {
		item.action ? item.action(dataId, item.query) : null;
	}
</script>
