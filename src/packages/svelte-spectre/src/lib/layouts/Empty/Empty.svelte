<div class="empty">
	{#if icon || $$slots.icon}
		<div class="empty-icon">
			<slot name="icon"><Icon {icon} size={iconSize} /></slot>
		</div>
	{/if}
	{#if title || $$slots.title}
		<div class="empty-title {titleSize}">
			<slot name="title">{title}</slot>
		</div>
	{/if}
	{#if subtitle || $$slots.subtitle}
		<div class="empty-subtitle">
			<slot name="subtitle">{subtitle}</slot>
		</div>
	{/if}
	{#if buttonText || $$slots.action}
		<div class="empty-action">
			<slot name="action">
				<Button variant={buttonVariant}>{buttonText}</Button>
			</slot>
		</div>
	{/if}
</div>

<script lang="ts" context="module">
	import type { Header } from '../../types/text';
	import { Icon, Zoom, Icons } from '../../components/Icon/';
	import { Button, Variant } from '../../components/Button/';

	export type { Icons, Header };
</script>

<script lang="ts">
	// type titleSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

	export let icon: Icons = 'emoji';
	export let iconSize: Zoom = '3x';
	export let title: string = 'Title';
	export let titleSize: Header = 'h3';
	export let subtitle: string = 'Subtitle';
	export let buttonVariant: Variant = 'primary';
	export let buttonText: string = 'Button';
</script>

<style lang="scss">
	@import 'spectre.css/src/empty';
</style>
