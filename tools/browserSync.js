/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');

/**
 * Initialize BrowserSync and start local dev server.
 * The main based dir / root directory for the server will be the build folder.
 * Weback middleware will also start compiling assets on the fly.
 *
 * @param {object} browserSync - BrowserSync instance. This is created in gulpfile.js.
 */
function bs(browserSync) {
	const compiler = webpack(webpackConfig);

	browserSync.init({
		server: {
			baseDir: 'build'
		},
		middleware: [
			webpackDevMiddleware(compiler, {
				publicPath: webpackConfig.output.publicPath,
				stats: 'errors-only'
			}),
			webpackHotMiddleware(compiler)
		]
	});
}

module.exports = bs;
