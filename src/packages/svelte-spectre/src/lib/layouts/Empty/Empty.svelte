<div class="empty">
	{#if icon}
		<div class="empty-icon">
			<Icon {icon} size={iconSize} />
		</div>
	{/if}
	<div class="empty-title h3">
		<slot name="title">Coming soon...</slot>
	</div>
	<div class="empty-subtitle">
		<slot name="subtitle">This section is under development</slot>
	</div>
	<div class="empty-action">
		<slot name="action">
			<Button variant={buttonVariant}>{buttonText}</Button>
		</slot>
	</div>
</div>

<script lang="ts">
	import { Icon, Zoom } from '../../components/Icon/';
	import { Button, Variant } from '../../components/Button/';

	export let icon: string = '';
	export let iconSize: Zoom = '3x';
	export let buttonVariant: Variant = 'primary';
	export let buttonText: string = 'Send a message';
</script>

<style lang="scss">
	@import 'spectre.css/src/empty';
</style>
