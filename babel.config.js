module.exports = function(api) {
	const presets = [
		[
			'@babel/preset-env',
			{
				modules: false,
				useBuiltIns: 'usage',
				debug: false,
			},
		],
	];

	const plugins = [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-transform-runtime',
		'@babel/plugin-proposal-class-properties',
		'console'
	];

	// https://babeljs.io/docs/en/config-files#apicache

	api.cache(() => process.env.NODE_ENV);

	return {
		presets,
		plugins,
	};
};
