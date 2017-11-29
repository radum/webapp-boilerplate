/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const webpack = require('webpack');
const compilerLogger = require('../lib/compilerLogger');
const webpackConfig = require('../webpack.config');
const { plugin } = require('../start-runner');

/**
 * Bundle JS files using webpack.
 */
const compiler = plugin('js-compiler')(options => ({ log }) => {
	let instance;

	return new Promise((resolve) => {
		log('running webpack');

		instance = webpack(webpackConfig, (err, stats) => {
			compilerLogger(err, stats, log);

			// TODO: Explore if using an EventEmitter will be better
			// The export will have to be an object with an init and the emitter also.
			if (options.bsReload) {
				log('BS reloaded');

				options.bsReload();
			}

			resolve(instance);
		});
	});
});

module.exports = compiler;
