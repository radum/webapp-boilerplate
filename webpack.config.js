const includes = require('array-includes')

// TODO Remove this polyfill and bump dep to Node 6
includes.shim();
includes.getPolyfill();

const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const DEBUG = global.DEBUG === false ? false : !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('-v');
const useHMR = !!global.HMR; // Hot Module Replacement (HMR)
console.log('useHMR: ' + useHMR);
const AUTOPREFIXER_BROWSERS = [
	'Android 2.3',
	'Android >= 4',
	'Chrome >= 35',
	'Firefox >= 31',
	'Explorer >= 9',
	'iOS >= 7',
	'Opera >= 12',
	'Safari >= 7.1'
];

// Webpack configuration (main.js => app/dist/main.build.js)
// http://webpack.github.io/docs/configuration.html
const config = {
	// The base directory (absolute path!) for resolving the entry option
	context: __dirname,

	// Point of entry for webpack to do its magic
	entry: [
		// The main entry point of your JavaScript application (relative to `context` above)
		'./app/scripts/main.js'
	],

	// Output will be saved in `dist/scripts` folder as per the `path` prop here
	// And the filename will be `main.build.js`. With every line of the source in the bundle prefixed with 4 spaces
	output: {
		path: path.resolve(__dirname, 'app/dist'),
		publicPath: '/dist/',
		filename: DEBUG ? '[name].build.js?[hash]' : '[name].build.[hash].js',
		chunkFilename: DEBUG ? '[id].build.js?[chunkhash]' : '[id].[chunkhash].build.js', // TODO Understand what this does
		sourcePrefix: '    '
	},

	// Compile for usage in a browser-like environment (default)
	target: 'web',

	// Choose a developer tool to enhance debugging
	// http://webpack.github.io/docs/configuration.html#devtool
	devtool: DEBUG ? 'source-map' : false,

	// Webpack module
	module: {
		// Webpack loaders
		loaders: [
			{
				// JS files loaders
				test: /\.js$/,
				loader: 'babel-loader',

				// These files will be loaded only if you import them in your entry point
				// If you create the empty index.js - only the empty index.js will be loaded and included into the bundle
				include: [
					path.resolve(__dirname, 'app'),
				],

				query: {
					// https://github.com/babel/babel-loader#options
					cacheDirectory: DEBUG,

					// https://babeljs.io/docs/usage/options/
					babelrc: false,
					presets: [
						'es2015',
					],

					// https://github.com/babel/babel-loader#babel-is-injecting-helpers-into-each-file-and-bloating-my-code
					plugins: [
						'transform-runtime'
					]
				}
			},
			{
				// Scss (Sass) files loaders, via ExtractTextPlugin to save them in a different file
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract([
					`css-loader?${JSON.stringify({ sourceMap: DEBUG, minimize: !DEBUG })}`,
					'postcss-loader?pack=sass',
					'sass-loader'
				])
			}
		]
	},

	// Webpack plugins configs
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
			__DEV__: DEBUG,
		}),

		// Emit a JSON file with assets paths
		// https://github.com/sporto/assets-webpack-plugin#options
		new AssetsPlugin({
			path: path.resolve(__dirname, './app/dist'),
			filename: 'assets.json',
			prettyPrint: true,
		}),

		// Save the extracted CSS code to this file where `[name]` is the name of the file required
		new ExtractTextPlugin('./styles/[name].css'),
    ],

	// Options affecting the resolving of modules
	resolve: {
		// The directory (absolute path) that contains your modules
		root: path.resolve(__dirname, 'app'),
		// An array of directory names to be resolved to the current directory as well as its ancestors, and searched for modules
		// This functions similarly to how node finds “node_modules” directories
		modulesDirectories: ['node_modules'],
		// An array of extensions that should be used to resolve modules
		extensions: ['', '.webpack.js', '.web.js', '.js', '.json'],
	},

	// Cache generated modules and chunks to improve performance for multiple incremental builds
	cache: DEBUG,
	// Switch loaders to debug mode
	debug: DEBUG,

	stats: {
		colors: true,
		reasons: DEBUG,
		hash: VERBOSE,
		version: VERBOSE,
		timings: true,
		chunks: VERBOSE,
		chunkModules: VERBOSE,
		cached: VERBOSE,
		cachedAssets: VERBOSE
	},

	postcss(bundler) {
		return {
			default: [
				// Transfer @import rule by inlining content, e.g. @import 'normalize.css'
				// https://github.com/postcss/postcss-import
				require('postcss-import')({ addDependencyTo: bundler }),
				// Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
				// https://github.com/robwierzbowski/node-pixrem
				require('pixrem')(),
				// Postcss flexbox bug fixer
				// https://github.com/luisrudge/postcss-flexbugs-fixes
				require('postcss-flexbugs-fixes')(),
				// Add vendor prefixes to CSS rules using values from caniuse.com
				// https://github.com/postcss/autoprefixer
				require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
			],
			sass: [
				require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
			]
		}
	}
};

// Optimize the bundle in release (production) mode
if (!DEBUG) {
	config.plugins.push(new webpack.optimize.DedupePlugin());
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: VERBOSE } }));
	config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

// Hot Module Replacement (HMR)
if (DEBUG && useHMR) {
	// This connects to the server to receive notifications when the bundle rebuilds and then updates your client bundle accordingly
	// `reload=true` will reload the entire page if webpack HMR gets stuck or the modules have not been configured to use HMR
	config.entry.unshift('webpack-hot-middleware/client?reload=true');
	config.plugins.push(new webpack.HotModuleReplacementPlugin());
	config.plugins.push(new webpack.NoErrorsPlugin());
}

// Export the webpack config
module.exports = config;
