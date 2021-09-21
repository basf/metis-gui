<Grid container>
	<Col col="4" offset="mx">
		<!-- {#if errmsg}
			<Toast type="error">
				{errmsg.error || 'Login/Password incorrect'}
			</Toast>
		{/if} -->
		<form on:submit|preventDefault={submit}>
			<Input bind:value={username} placeholder="Name" inline>Name</Input>
			<Input bind:value={password} placeholder="Password" type="password" inline
				>Password</Input
			>
			<Button variant="primary" type="submit" block>Login</Button>
			<div class="divider text-center p-1" data-content="OR" />
			<Button variant="secondary" type="button" block>
				Sign in with <i class="social-icon pl-2">{@html githubIcon}</i>
			</Button>
			<Button variant="secondary" type="button" block style="margin-top: 0.4rem">
				Sign in with <i class="social-icon pl-2">{@html linkedinIcon}</i>
			</Button>
		</form>
	</Col>
</Grid>

<script>
	import { Container, Grid, Col, Input, Button, Toast, notice } from 'svelte-spectre';

	import user from '@/stores/user';

	import { login, me } from '@/services/api';

	import githubIcon from '@/assets/img/github.svg';
	import linkedinIcon from '@/assets/img/linkedin.svg';

	let username = '';
	let password = '';
	let errmsg;

	// $: errmsg
	// 	? notice.error(errmsg.error || 'Login/Password incorrect', 5000)
	// 	: notice.success('You are logged in 👍🏻', 5000);

	async function submit() {
		try {
			await login(username, password);
			$user = await me();
			notice.success({ msg: 'You are logged in 👍🏻', timeout: 5000 });
		} catch (err) {
			errmsg = err;
			notice.error({ msg: errmsg.error || 'Login/Password incorrect', timeout: 5000 });
		}
	}
</script>

<style>
	.social-icon > :global(svg) {
		fill: #5755d9;
		height: 0.8rem;
		vertical-align: middle;
	}
</style>
