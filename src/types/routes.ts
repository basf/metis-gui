import type { Props } from 'svelte-viewpoint';

export type MenuProp = {
	title: string;
	path?: string;
	target?: string;
	pos?: number;
	icon?: string;
	badge?: string;
	clear?: boolean;
};

export interface Route {
	path: string;
	component?: Props['component'];
	menu?: MenuProp;
}
