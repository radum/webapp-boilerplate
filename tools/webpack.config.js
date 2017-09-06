const path = require('path');

// Webpack configuration (main.js => main.build.js)
// http://webpack.github.io/docs/configuration.html
const config = {
	// The base directory (absolute path!) for resolving the entry option
	context: path.resolve(__dirname, '..'),

	// Point of entry for webpack to do its magic
	entry: [
		'src/client/main.js'
	],

	// Output will be saved in `dist/scripts` folder as per the `path` prop here
	// And the filename will be `main.build.js`. With every line of the source in the bundle prefixed with 4 spaces
	output: {
		path: path.resolve(__dirname, '../build/scripts'),
		// publicPath: '/build/',
		// pathinfo: isVerbose,
		filename: '[name].build.[hash].js',
		// chunkFilename: '[id].[chunkhash].build.js', // TODO Understand what this does
		sourcePrefix: '	'
	},

	// Compile for usage in a browser-like environment (default)
	target: 'web',

	// Choose a developer tool to enhance debugging
	// http://webpack.github.io/docs/configuration.html#devtool
	// devtool: DEBUG ? 'source-map' : false
};

// Export the webpack config
module.exports = config;
