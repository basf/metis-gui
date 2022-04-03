module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        createDefaultProgram: true,
        ecmaVersion: 2020,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.svelte'],
    },
    env: {
        node: true,
        es6: true,
        browser: true,
    },
    plugins: ['svelte3', '@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    overrides: [{
        files: ['**/*.svelte'],
        processor: 'svelte3/svelte3',
    }, {
        files: ['*.ts', '*.json'],
        extends: ['plugin:@typescript-eslint/recommended'],
    },],
    settings: {
        'svelte3/typescript': require('typescript'),
    },
    rules: {
        "@typescript-eslint/no-var-requires": 0,
    },
    globals: {
        __env: true,
        __ver: true,
    }
};