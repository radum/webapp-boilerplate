/* eslint-env node */
/* eslint prefer-destructuring: 0 */

const path = require('path');
const webpack = require('webpack');

const AssetsPlugin = require('assets-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CaseSensitivePathPlugin = require('case-sensitive-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = require('./config');

// Webpack configuration (main.js => main.build.js)
// http://webpack.github.io/docs/configuration.html
const webpackConfig = {
	// The base directory, an absolute path, for resolving entry points and loaders from configuration
	context: path.resolve(__dirname, '..'),

	// Point of entry for webpack to do its magic
	entry: [
		// Usual entry location: './src/client/main.js'
		// TODO: This `./` is stupid fix it
		'./' + config.paths.scriptsEntryPoint
	],

	// Output will be saved in `build/static/scripts` folder as per the `path` prop here
	// And the filename will be `main.build.js`. With every line of the source in the bundle prefixed with 1 tab
	output: {
		// The output directory as an absolute path
		path: path.resolve(__dirname, '..', config.paths.scriptsOutputDest),
		// This option specifies the public URL of the output directory when referenced in a browser

		publicPath: config.paths.scriptsPublicPath,
		// Include comments in bundles with information about the contained modules

		pathinfo: config.isVerbose,
		// The name of each output bundle. The bundle is written to the directory specified by the output.path option

		filename: config.isDebug ? '[name].build.js' : '[name].build.[hash].js',
		// TODO: Understand what this does
		// chunkFilename: '[id].[chunkhash].build.js',
		// Change the prefix for each line in the output bundles.

		// Using some kind of indentation makes bundles look more pretty, but will cause issues with multi-line strings.
		sourcePrefix: '\t'
	},

	// Compile for usage in a browser-like environment (default)
	target: 'web',

	// Choose a developer tool to enhance debugging
	// https://webpack.js.org/configuration/devtool/#devtool
	devtool: config.isDebug ? 'inline-cheap-module-source-map' : 'source-map',

	// Don't attempt to continue if there are any errors.
	// https://webpack.js.org/configuration/other-options/#bail
	bail: !config.isDebug,

	// Cache the generated webpack modules and chunks to improve build speed.
	// https://webpack.js.org/configuration/other-options/#cache
	cache: config.isDebug,

	// Specify what bundle information gets displayed
	// https://webpack.js.org/configuration/stats/
	stats: {
		// Add information about cached (not built) modules
		cached: config.isVerbose,
		// Show cached assets (setting this to `false` only shows emitted files)
		cachedAssets: config.isVerbose,
		// Add chunk information (setting this to `false` allows for a less verbose output)
		chunks: config.isVerbose,
		// Add built modules information to chunk information
		chunkModules: config.isVerbose,
		// `webpack --colors` equivalent
		colors: true,
		// Add the hash of the compilation
		hash: config.isVerbose,
		// Add built modules information
		modules: config.isVerbose,
		// Add information about the reasons why modules are included
		reasons: config.isDebug,
		// Add timing information
		timings: true,
		// Add webpack version information
		version: config.isVerbose,
	},

	module: {
		// Make missing exports an error instead of warning
		strictExportPresence: true,

		rules: [
			// Babel loader options
			{
				test: /\.js(\?[^?]*)?$/,
				include: path.resolve(__dirname, '..', config.paths.scriptsPath),
				loader: 'babel-loader',
				exclude: /(node_modules)/,
				// https://github.com/babel/babel-loader#options
				options: {
					cacheDirectory: config.isDebug,
					babelrc: true
				}
			},

			// Convert plain text into JS module
			{
				test: /\.txt$/,
				loader: 'raw-loader'
			}
		]
	},

	plugins: [
		// The DefinePlugin allows you to create global constants which can be configured at compile time
		// https://webpack.js.org/plugins/define-plugin/
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': config.isDebug ? '"development"' : '"production"',
			'process.env.BROWSER': true,
			__DEV__: config.isDebug
		}),

		// Forces webpack-dev-server program to write bundle files to the file system
		// https://github.com/gajus/write-file-webpack-plugin
		new WriteFilePlugin({
			exitOnErrors: false
		}),

		new CaseSensitivePathPlugin(),

		// Emit a file with assets paths
		// https://github.com/kossnocorp/assets-webpack-plugin#options
		new AssetsPlugin({
			path: path.resolve(__dirname, '..', config.paths.buildPath),
			filename: 'assets.json',
			prettyPrint: true
		}),

		// Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk)
		// https://webpack.js.org/plugins/commons-chunk-plugin/
		new webpack.optimize.CommonsChunkPlugin({
			name: 'commons',
			minChunks: module => /node_modules/.test(module.resource)
		}),

		...(config.isDebug ? [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoEmitOnErrorsPlugin(),
			new webpack.NamedModulesPlugin()
		] : [
			// Decrease script evaluation time
			// https://github.com/webpack/webpack/blob/master/examples/scope-hoisting/README.md
			// https://webpack.js.org/plugins/module-concatenation-plugin/
			new webpack.optimize.ModuleConcatenationPlugin(),

			// Minimize all JavaScript output of chunks
			// https://github.com/mishoo/UglifyJS2#compress-options
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: true,
				compress: {
					screw_ie8: true, // React doesn't support IE8
					warnings: config.isVerbose,
					unused: true,
					dead_code: true,
				},
				mangle: {
					screw_ie8: true,
				},
				output: {
					comments: false,
					screw_ie8: true,
				}
			})
		]),

		// Webpack Bundle Analyzer
		// https://github.com/th0r/webpack-bundle-analyzer
		...(!config.isAnalyze ? [] : [
			new BundleAnalyzerPlugin()
		])
	]
};

// Export the webpack config
module.exports = webpackConfig;
