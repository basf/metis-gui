import { CodeJar } from 'codejar';
import { withLineNumbers } from 'codejar/linenumbers';

export default function editor(
	node: HTMLElement,
	{ code, schema, autofocus = false, loc = false, ...options }
) {
	const highlight = (editor: HTMLElement) => {
		const content = editor.textContent;
		const strings = content?.split('\n');
		const defaults = ['end'];
		const keys = [...getKeys(schema), ...defaults];

		editor.innerHTML = `${strings
			?.map((string: string) =>
				string
					.split(' ')
					.map((word: string) => mark(keys, word))
					.join(' ')
			)
			.join('\n')}`;
	};

	const editor = CodeJar(node, loc ? withLineNumbers(highlight) : highlight, options);

	editor.onUpdate((code) => {
		const e = new CustomEvent('change', { detail: code });
		node.dispatchEvent(e);
	});

	function update({ code, schema, autofocus, loc, ...options }) {
		editor.updateOptions(options);
		if (editor.toString() !== code) {
			editor.updateCode(code);
		}
	}

	update({ code, schema, autofocus, loc, ...options });
	autofocus && node.focus();

	return {
		update,
		destroy() {
			editor.destroy();
		},
	};
}
function isNum(number: string) {
	return !isNaN(parseFloat(number)) && isFinite(+number);
}

function getKeys(object: { [key: string]: string } | string, keys: string[] = []) {
	for (const key in object as { [key: string]: string }) {
		if (key === 'properties') keys.push(Object.keys(object[key]) as unknown as string);
		if (typeof object[key] === 'object') {
			const subkeys: string[] = getKeys(object[key]);
			keys = keys.concat(subkeys.map((subkey: string) => subkey));
		}
	}
	return keys.flat().map((key: string) => key.toLowerCase());
}

function color(keys: string[], string: string) {
	if (isNum(string)) return '#d73e48';
	else if (keys.includes(string.toLowerCase())) return '#5755d9';
	else return '#505c6e';
}

function mark(keys: string[], string: string) {
	const nums = '([+-]?\\d+(\\.\\d+)*)';
	const regex = [...keys.map((k) => `^${k}$`), nums].join('|');
	const matched = string?.match(regex);
	return matched
		? string.replace(
				matched[0],
				`\<font color\=${color(keys, matched[0])}\>${matched[0]}\</font\>`
		  )
		: string;
}
