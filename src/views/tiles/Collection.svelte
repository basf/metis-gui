<div class="tile-collection">
	<Tile>
		<svelte:fragment slot="icon">
			<div class="tooltip" data-tooltip="{typeLabel}: {title} by {userDisplayName}">
				<a href="/?collectionIds={id}&limit={PAGE_LIMIT}&visibility=&type=">
					<Avatar size="lg" name={userDisplayName} bg="{typeFlavor}">
						<svelte:fragment slot="sub">
							{#if !owner && $user}
								<Avatar size="sm" name="{$user.firstName} {$user.lastName}" />
							{/if}
						</svelte:fragment>
					</Avatar>
				</a>
			</div>
		</svelte:fragment>
		<h5 class="mt-2" slot="title">
			{#if typeSlug == 'phases'}
				{@html addSubTags(title)}
			{:else}
				{title}
			{/if}
		</h5>
		<Badge style={autoColor(typeFlavor)}>{visibility}</Badge>
		<svelte:fragment slot="action">
			<slot name="action">
				{#if owner}
					<IconButton
						icon="edit"
						size="sm"
						variant="primary"
						title="Edit collection"
						on:click={() => dispatch('edit', { id })}
					/>
				{:else}
					<IconButton
						icon="edit"
						size="sm"
						variant="error"
						title="Editing disabled"
					/>
				{/if}
			</slot>
		</svelte:fragment>
	</Tile>
</div>

<script lang="ts" context="module">
	import { createEventDispatcher } from 'svelte';
	import { IconButton, Tile, Avatar, Badge } from 'svelte-spectre';

	import user from '@/stores/user';
	import { addSubTags } from '@/helpers/optimade';
	import { autoColor } from '@/helpers/style';

	import { PAGE_LIMIT } from '@/config';
</script>

<script lang="ts">
	const dispatch = createEventDispatcher();

	export let id: number;
	export let title: string;
	export let description: string;
	export let visibility: string;
	export let userId: number;
	export let userFirstName = '';
	export let userLastName = '';
	export let typeSlug = '';
	export let typeLabel = '';
	export let typeFlavor = '';

	$: userDisplayName = `${userFirstName} ${userLastName}`;
	$: owner = $user && $user.id === userId;
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
