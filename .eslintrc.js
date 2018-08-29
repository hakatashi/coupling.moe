module.exports = {
	root: true,
	parserOptions: {
	  parser: 'babel-eslint',
	},
	env: {
		browser: true,
		node: true,
	},
	extends: [
		'@hakatashi',
		'plugin:vue/recommended',
	],
	// required to lint *.vue files
	plugins: [
		'vue',
	],
	// add your custom rules here
	rules: {
		'vue/html-indent': ['error', 'tab'],
		'vue/mustache-interpolation-spacing': ['error', 'never'],
		'vue/max-attributes-per-line': ['error', {
			singleline: 3,
			multiline: {
				max: 1,
				allowFirstLine: false,
			},
		}],
		'node/no-unsupported-features': 'off',
		'max-params': 'off',
	},
	globals: {},
};
