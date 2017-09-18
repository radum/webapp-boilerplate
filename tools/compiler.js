/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const webpack = require('webpack');
const logger = require('./lib/compileLogger');
const webpackConfig = require('./webpack.config');

/**
 * Bundle JS files using webpack.
 */
function compiler() {
	let instance;

	return new Promise((resolve) => {
		instance = webpack(webpackConfig, (err, stats) => {
			logger(err, stats);

			resolve(instance);
		});
	});
}

module.exports = compiler;
