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
	// We can even use `process.env.NODE_ENV` but because we are creating modern and legacy
	// bundles via webpack, we need to invalidate the cache when `BROWSERSLIST_ENV` changes
	// programatically from within the main `js-compiler` task.
	api.cache(() => process.env.BROWSERSLIST_ENV);

	return {
		presets,
		plugins,
	};
};
