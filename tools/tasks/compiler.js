const webpack = require('webpack');
const chalk = require('chalk');
const prettifyTime = require('../lib/prettify-time');
const { config, webpackConfig } = require('../config');

let logger;

/**
 * Compiler logger function that transforms the output into a readable stream of text
 * @param {Error} err - Error object in case webpack fails (these are not compilation errors)
 * @param {Object} stats - Webpack stats object that contains all information about your build
 */
function compilerLogger(err, stats) {
	if (err) {
		logger.fatal(err.name);
		logger.log(err.details);

		throw new Error('webpack', err);
	}

	const jsonStats = stats.toJson();

	if (stats.hasErrors()) {
		const error = new Error(jsonStats.errors[0]);
		error.errors = jsonStats.errors;
		error.warnings = jsonStats.warnings;

		logger.log(chalk.red(error));
		logger.log(chalk.red('Failed to build webpack'));
	} else {
		const compileTime = prettifyTime(stats.endTime - stats.startTime);

		logger.log(stats.toString({ colors: true }));
		logger.log(`Compiled with ${chalk.cyan('webpack')} in ` + chalk.magenta(compileTime));
	}
}

/**
 * Bundle JS files using webpack.
 *
 * @param {Object} options object
 * @returns {Promise} Compiler promise
 */
function compiler(options) {
	let instance;

	logger = options.logger.scope('js-compiler');
	logger.setScopeColor(config.taskColor[0]);
	logger.start('bundle js with webpack');

	return new Promise((resolve) => {
		logger.info('running webpack');

		instance = webpack(webpackConfig, (err, stats) => {
			compilerLogger(err, stats);

			if (options.eventBus && err === null && !stats.hasErrors()) {
				options.eventBus.emit('bs:reload');
			}

			if (err === null && !stats.hasErrors()) {
				logger.success();
			} else if (err !== null || stats.hasErrors()) {
				logger.error();
			}

			resolve(instance);
		});
	});
}

module.exports = compiler;
