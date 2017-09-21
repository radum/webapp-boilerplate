/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const webpack = require('webpack');
const logger = require('./lib/compileLogger');
const webpackConfig = require('./webpack.config');

/**
 * Bundle JS files using webpack.
 */
function compiler(onDone) {
	let instance;

	return new Promise((resolve) => {
		instance = webpack(webpackConfig, (err, stats) => {
			logger(err, stats);

			// TODO: Explore if using an EventEmitter will be better
			// The export will have to be an object with an init and the emitter also.
			if (onDone) {
				onDone();
			}

			resolve(instance);
		});
	});
}

module.exports = compiler;
