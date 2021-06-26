import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import importResolver from 'rollup-plugin-import-resolver';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import url from "@rollup/plugin-url";
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import svelte from 'rollup-plugin-svelte';
import css from 'rollup-plugin-css-only';
import svg from 'rollup-plugin-inline-svg';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import visualizer from 'rollup-plugin-visualizer';
import zip from 'zip-dir';

const {
	dev,
	name,
	dest,
	alias,
	input,
	files,
	assets,
	legacy,
	sourceMap,
	extensions,
	mainFields,
	replace: replaceValues
} = require('./app.config.js');

const svelteConfig = require('./svelte.config.js');

export default {
	input,
	output: {
		dir: `${dest}/build`,
		sourcemap: sourceMap,
		format: 'esm',
		name,
	},
	plugins: [
		copy({
			targets: [
				{
					src: `${dest}/*.tmpl`,
					rename: name => name,
					transform: contents => {
						return Object.entries(replaceValues).reduce((contents, [ key, val ]) => {
							return contents.replace(new RegExp(`{{${key}}}`, 'gi'), val);
						}, contents.toString());
					},	
					dest, 
				},
				...files,
			],
			copyOnce: true,
			verbose: true,
			dot: true,
		}),
		svelte(svelteConfig),
		css({ output: `${name}.css`, }),
		url({ 
			exclude: ['**/*.svg', '**/*.json', ], 
			sourceDir: assets, 
			destDir: dest, 
		}),
		svg({ removeSVGTagAttrs: false, }),
		json(),
		importResolver({ extensions, alias, }),
		replace({ values: replaceValues, preventAssignment: true, }),
		resolve({
			browser: true,
			dedupe: ['svelte'],
			mainFields,
			extensions,
		}),
		commonjs({ sourceMap, extensions, }),
		typescript({ sourceMap, inlineSources: sourceMap, }),
		!dev && legacy && babel({
			extensions,
			babelHelpers: 'runtime',
			exclude: ['node_modules/@babel/**', 'node_modules/core-js/**',],
			presets: [
				['@babel/preset-env', {
					useBuiltIns: 'entry',
					corejs: 3,
				}],
			],
			plugins: [
				'@babel/plugin-proposal-optional-chaining',
				['@babel/plugin-transform-runtime', {
					useESModules: true,
				}],
			],
		}),
		!dev && terser(),
		dev && visualizer({ filename: `${dest}/stats.html`, }),
		dev && serve(),
		dev && livereload(dest),
		!dev && zipdir({ dest, name })
	],
	watch: { clearScreen: false, },
	onwarn,
};

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--single', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

function zipdir({ dest, name }) {
	return {
		name: 'zipdir',
		writeBundle() {
			const dir = path.resolve(dest);
			const saveTo = path.join(dir, `${name}.zip`);
			zip(dir, { saveTo }, () => {
				console.log('Package zipped at ' + saveTo);
			});
		}
	};
}

function onwarn(warning, onwarn) {
	if (warning.pluginCode === 'css-unused-selector') return;
	onwarn(warning);
}