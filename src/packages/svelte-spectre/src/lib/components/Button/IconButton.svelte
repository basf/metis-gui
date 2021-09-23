<Button shape="square" variant="link" {...$$restProps} on:click on:dblclick>
	<Icon {icon} size={iconSize} svg={$$slots.default}><slot /></Icon>
</Button>

<script lang="ts" context="module">
	import Button from './Button.svelte';
	import { Icon } from '../Icon';

	import type { Variant } from '../Button';
	import type { Zoom, Icons } from '../Icon';
	export type { Zoom, Icons, Variant };
</script>

<script lang="ts">
	export let icon: Icons = '';
	export let iconSize: Zoom = '1x';

	// let svg: string = '';

	$: console.log($$slots.default);
</script>
