module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
    },
    globals: {
        '__DEV__': 'readonly',
    },
    'extends': [
        'alloy',
        'alloy/typescript',
    ],
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'rules': {
        'semi': [2, 'always'],
        'quotes': [2, 'single'],
        'comma-dangle': [2, 'always-multiline'],
        'no-param-reassign': 0,
        '@typescript-eslint/member-ordering': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
    },
};
