<div class="py-2">
	<Grid stack>
		<Col sm="12">
			<Input rows={2} placeholder="Paste structure or pattern" bind:value />
		</Col>
		<Divider align={!$media.sm ? 'vertical' : 'horizontal center'} text="OR" />
		<Col sm="12">
			<Upload on:files={handleFiles} bind:clearFiles />
		</Col>
	</Grid>

	<Button variant="primary" block on:click={addDataSourceItem}>Upload data</Button>
</div>

<script lang="ts" context="module">
	import { Button, Col, Divider, Grid, Input, toast } from 'svelte-spectre';
	import { Upload } from '@/components/Upload/';

	import { media } from '@/stores/media';
	import { setDataSources } from '@/services/api';
</script>

<script lang="ts">
	let value = '';

	let clearFiles: () => void,
		contents: string[] = [];

	function isASCII(str) {
		return /^[\x00-\x7F]*$/.test(str);
	}

	function toBase64(blob) {
		return new Promise((resolve, _) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(blob);
		});
	}

	async function addDataSourceItem() {
		try {
			const uploaded = await setDataSources(contents.length ? contents : value);
			//console.log(uploaded);
			clearFiles();
			value = '';
		} catch (error) {
			toast.error({ msg: `Sorry, cannot upload file`, timeout: 4000, pos: 'top_right' });
		}
		toast.primary({
			msg: 'Adding to my data',
			timeout: 2500,
			pos: 'top_right',
			icon: 'check',
		});
	}

	async function handleFiles(e: any) {
		const { files } = e.detail;

		if (files.length) {
			for (const file of files) {
				let content = await file.text();

				if (!isASCII(content)){
					content = await toBase64(file);
				}

				contents.push(content);
			}
			contents = [...contents];
		} else {
			contents = [];
		}
	}
</script>
