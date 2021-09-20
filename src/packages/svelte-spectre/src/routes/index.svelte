<Container
	><h1>Welcome to Svelte{name}</h1>
	<p>
		Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
	</p>
	<Button variant="primary" {loading} on:click={(e) => (loading = !loading)}>Button</Button>
	<IconButton icon="people" shape="square" variant="link" />
	<Hero class="my-2">
		<h2>Grid</h2>
		<Grid>
			<Col md="1" xs="2" lg="3" sm="4" xl="5" col="6" class="class"
				><div class="bg-secondary">col</div></Col
			>
			<Col col="7"><div class="bg-primary">col</div></Col>
			<Col><div class="bg-secondary">col</div></Col>
			<Col><div class="bg-primary">col</div></Col>
			<Col><div class="bg-secondary">col</div></Col>
		</Grid>
	</Hero>
	<div class="columns my-2">
		<div class="column col-4 col-xs-12">
			<Card>
				<img class="img-responsive" src="./img/macos-sierra.jpg" alt="img" slot="img" />
				<div slot="title" class="h5">Title</div>
				<div slot="subtitle" class="text-gray">SubTitle</div>
				<p>Lightweight (~10KB gzipped) starting point for your projects</p>
				<svelte:fragment slot="footer">
					<Button variant="primary" href="#cards">Primary</Button>
					<Button variant="link" href="#cards">Link</Button>
				</svelte:fragment>
			</Card>
		</div>
		<div class="column col-4 col-xs-12">
			<Card pos="middle">
				<img class="img-responsive" src="./img/macos-sierra-2.jpg" alt="img" slot="img" />
				<div slot="title" class="h5">Title</div>
				<div slot="subtitle" class="text-gray">SubTitle</div>
				<p>Flexbox-based, responsive and mobile-friendly layout</p>
				<svelte:fragment slot="footer">
					<Button variant="primary" href="#cards">Primary</Button>
					<Button variant="link" href="#cards">Link</Button>
				</svelte:fragment>
			</Card>
		</div>
		<div class="column col-4 col-xs-12">
			<Card pos="bottom">
				<img class="img-responsive" src="./img/osx-el-capitan-2.jpg" alt="img" slot="img" />
				<div slot="title" class="h5">Title</div>
				<div slot="subtitle" class="text-gray">SubTitle</div>
				<p>Elegantly designed and developed elements and components</p>
				<svelte:fragment slot="footer">
					<Button variant="primary" href="#cards">Primary</Button>
					<Button variant="link" href="#cards">Link</Button>
				</svelte:fragment>
			</Card>
		</div>
	</div>
	<Empty icon="home" titleSize="h1" buttonVariant="primary" buttonHref="#_" />
	<Hero class="my-2" bg="dark" />
</Container>

<script lang="ts">
	import { Button, IconButton } from '$lib/components/';
	import { Card, Container, Empty, Hero, Grid, Col } from '$lib/layouts/';
	// import { Button } from 'package';

	let loading = false;

	export let name: string = 'Spectre';
</script>

<style lang="scss">
	:global(.loading) {
		pointer-events: auto !important;
	}
	// img {
	// 	max-height: 200px;
	// }
	div[class~='bg-'] {
		border-radius: 0.1rem;
	}
</style>
