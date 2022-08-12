/**
 * Recursively traverse json object
 * @param {object} target
 * @param {function} callback
 */
export function traverseObject(target, callback) {
	callback(target);
	if (typeof target === 'object') {
		for (let key in target) {
			traverseObject(target[key], callback);
		}
	}
}
