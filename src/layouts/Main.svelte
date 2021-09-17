<Container>
	<div class="columns">
		<div class="column col-12 col-mx-auto mt-2">
			{#if $errors.length}
				{#each $errors as error}
					<Toast type="error">
						{error.message || error}
					</Toast>
				{/each}
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
					<slot />
				</div>
			</Panel>
		</div>
	</div>
</Container>

<script>
	import { path } from 'svelte-pathfinder';
	import { Container, Panel, Toast } from 'svelte-spectre';

	import errors from '@/stores/errors';

	import { menu } from '@/routes';
</script>

<style lang="scss">
	@import 'spectre.css/src/tabs';
</style>
