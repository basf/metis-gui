<Button {...$$restProps} {size} {shape} {variant} on:click on:dblclick>
	<Icon {icon} {svg} size={iconSize} />
</Button>

<script lang="ts" context="module">
	import Button, { Size, Shape, Variant } from './Button.svelte';
	import { Icon, Zoom, Icons } from '../Icon';

	export type { Zoom, Icons, Shape, Variant };
</script>

<script lang="ts">
	export let icon: Icons = 'emoji';
	export let iconSize: Zoom = '1x';
	export let size: Size = 'md';
	export let svg: string = '';
	export let variant: Variant = 'link';
	export let shape: Shape = 'square';
</script>
