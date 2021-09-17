<Container>
	<div class="columns">
		<div class="column col-12 col-mx-auto mt-2">
			{#if error}
				<Toast type="error">
					{error}
				</Toast>
			{/if}
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
						{#if !item.error}
							<Tile>
								<h5 class="mt-2" slot="title">{@html item.name}</h5>
								<svelte:fragment slot="subtitle">
									{#if item.inProgress}
										<Progress value={item.calculation.progress} />
									{:else}
										<small class="tile-subtitle text-gray"
											>Type &bull; {item.type} &bull; {new Date().toLocaleTimeString()}</small
										>
									{/if}
								</svelte:fragment>
								<svelte:fragment slot="action">
									{#if item.inProgress}
										<IconButton
											icon="icon-stop"
											on:click={() => delCalculation(item.calculation.uuid)}
										/>
									{:else}
										<IconButton
											icon="icon-forward"
											on:click={() => setCalculation(item.uuid)}
										/>
									{/if}
									<IconButton
										icon="icon-cross"
										on:click={() => delData(item.uuid)}
									/>
								</svelte:fragment>
							</Tile>
						{/if}
					{:else}
						<center><br /><br />Upload a structure to start...<br /><br /></center>
					{/each}
				</div>
				<svelte:fragment slot="footer">
					<div class="columns mb-2 mt-2">
						<div class="column">
							<Input
								rows={4}
								placeholder="Paste POSCAR, CIF, or Optimade JSON"
								bind:value={content}
							/>
						</div>
						<div class="divider-vert" data-content="OR" />
						<div class="column">
							<input type="file" />
						</div>
					</div>
					<Button
						variant="primary"
						block
						disabled={dataCalc.length >= 5}
						on:click={addDataItem}>Add structure</Button
					>
				</svelte:fragment>
			</Panel>
		</div>
	</div>
</Container>

<script>
	import { onMount } from 'svelte';
	import { path } from 'svelte-pathfinder';

	import {
		Container,
		Panel,
		Tile,
		Button,
		IconButton,
		Toast,
		Progress,
		Input,
	} from 'svelte-spectre';

	import { menu } from '@/routes';

	import {
		getData,
		setData,
		delData,
		getCalculations,
		setCalculation,
		delCalculation,
	} from '@/services/api';

	import data from '@/stores/data';
	import calculations from '@/stores/calculations';

	let error = false;

	$: dataCalc = $data.map((item) => {
		if (item.error) error = item.error;
		item.calculation = $calculations.find((calc) => calc.data === item.uuid);
		item.inProgress = item.calculation && item.calculation.progress < 100;
		console.log(item);
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
		error = false;
		setData(content);
		content = '';
	}
</script>

<style lang="scss">
	@import 'spectre.css/src/tabs';
</style>
