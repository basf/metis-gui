import { CodeJar } from 'codejar';
import { withLineNumbers } from 'codejar/linenumbers';

export default function editor(node: HTMLElement, { code, schema, autofocus = false, loc = false, ...options }) {
    const highlight = (node: HTMLElement) => {
        const strings = code.split('\n')
        const defaults = ['end']
        const keys = [...getKeys(schema), ...defaults]

        node.children[0].innerHTML = `${strings
            .map((string: string) => string.split(' ').map((word: string) => mark(keys, word)).join(' '))
            .join('\n')}`
    }

    const editor = CodeJar(node, loc ? withLineNumbers(highlight) : highlight, options);

    editor.onUpdate(code => {
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
        }
    };
}
function isNum(number: string) {
    return !isNaN(parseFloat(number)) && isFinite(+number);
}

function getKeys(object = {}, keys = []) {
    for (let key in object) {
        if (key === 'properties')
            keys.push(Object.keys(object[key]));
        if (typeof object[key] === "object") {
            let subkeys: string[] = getKeys(object[key]);
            keys = keys.concat(subkeys.map((subkey: string) => subkey));
        }
    }
    // console.log(keys)
    return keys.flat().map((key: string) => key.toLowerCase());
}

function color(keys: [], string: string) {
    if (isNum(string)) return '#d73e48'
    else if (keys.includes(string.toLowerCase())) return '#5755d9'
    else return '#505c6e'
}

function mark(keys: [], string: string) {
    return `<font color=${color(keys, string)}>${string}</font>`
}
