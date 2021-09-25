<Container>
	<Grid>
		<Col col="auto" offset="mx-auto">
			<form on:submit|preventDefault={submit}>
				<Input bind:value={username} placeholder="Name" inline>Name</Input>
				<Input bind:value={password} placeholder="Password" type="password" inline
					>Password</Input
				>
				<Button variant="primary" type="submit" block>Login</Button>
				<Divider align="horizontal" text="OR" />
				<Grid align="center">
					<Col col="auto">Login with</Col>
					<Col col="8" offset="ml-auto">
						<ButtonGroup>
							{#each oauth as icon}
								<IconButton variant="link" iconSize="2x" size="lg">
									{@html icon}
								</IconButton>
							{/each}
						</ButtonGroup>
					</Col>
				</Grid>
			</form>
		</Col>
	</Grid>
</Container>

<script>
	import {
		Button,
		ButtonGroup,
		Col,
		Container,
		Divider,
		Grid,
		Input,
		IconButton,
		toast,
	} from 'svelte-spectre';

	import user from '@/stores/user';

	import { login, me } from '@/services/api';

	import githubIcon from '@/assets/img/github.svg';
	import linkedinIcon from '@/assets/img/linkedin.svg';
	import basfIcon from '@/assets/img/BASF-invert.svg';
	import orcidIcon from '@/assets/img/ORCID-invert.svg';

	let username = '';
	let password = '';
	let errmsg;

	const oauth: string[] = [githubIcon, linkedinIcon, basfIcon, orcidIcon];

	async function submit() {
		try {
			await login(username, password);
			$user = await me();
			toast.success({ msg: 'You are logged in 👍🏻', timeout: 5000 });
		} catch (err) {
			errmsg = err;
			toast.error({ msg: errmsg.error || 'Login/Password incorrect', timeout: 5000 });
		}
	}
</script>
