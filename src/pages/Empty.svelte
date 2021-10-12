<Main>
	<Empty offset="my-2">
		<Icon slot="icon" icon="home" size="3x" />
		<h1 slot="title">Coming soon...</h1>
		<p slot="subtitle">This section is under development</p>
		<!-- Button slot="action" variant="primary" {loading} on:click={() => (loading = !loading)}
			>Action</Button
		-->
	</Empty>
</Main>

<script lang="ts">
	import { Button, Empty, Icon } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';

	let loading;
</script>
