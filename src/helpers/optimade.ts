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
        html = '';
    for (let i = 0, len = string.length; i < len; i++) {
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
    return html;
}
