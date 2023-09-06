import type { Types } from 'optimade';

export function getStructureTitle(item: Types.Structure): string {
	return addSubTags(
		item.attributes.chemical_formula_hill ||
			item.attributes._tcod_unreduced_formula ||
			item.attributes.chemical_formula_reduced ||
			item.id
	);
}
export function addSubTags(string: string): string {
	let sub = false,
		html = '',
		stop = string.indexOf('*'); // NB used for collections with slug=phases

	for (let i = 0, len = (stop == -1) ? string.length : stop; i < len; i++) {
		if (!isNaN(+string[i]) || string[i] == '.') {
			if (!sub) {
				html += '<sub>';
				sub = true;
			}
		} else {
			if (sub) {
				html += '</sub>';
				sub = false;
			}
		}
		html += string[i];
	}
	if (sub) html += '</sub>';
	if (stop !== -1) html += string.substring(stop);
	return html;
}
