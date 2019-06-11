module.exports = function(api) {
	const presets = [
		[
			'@babel/preset-env',
			{
				// Do not transform modules to CJS, Webpack will take care of that
				modules: false,
				useBuiltIns: 'usage',
				// Don't log anything on the console
				debug: false,
				// Set the corejs version we are using to avoid warnings in console
          		// This will need to change once we upgrade to corejs@3
				corejs: 3,
				// Exclude transforms that make all code slower
				exclude: ['transform-typeof-symbol']
			}
		]
	];

	const plugins = [
		['@babel/plugin-transform-runtime', { corejs: 3, useESModules: true }],
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-optional-chaining',
		'console'
	];

	// https://babeljs.io/docs/en/config-files#apicache
	// We can even use `process.env.NODE_ENV` but because we are creating modern and legacy
	// bundles via webpack, we need to invalidate the cache when `BROWSERSLIST_ENV` changes
	// programatically from within the main `js-compiler` task.
	api.cache(() => process.env.BROWSERSLIST_ENV);

	return {
		presets,
		plugins
	};
};
