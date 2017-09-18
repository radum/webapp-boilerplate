/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const webpack = require('webpack');
const browserSync = require('browser-sync').create('browserSyncInstance');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');

/**
 * Init Browser Sync
 *
 * @param {object} options - options object
 * @param {object} options.port - BS port, default 3000
 * @param {object} options.proxy - BS proxy settings object
 * @param {object} options.proxy.target - BS proxy target (localhost:3000)
 */
function bs(options) {
	return new Promise((resolve) => {
		const compiler = webpack(webpackConfig);

		browserSync.init({
			proxy: {
				target: options.proxy.target,
				middleware: [
					webpackDevMiddleware(compiler, {
						publicPath: webpackConfig.output.publicPath,
						stats: webpackConfig.stats
					}),
					webpackHotMiddleware(compiler)
				],
				proxyOptions: {
					xfwd: true
				}
			},
			port: options.port || 3000
		}, resolve);
	});
}

module.exports = bs;
