/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const webpack = require('webpack');
const logger = require('./lib/compileLogger');
const webpackConfig = require('./webpack.config');

/**
 * Bundle JS files using webpack.
 *
 * @param {function} callback - Gulp callback to resume the stream and complete the task.
 */
function bundleScripts(callback) {
	webpack(webpackConfig, (err, stats) => {
		logger(err, stats);

		// Callback function to run once the bundler is done.
		// This is mainliy used by gulp to resume the stream.
		callback();
	});
}

module.exports = bundleScripts;
