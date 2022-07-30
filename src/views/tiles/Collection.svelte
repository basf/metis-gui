<div class="tile-collection">
	<Tile>
		<svelte:fragment slot="icon">
			<div class="tooltip" data-tooltip={userDisplayName}>
				<Avatar size="lg" name={userDisplayName} badge={`${id}`}>
					<svelte:fragment slot="sub">
						{#if !owner && $user}
							<Avatar size="sm" name="{$user.firstName} {$user.lastName}" />
						{/if}
					</svelte:fragment>
				</Avatar>
			</div>
		</svelte:fragment>
		<h5 class="mt-2" slot="title">
			{title}
			<Badge style="background: {typeFlavor}">{visibility}</Badge>
		</h5>
		<small slot="subtitle" class="text-gray">
			{description}
		</small>
		<svelte:fragment slot="action">
			{#if owner}
				<IconButton
					icon="edit"
					size="sm"
					variant="primary"
					title="Edit collection"
					on:click={() => dispatch('edit', { id })}
				/>
			{/if}
		</svelte:fragment>
	</Tile>
</div>

<script lang="ts" context="module">
	import { createEventDispatcher } from 'svelte';
	import { IconButton, Tile, Avatar, Badge } from 'svelte-spectre';
	import user from '@/stores/user';
</script>

<script lang="ts">
	import { userAsync } from '@/stores/user';

	const dispatch = createEventDispatcher();

	export let id: number;
	export let title: string;
	export let description: string;
	export let visibility: string;
	export let userId: number;
	export let userFirstName = '';
	export let userLastName = '';
	export let typeFlavor = '';

	$: userDisplayName = `${userFirstName} ${userLastName}`;
	$: owner = $user && $user.id === userId;

	let visibilityColor;
	$: switch (visibility) {
		case 'public':
			visibilityColor = 'success';
			break;
		case 'community':
			visibilityColor = 'warning';
			break;
		default:
			visibilityColor = 'error';
	}
</script>

<style lang="scss">
	.tile-collection {
		&:hover {
			:global(.tile .tile-action) {
				visibility: visible;
			}
		}
		:global(.tile) {
			:global(.tile-title h5) {
				overflow: hidden;
				text-overflow: ellipsis;
				letter-spacing: -0.025rem;
			}
			:global(.tile-action) {
				position: absolute;
				right: -0.05rem;
				bottom: -0.05rem;
				visibility: hidden;
			}
		}
	}
	:global(.tile) {
		position: relative;
		transition-duration: 150ms;
		transition-property: box-shadow, background-color;
		border-radius: 0.1rem;
		padding-left: 0.5em;
		&:hover {
			box-shadow: 0 0 0 0.05rem $primary-color;
			background-color: $secondary-color;

			@media (prefers-color-scheme: dark) {
				background-color: $dark-secondary;
			}
		}
	}
	:global([color-scheme='dark']) {
		:global(.tile:hover) {
			background-color: $dark-secondary;
		}
	}
	:global([color-scheme='light']) {
		:global(.tile:hover) {
			background-color: $secondary-color;
		}
	}
</style>
