<Button {...$$restProps} shape="square" variant="link" on:click on:dblclick>
	<Icon {icon} size={iconSize} />
</Button>

<script lang="ts" context="module">
	import Button from './Button.svelte';
	import { Icon, Icons } from '../Icon';

	import type { Zoom } from '../Icon';
	export type { Size } from './Button.svelte';
	export type { Zoom } from '../Icon';
</script>

<script lang="ts">
	export let icon: Icons;
	export let iconSize: Zoom = '1x';
</script>
