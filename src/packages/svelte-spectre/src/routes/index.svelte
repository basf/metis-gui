<Container size="xs"
	><h1>Welcome to Svelte{name}</h1>
	<p>
		Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
	</p>
	<Button variant="primary" {loading} on:click={(e) => (loading = !loading)} />
	<IconButton icon="icon-people" shape="square" variant="link" />
	<Card class="columns col-2">
		<img src="./img/color.jpg" alt="img" slot="img" />
		<h2 slot="title">Title</h2>
		<p>Card body</p>
	</Card>
</Container>

<script lang="ts">
	import { Button, IconButton } from '$lib/components';
	import { Card, Container } from '$lib/layouts/';

	let loading = false;

	export let name: string = 'Spectre';
</script>

<style lang="scss">
	:global(.loading) {
		pointer-events: auto !important;
	}
	img {
		max-height: 200px;
	}
</style>
