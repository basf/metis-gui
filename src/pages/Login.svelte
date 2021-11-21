<Grid>
	<Col col="auto" offset="mx-auto">
		<Form on:submit={submit} horizontal>
			<FormGroup>
				<Input bind:value={email} expand="xs" placeholder="Email">Email</Input>
			</FormGroup>
			<FormGroup>
				<Input bind:value={password} expand="xs" placeholder="Password" type="password"
					>Password</Input
				>
			</FormGroup>
			<Button variant="primary" type="submit" block>Login</Button>
			<Divider align="horizontal" text="OR" />
			<Grid align="center">
				<Col col="auto">Log in with:</Col>
				<Col>
					<div class="oauth-buttons">
						{#each Object.entries(oauth) as [provider, icon]}
							<IconButton
								href="{API_BASEURL}/auth/{provider}"
								variant="link"
								iconSize="3x"
								size="lg"
							>
								{@html icon}
							</IconButton>
						{/each}
					</div>
				</Col>
			</Grid>
		</Form>
	</Col>
</Grid>

<script lang="ts">
	import {
		Button,
		ButtonGroup,
		Col,
		Divider,
		Form,
		FormGroup,
		Grid,
		Input,
		IconButton,
		toast,
	} from 'svelte-spectre';

	import { userAsync } from '@/stores/user';

	import { login, me } from '@/services/api';

	import { API_BASEURL } from '@/config';

	import github from '@/assets/img/github.svg';
	import linkedin from '@/assets/img/linkedin.svg';
	import basf from '@/assets/img/BASF-invert.svg';
	import orcid from '@/assets/img/ORCID-invert.svg';

	let email = '';
	let password = '';
	let errmsg;

	const oauth = { basf, github, linkedin, orcid };

	async function submit() {
		try {
			await login(email, password);
			$userAsync = me();
			toast.success({ msg: 'You are logged in', timeout: 4000 });
		} catch (err) {
			errmsg = err;
			toast.error({ msg: errmsg.error || 'Login or password incorrect', timeout: 4000 });
		}
	}
</script>

<style lang="scss">
	.oauth-buttons {
		display: flex;
		justify-content: space-between;
	}
</style>
