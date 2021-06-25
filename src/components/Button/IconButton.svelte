<Button {...$$restProps} shape="square" variant="link" on:click on:dblclick>
    <Icon {icon} size={iconSize} />
</Button>

<script context="module">
    import Button from './Button.svelte';
    import Icon from '@/components/Icon';

    import type { Zoom } from '@/components/Icon';
    export type { Size } from './Button.svelte';
    export type { Zoom } from '@/components/Icon';
</script>

<script>
    export let icon: string = '';
    export let iconSize: Zoom;
</script>
