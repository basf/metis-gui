<Container>
	<div class="column col-4 col-mx-auto">
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
	</div>
</Container>

<script>
	import { Container, Input, Button, Toast, notice } from 'svelte-spectre';

	import user from '@/stores/user';

	import { login, me } from '@/services/api';

	import githubIcon from '@/assets/img/github.svg';
	import linkedinIcon from '@/assets/img/linkedin.svg';

	let username = '';
	let password = '';
	let errmsg;

	$: errmsg && notice.error(errmsg.error || 'Login/Password incorrect', 5000, '', true);

	async function submit() {
		try {
			await login(username, password);
			$user = await me();
		} catch (err) {
			errmsg = err;
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
