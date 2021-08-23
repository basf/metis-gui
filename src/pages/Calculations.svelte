<Container>
	<div class="columns">
		<div class="column col-12 col-mx-auto mt-2">
            <Panel>
                <nav slot="nav">
                    <ul class="tab tab-block">
                        {#each menu as item}
                            <li class:active={$path.toString() === item.path} class="tab-item">
                                <a href={item.path}>{item.title}</a>
                            </li>
                        {/each}
                    </ul>
                </nav>
                <div slot="body" class="mt-2">
               {#each dataCalc as item, i (item.uuid)}
                    <Tile>
                        <h5 class="mt-2" slot="title">{item.name}</h5>
                        <svelte:fragment slot="subtitle">
                            {#if item.inProgress}
                                <Progress value={item.calculation.progress} />
                            {:else}
                                <small class="tile-subtitle text-gray">Type · {item.type} · {(new Date()).toDateString()}</small>
                            {/if}
                        </svelte:fragment>
                        <svelte:fragment slot="action">
                            {#if item.inProgress}
                                <IconButton icon="icon-stop" on:click={() => delCalculation(item.calculation.uuid)}></IconButton>
                            {:else}
                                <IconButton icon="icon-refresh" on:click={() => setCalculation(item.uuid)}></IconButton>
                            {/if}
                            <IconButton icon="icon-cross" on:click={() => delData(item.uuid)}></IconButton>
                        </svelte:fragment>
                    </Tile>
                {:else}
                    <h6>No data sets</h6>
                {/each}
                </div>
                <svelte:fragment slot="footer">
                    <div class="columns mb-2 mt-2">
                        <div class="column">
                            <Input rows={2} placeholder="Text input" bind:value={content} />
                        </div>
                        <div class="divider-vert" data-content="OR"></div>
                        <div class="column">
                          <input type="file">
                        </div>
                    </div>
                    <Button variant="primary" block disabled={dataCalc.length >= 5} on:click={addDataItem}>Add calculation</Button>
                </svelte:fragment>
            </Panel>
		</div>
	</div>
</Container>

<script>
    import { onMount } from 'svelte';
    import { path } from 'svelte-pathfinder';

	import Container from '@/layouts/Container.svelte';
	import Panel from '@/layouts/Panel.svelte';
    import Tile from '@/layouts/Tile.svelte';
	import Button, { IconButton } from '@/components/Button';
    import Progress from '@/components/Progress';
    import Input from '@/components/Input';
    import { menu } from '@/routes';

    import { getCalculations, getData, setData, delData, setCalculation, delCalculation } from '@/services/api';

    import data from '@/stores/data';
    import calculations from '@/stores/calculations';

    $: dataCalc = $data.map(item => {
        item.calculation = $calculations.find(calc => calc.data === item.uuid);
        item.inProgress = item.calculation && item.calculation.progress < 100;
        return item;
    });

    let content;

    onMount(async () => {
        setTimeout(() => {
            getData();
            getCalculations();
        });
    });

    function addDataItem() {
        setData(content);
        content = '';
    }
</script>

<style lang="scss">
	@import 'spectre.css/src/tabs';
</style>