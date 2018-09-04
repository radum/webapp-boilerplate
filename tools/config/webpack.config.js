/* eslint prefer-destructuring: 0 */

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SizePlugin = require('size-plugin');
const Jarvis = require('webpack-jarvis');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const aliases = require('./aliases.config');

module.exports = function (config) {
	let cwd = process.cwd();

	// Webpack configuration (main.js => main.build.js)
	// http://webpack.github.io/docs/configuration.html
	return {
		// The base directory, an absolute path, for resolving entry points and loaders from configuration
		context: path.resolve(process.cwd()),

		// Point of entry for webpack to do its magic
		entry: {
			// Usual entry location: './src/client/main.js'
			main: './' + config.paths.scriptsEntryPoint,
			about: './src/client/pages/about.js',

			// This is used to auto reload the browser when the code changes. We don't have a watch and webpack complile repeat task.
			// The hot middleware handles the browser reload for us.
			// Only used in dev mode and reload automaticaly if webpack is stuck
			// https://github.com/glenjamin/webpack-hot-middleware
			// ...(config.isDebug ? ['webpack-hot-middleware/client?name=client&reload=true&noInfo=false'] : [])
		},

		// Output will be saved in `build/static/scripts` folder as per the `path` prop here
		// And the filename will be `main.build.js`. With every line of the source in the bundle prefixed with 1 tab
		output: {
			// The output directory as an absolute path
			path: path.resolve(cwd, config.paths.scriptsOutputDest),

			// This option specifies the public URL of the output directory when referenced in a browser
			publicPath: config.paths.scriptsPublicPath,

			// Include comments in bundles with information about the contained modules
			pathinfo: config.isDebug,

			// The name of each output bundle. The bundle is written to the directory specified by the output.path option
			// Name of the bundled file/s.
			// [hash] - applies hash of a webpack build, so every file will have same hash
			// [chunkhash] - applies hash to every file separately
			// filename: config.isDebug ? '[name].build.js' : '[name].build.[hash].js',
			filename: config.isDebug ? '[name].build.js' : '[name].build.[chunkhash:8].js',

			// Name of non-entry chunk files
			// https://webpack.js.org/configuration/output/#output-chunkfilename
			chunkFilename: config.isDebug ? '[name].build.js' : '[name].build.[chunkhash:8].js',

			// Change the prefix for each line in the output bundles.
			// Using some kind of indentation makes bundles look more pretty, but will cause issues with multi-line strings.
			// sourcePrefix: '\t',

			// Point sourcemap entries to original disk location (format as URL on Windows)
			// In devtools sources tab, the original files will not appear under webpack.
			// They will appear in the main url root next to styles.
			devtoolModuleFilenameTemplate: (info) => {
				if (config.isDebug) {
					return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
				}

				return path.relative(config.paths.scriptsPath, info.absoluteResourcePath).replace(/\\/g, '/');
			},
		},

		// Production Mode enables all sorts of optimizations
		// This includes, minification, scope hoisting, tree-shaking,
		// side-effect - free module pruning,
		// and includes plugins you would have to manually use like NoEmitOnErrorsPlugin
		// Development Mode optimized for speed and developer experience
		// automatically include features like path names in your bundle output, eval-source-maps,
		// that are meant for easy-to-read code, and fast build times
		// https://webpack.js.org/concepts/mode/
		mode: config.isDebug ? 'development' : 'production',

		watch: !config.isProd && config.isDebug,
		watchOptions: {
			ignored: /node_modules/
		},

		// Choose a developer tool to enhance debugging
		// https://webpack.js.org/configuration/devtool/#devtool
		devtool: config.isDebug ? 'inline-cheap-module-source-map' : 'source-map',

		// Don't attempt to continue if there are any errors.
		// https://webpack.js.org/configuration/other-options/#bail
		bail: !config.isDebug,

		// Cache the generated webpack modules and chunks to improve build speed.
		// https://webpack.js.org/configuration/other-options/#cache
		cache: config.isDebug,

		module: {
			// Make missing exports an error instead of warning
			strictExportPresence: true,

			rules: [
				// Babel loader options
				{
					test: /\.js(\?[^?]*)?$/,
					include: path.resolve(cwd, config.paths.scriptsPath),
					loader: 'babel-loader',
					exclude: /(node_modules)/,
					// https://github.com/babel/babel-loader#options
					options: {
						cacheDirectory: config.isDebug,
					},
				},

				// Convert plain text into JS module
				{
					test: /\.txt$/,
					loader: 'raw-loader',
				},
			],
		},

		// https://webpack.js.org/configuration/optimization/#optimization-runtimechunk
		// optimization.runtimeChunk: true adds an additonal chunk to each entrypoint containing only the runtime (each entry file gets its own runtime file)
		// optimization.runtimeChunk: 'single' is to be used if there is only 1 entry file or you want only one runtime (all entry files get one runtime file)
		optimization: {
			runtimeChunk: 'single',
			splitChunks: {
				// This option enables smart code splitting. With it, webpack would extract the vendor code if it gets larger than 30 kB
				// (before minification and gzip). It would also extract the common code – this is useful if your build produces several bundles
				// (e.g. if you split your app into routes).
				chunks: 'all',
				cacheGroups: {
					vendors: {
						name: 'chunk-vendors',
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
						chunks: 'initial'
					},
					common: {
						name: 'chunk-common',
						// Minimum number of chunks that must share a module before splitting.
						minChunks: 2,
						// The priority of the `common` groups are negative so any `vendors` cache group takes higher priority (default 0).
						priority: -20,
						chunks: 'initial',
						reuseExistingChunk: true
					}
				}
			},
			// https://github.com/webpack-contrib/uglifyjs-webpack-plugin/issues/349
			minimizer: [new TerserPlugin({
				sourceMap: true,
				cache: true,
				parallel: true,
				terserOptions: {
					output: {
						comments: /@license/i
					}
				},
				extractComments: true
			})]
		},

		resolve: {
			// Create aliases to import or require certain modules more easily, for example:
			// `@design': './../src/styles/main.scss` and the we can import like this:
			// `import '@design';` which will import the main.scss from above using the right path
			alias: aliases.webpack,
			// A list of additional resolve plugins which should be applied
			plugins: [
				// Normally, Webpack looks for index file when the path passed to require points to a directory;
				// which means there may have a lot of index files.
				// This plugin makes it possible to control what file within directory will be treated as entry file.
				// https://www.npmjs.com/package/directory-named-webpack-plugin
				new DirectoryNamedWebpackPlugin(true)
			]
		},

		plugins: [
			// The DefinePlugin allows you to create global constants which can be configured at compile time
			// https://webpack.js.org/plugins/define-plugin/
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': config.isDebug ? '"development"' : '"production"',
				'process.env.BROWSER': true,
				__BROWSER__: true,
				__DEV__: config.isDebug,
				__SENTRY_DSN_URL__: JSON.stringify(config.SENTRY_DSN_URL)
			}),

			// Forces webpack-dev-server program to write bundle files to the file system
			// https://github.com/gajus/write-file-webpack-plugin
			new WriteFilePlugin({
				exitOnErrors: false,
			}),

			// Generate a manifest file which contains a mapping of all asset filenames
			// to their corresponding output file so that tools can pick it up.
			new ManifestPlugin({
				fileName: '../../asset-manifest.json', // Save the file outside of `static/scripts` folder as it is relative to the compiler output path
				filter: (file) => {
					return file.name.indexOf('.map') < 0;
				},
			}),

			// https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
			// The GenerateSW plugin will create a service worker file for you and add it to the webpack asset pipeline.
			new GenerateSW({
				globDirectory: path.resolve(cwd, config.paths.staticAssetsOutput),
				globPatterns: ['**/*.{html,js,css}'],
				swDest: path.join(path.resolve(cwd, config.paths.staticAssetsOutput), 'sw.js'),
			}),

			// Prints the gzipped sizes of your webpack assets and the changes since the last build.
			// https://github.com/GoogleChromeLabs/size-plugin
			new SizePlugin(),

			...(config.isDebug
				? [
					// Enables Hot Module Replacement, otherwise known as HMR
					// Should never be used in PROD. For each small change will add change or remove
					// modules (tiny js files), while the app is running. This will help to retain app state, etc.
					// https://webpack.js.org/concepts/hot-module-replacement/
					new webpack.HotModuleReplacementPlugin(),

					// Watcher doesn't work well if you mistype casing in a path so we use
					// a plugin that prints an error when you attempt to do this.
					// See https://github.com/facebookincubator/create-react-app/issues/240
					new CaseSensitivePathsPlugin(),
				]
				: [
					// NamedModulesPlugin leaks path (suited for DEV)
					// Will cause hashes to be based on the relative path of the module,
					// generating a four character string as the module id
					new webpack.HashedModuleIdsPlugin()
				]),

			// Webpack Bundle Analyzer
			// https://github.com/th0r/webpack-bundle-analyzer
			...(!config.isAnalyze
				? []
				: [
					new BundleAnalyzerPlugin(),
					new Jarvis({
						port: 1337,
					}),
				]),
		],

		// Some libraries import Node modules but don't use them in the browser.
		// Tell Webpack to provide empty mocks for them so importing them works.
		node: {
			dgram: 'empty',
			fs: 'empty',
			net: 'empty',
			tls: 'empty',
			child_process: 'empty',
		},

		// Turn off performance hints during development because we don't do any
		// splitting or minification in interest of speed. These warnings become
		// cumbersome.
		performance: {
			hints: !config.isProd && config.isDebug ? false : 'warning'
		}
	};
}
