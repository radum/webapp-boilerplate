/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const webpack = require('webpack');
const chalk = require('chalk');
const webpackConfig = require('../webpack.config');
const prettifyTime = require('../lib/prettifyTime');
const config = require('../config');

let logger;

function compilerLogger(err, stats) {
	if (err) {
		throw new Error('webpack', err);
	}

	const jsonStats = stats.toJson();
	const statColor = jsonStats.warnings.length === 0 ? chalk.green : chalk.yellow;

	if (stats.hasErrors()) {
		const error = new Error(jsonStats.errors[0]);
		error.errors = jsonStats.errors;
		error.warnings = jsonStats.warnings;

		logger.log(chalk.red(error));
		logger.log(chalk.red('Failed to build webpack'));
	} else {
		const compileTime = prettifyTime(stats.endTime - stats.startTime);

		// logger.log(statColor(stats));
		logger.log(stats.toString({ colors: true }));

		logger.log(`Compiled with ${chalk.cyan('webpack')} in ` + chalk.magenta(compileTime));
	}
}

/**
 * Bundle JS files using webpack.
 *
 * @param {Object} [options={ bsReload: undefined }] Options object
 * @returns {Promise} Compiler promise
 */
function compiler(options = { bsReload: undefined }) {
	let instance;

	logger = options.logger.scope('js-compiler');
	logger.setScopeColor(config.taskColor[0]);

	logger.start('bundle js with webpack');

	return new Promise((resolve) => {
		logger.info('running webpack');

		instance = webpack(webpackConfig, (err, stats) => {
			compilerLogger(err, stats);

			// TODO: Explore if using an EventEmitter will be better (emittery)
			// The export will have to be an object with an init and the emitter also.
			if (options.bsReload) {
				logger.info('BS reloaded');

				options.bsReload();
			}

			logger.success();

			resolve(instance);
		});
	});
}

module.exports = compiler;
