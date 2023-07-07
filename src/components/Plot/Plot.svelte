<div class="chart" bind:offsetWidth={width} bind:offsetHeight={height}>
	<svg>
		<!-- axis y -->
		<g class="axis y-axis" transform="translate(0, {padding.top})">
			{#each yTicks as tick}
				<g
					class="tick tick-{tick}"
					transform="translate(0, {yScale(tick) - padding.bottom})"
				>
					<line x2="100%" />
					<text y="-4">{tick} {tick === 8 ? ' points' : ''}</text>
				</g>
			{/each}
		</g>

		<!-- axis x -->
		<g class="axis x-axis">
			{#each xTicks as tick}
				<g class="tick tick-{tick}" transform="translate({xScale(tick)},{height})">
					<line y1="-{height}" y2="-{padding.bottom}" x1="0" x2="0" />
					<text y="-2">{width > 380 ? tick : formatMobile(tick)}</text>
				</g>
			{/each}
		</g>

		<!-- data -->
		<path class="path-area" d={area} />
		<path class="path-line" d={path} />
	</svg>
</div>

<script lang="ts" context="module">
	import { scaleLinear } from 'd3-scale';
</script>

<script lang="ts">
	export let source: number[][];

	const xTicks = [0, 45, 90, 135, 180];
	const yTicks = [0, 25, 50, 100];
	const padding = { top: 20, right: 130, bottom: 20, left: 65 };

	let width = 500;
	let height = 200;
	let points: { x: number; y: number }[];

	$: points = parseSource(source);

	$: xScale = scaleLinear()
		.domain([minX, maxX])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: minX = points[0].x;
	$: maxX = points[points.length - 1].x;
	$: path = `M${points.map((p) => `${xScale(p.x)},${yScale(p.y)}`).join('L')}`;
	$: area = `${path}L${xScale(maxX)},${yScale(0)}L${xScale(minX)},${yScale(0)}Z`;

	function formatMobile(tick) {
		return "'" + tick.toString().slice(-2);
	}

	function parseSource(source: number[][]) {
		return source
			.map((row) => {
				return { x: row[0], y: row[1] };
			});
	}
</script>

<style lang="scss">
	div.chart {
		width: 100%;
		height: 100%;

		svg {
			position: relative;
			width: 100%;
			height: 100%;
			min-height: 250px;
			overflow: visible;

			.tick {
				font-size: 0.725em;
				font-weight: 200;

				line {
					stroke: $gray-color;
					stroke-dasharray: 3;
					@media (prefers-color-scheme: dark) {
						stroke: $gray-color-dark;
					}
					@media (prefers-color-scheme: light) {
						stroke: $gray-color;
					}
					:global([color-scheme='dark']) & {
						stroke: $gray-color-dark;
					}
					:global([color-scheme='light']) & {
						stroke: $gray-color;
					}
				}

				text {
					fill: $gray-color;
					text-anchor: start;
					.x-axis & {
						text-anchor: middle;
					}
				}

				&.tick-0 line {
					stroke-dasharray: 0;
				}
			}

			.path-line {
				fill: none;
				@media (prefers-color-scheme: dark) {
					stroke: #fff;
				}
				@media (prefers-color-scheme: light) {
					stroke: #000;
				}
				:global([color-scheme='dark']) & {
					stroke: #fff;
				}
				:global([color-scheme='light']) & {
					stroke: #000;
				}
				stroke-linejoin: round;
				stroke-linecap: round;
				stroke-width: 1;
			}
		}
	}
</style>
