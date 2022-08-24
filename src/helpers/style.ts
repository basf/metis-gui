import type { Collection } from '@/types/dto';
import { TinyColor, random } from '@ctrl/tinycolor';

export function autoColor(flavour: Collection['typeFlavor']) {
	const color = new TinyColor(flavour);
	return `
		background: ${color.toHexString()} !important;
		color: ${color.isLight() ? '#000' : '#fff'};
	`;
}
