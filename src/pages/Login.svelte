<div class="imposter p-centered">
	<Grid align="center">
		<Col col="12">
			<Logo />
		</Col>
		<Col col="auto mx-auto">
			<Form on:submit={submit} horizontal>
				{#if IdPs.includes('local')}
					<FormGroup>
						<Input bind:value={email} expand="xs" placeholder="Email" width="8"
							>Email</Input
						>
					</FormGroup>
					<FormGroup>
						<Input
							bind:value={password}
							expand="xs"
							placeholder="Password"
							type="password"
							width="8">Password</Input
						>
					</FormGroup>
					<Button variant="primary" type="submit" block>Login</Button>
					<Divider align="horizontal center" text="OR" />
				{/if}
				{#if IdPs.length}
					<Grid align="center">
						<Col style="text-align:right;">Log in with:</Col>
						<Col>
							<div class="oauth-buttons">
								{#each IdPs.filter((p) => p !== 'local') as provider}
									<IconButton
										size="lg"
										iconSize="3x"
										variant="link"
										href="{API_BASEURL}/auth/{provider}"
									>
										{@html icons[provider]}
									</IconButton>
								{/each}
							</div>
						</Col>
					</Grid>
				{/if}
			</Form>
		</Col>
	</Grid>
</div>

<script lang="ts">
	import {
		Button,
		Col,
		Divider,
		Form,
		FormGroup,
		Grid,
		Input,
		Icon,
		IconButton,
		toast,
	} from 'svelte-spectre';

	import { userAsync } from '@/stores/user';

	import { login, me } from '@/services/api';

	import { API_BASEURL, IdPs } from '@/config';

	//import github from '@/assets/img/github.svg';
	//import linkedin from '@/assets/img/linkedin.svg';
	//import orcid from '@/assets/img/ORCID-invert.svg';
	//import mpds from '@/assets/img/mpds.svg';
	import basf from '@/assets/img/BASF-invert.svg';

	import Logo from '@/components/Logo.svelte';

	let email = '';
	let password = '';
	let errmsg;

	const icons = { basf };

	async function submit() {
		try {
			await login(email, password);
			$userAsync = me();
			toast.success({ msg: 'You are logged in', timeout: 4000, pos: 'top_right' });
		} catch (err) {
			errmsg = err;
			toast.error({
				msg: errmsg.error || 'Login or password incorrect',
				timeout: 4000,
				pos: 'top_right',
			});
		}
	}
</script>

<style lang="scss">
	.oauth-buttons {
		display: flex;
		justify-content: space-between;
	}
	.imposter {
		position: absolute;
		inset-block-start: 40%;
		inset-inline: 0%;
		transform: translate(0%, -50%);
	}
</style>
