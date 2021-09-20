<Container
	><h1>Welcome to Svelte{name}</h1>
	<p>
		Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
	</p>
	<Button variant="primary" {loading} on:click={(e) => (loading = !loading)}>Button</Button>
	<IconButton icon="people" shape="square" variant="link" />
	<Hero class="my-2">
		<h2>Grid</h2>
		<Grid stack>
			<Col col="5" class="class"><div class="bg-secondary">col</div></Col>
			<Col col="7"><div class="bg-primary">col</div></Col>
			<Col col="8"><div class="bg-secondary">col</div></Col>
			<Col col="4"><div class="bg-primary">col</div></Col>
			<Col><div class="bg-secondary">col</div></Col>
		</Grid>
	</Hero>
	<Divider text="OR" />
	<Grid class="my-2" stretch>
		<Col>
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
		</Col>
		<Divider vertical text="OR" />
		<Col>
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
		</Col>
		<Col>
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
		</Col>
	</Grid>
	<Empty icon="home" titleSize="h1" buttonVariant="primary" buttonHref="#_" />
	<Hero class="my-2" bg="dark" />
</Container>

<script lang="ts">
	import { Button, Divider, IconButton } from '$lib/components/';
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
