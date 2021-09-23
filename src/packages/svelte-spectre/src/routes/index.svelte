<Container
	><h1>Welcome to Svelte{name}</h1>
	<p>
		Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
	</p>
	<Button variant="primary" {loading} on:click={(e) => (loading = !loading)}>Button</Button>
	{#each positions as pos}
		<IconButton
			icon="message"
			variant="default"
			on:click={(e) => notice.success({ msg: pos, pos: pos })}
		/>
	{/each}
	<Hero offset="my-2" size="sm">
		<h2>Grid</h2>
		<Grid stack>
			<Col col="5" class="class"><div class="bg-secondary">col</div></Col>
			<Col col="7"><div class="bg-primary">col</div></Col>
			<Col col="8"><div class="bg-secondary">col</div></Col>
			<Col col="4"><div class="bg-primary">col</div></Col>
			<Col><div class="bg-secondary">col</div></Col>
		</Grid>
	</Hero>
	<Divider text="&&" />
	<Hero size="sm">
		<h2>Cards</h2>
		<Grid offset="my-2" oneline align="start">
			<Divider align="vertical" text="LEFT" />
			{#each CARDS as { col, pos, img, text }}
				<Col {col}>
					<Card {pos}>
						<img class="img-responsive" src="img/{img}" alt="img" slot="img" />
						<div slot="title" class="h5">Title</div>
						<div slot="subtitle" class="text-gray">SubTitle</div>
						<p>{text}</p>
						<svelte:fragment slot="footer">
							<Button variant="primary" href="#cards">Primary</Button>
							<Button variant="link" href="#cards">Link</Button>
						</svelte:fragment>
					</Card>
				</Col>
			{/each}
			<Divider align="vertical" text="RIGHT" />
		</Grid>
	</Hero>
	<Empty icon="home" titleSize="h1" buttonVariant="primary" buttonHref="#_" />
	<Hero offset="my-2" bg="dark" />
</Container>

<script lang="ts">
	import { Button, Divider, IconButton } from '$lib/components/';
	import { Card, Container, Empty, Hero, Grid, Col } from '$lib/layouts/';
	// import { Button } from 'package';
	import { notice, Pos } from '$lib/components/Toast/notice';

	let loading = false,
		positions: Pos[] = [
			'top_center',
			'top_right',
			'center_right',
			'bottom_right',
			'bottom_center',
			'bottom_left',
			'center_left',
			'top_left',
			'center_center',
		];

	const CARDS = [
		{
			pos: 'top',
			col: '4',
			img: 'macos-sierra.jpg',
			text: 'Lightweight (~10KB gzipped) starting point for your projects',
		},
		{
			pos: 'middle',
			col: '6',
			img: 'macos-sierra-2.jpg',
			text: 'Flexbox-based, responsive and mobile-friendly layout',
		},
		{
			pos: 'bottom',
			col: '8',
			img: 'osx-el-capitan.jpg',
			text: 'Elegantly designed and developed elements and components',
		},
		{
			pos: 'middle',
			col: '10',
			img: 'osx-yosemite.jpg',
			text: 'Lightweight (~10KB gzipped) starting point for your projects',
		},
		{
			pos: 'top',
			col: '12',
			img: 'osx-yosemite-2.jpg',
			text: 'Flexbox-based, responsive and mobile-friendly layout',
		},
	];

	export let name: string = 'Spectre';
</script>

<style lang="scss">
	:global(.loading) {
		pointer-events: auto !important;
	}
	// img {
	// 	max-height: 200px;
	// }
	// div[class~='bg-'] {
	// 	border-radius: 0.1rem;
	// }
</style>
