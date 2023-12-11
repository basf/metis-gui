<div class="tile-data">
	<Tile>
		<svelte:fragment slot="icon">
			{#if mode !== 'light'}
				{#if datasource.type === 1}
					<Icon size="2x">{@html cube}</Icon>
				{:else if datasource.type === 3}
					<Icon size="2x">{@html file_icon}</Icon>
				{:else if datasource.type === 5}
					<Icon size="2x">{@html sinus}</Icon>
				{:else if datasource.type === 6}
					<Icon size="2x">{@html user_input}</Icon>
				{:else}
					<span class="placeholder" />
				{/if}
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="title">
			<h5 class="mt-2">{@html datasource.name}</h5>
		</svelte:fragment>
		<svelte:fragment slot="subtitle">
			<small class="text-gray">
				Added {showTimestamp(datasource)}
				{#if $user.id !== datasource.userId}
					by {datasource.userFirstName} {datasource.userLastName}
				{/if}
			</small>
		</svelte:fragment>
		<svelte:fragment slot="action">
			<slot />
		</svelte:fragment>
	</Tile>
</div>

<script lang="ts" context="module">
	import { getContext } from 'svelte';
	import { fragment } from 'svelte-pathfinder';
	import { Icon, Tile } from 'svelte-spectre';
	import user from '@/stores/user';
	import { showTimestamp } from '@/helpers/date';

	import cube from '@/assets/img/cube.svg';
	import file_icon from '@/assets/img/file_icon.svg';
	import sinus from '@/assets/img/sinus.svg';
	import user_input from '@/assets/img/user_input.svg';

	import type { DataSource } from '@/types/dto';
</script>

<script lang="ts">
	export let datasource: DataSource;
	const mode = getContext('mode');
</script>

<style lang="scss">
	.tile-data {
		:global(.tile) {
			padding: 0.25em;
		}
		h5 {
			display: inline;
		}
	}
	span.placeholder {
		display: inline-block;
		width: 30px;
	}
</style>
