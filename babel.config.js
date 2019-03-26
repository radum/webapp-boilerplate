module.exports = function(api) {
	const presets = [
		[
			'@babel/preset-env',
			{
				modules: false,
				useBuiltIns: 'usage',
				debug: false,
				corejs: 3
			},
		],
	];

	const plugins = [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-transform-runtime',
		'console'
	];

	// https://babeljs.io/docs/en/config-files#apicache

	api.cache(() => process.env.NODE_ENV);

	return {
		presets,
		plugins,
	};
};
