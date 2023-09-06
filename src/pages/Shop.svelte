<Main>
	<Empty>
		<Icon slot="icon" icon="mail" size="3x" />
		<h1 slot="title">Postal kits</h1>
		<p slot="subtitle">Please drop us a line at <a href="mailto:order@metis.science">order@metis.science</a> to receive one.</p>
	</Empty>
</Main>

<script lang="ts">
	import { Empty, Icon } from 'svelte-spectre';
	import { Main } from '@/layouts';
</script>

<style lang="scss">
	.subtitle {
		font-size: 2em;
	}
</style>
