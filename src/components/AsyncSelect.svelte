{#await data}
    <ControlLoader height="{SIZE[size]}px" />
{:then data}
    <Select
        {...$$restProps}
        options={getOptions(data)}
        {size}
        bind:value
        on:change
        on:click
		on:dblclick
		on:focus
		on:blur
    />
{/await}

<script lang="ts" context="module">
    import { Select } from 'svelte-spectre';
    import type { Size } from 'svelte-spectre';
    import { SIZE } from 'svelte-spectre/package/types/const';

    import { Control as ControlLoader } from '@/components/loaders';
</script>

<script lang="ts">
    export let data;
    export let getOptions = opts => opts;
	export let value;
    export let size: Size = 'md';
</script>