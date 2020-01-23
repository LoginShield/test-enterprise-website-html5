module.exports = {
    root: true,
    env: {
        node: true,
    },
    plugins: [
        'vuetify',
    ],
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
    ],
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'max-len': 'off',
        indent: ['error', 4],
        'vuetify/no-deprecated-classes': 'error',
        'vuetify/grid-unknown-attributes': 'error',
        'vuetify/no-legacy-grid': 'error',
        'import/prefer-default-export': 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
