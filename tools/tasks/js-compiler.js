const webpack = require('webpack');
const chalk = require('chalk');
const prettifyTime = require('../lib/prettify-time');
const reporter = require('../lib/reporter');
const { webpackConfig } = require('../config');

/**
 * Compiler logger function that transforms the output into a readable stream of text
 * @param {Error} error - Error object in case webpack fails (these are not compilation errors)
 * @param {Object} stats - Webpack stats object that contains all information about your build
 * @param {EventEmitter} logger - Logger event emitter
 * @returns {Object} Error object or nothing if there is no error
 */
function compilerLogger(error, stats, logger) {
	if (error) {
		logger.emit('fatal', chalk.red(`${error.name} ${error.message}`));
		logger.emit('log', error.details);

		return error;
	}

	const jsonStats = stats.toJson();

	if (stats.hasErrors()) {
		const compilerError = new Error(jsonStats.errors[0]);
		compilerError.errors = jsonStats.errors;
		compilerError.warnings = jsonStats.warnings;

		logger.emit('log', chalk.red(compilerError));
		logger.emit('log', chalk.red('Failed to build webpack'));
	} else {
		const compileTime = prettifyTime(stats.endTime - stats.startTime);

		logger.emit('note', `compilation finished\n${stats.toString({ colors: true })}`);
		logger.emit('note', `compiled with ${chalk.cyan('webpack')} in ${chalk.magenta(compileTime)}`);
	}

	return stats;
}

/**
 * Bundle JS files using webpack.
 * @param {Object} options object
 * @returns {Promise} Compiler promise
 */
function compileJS(options = {}) {
	const taskName = options.label || 'js-compiler';
	const taskColor = options.taskColor || '#00a8e8;'
	const logger = reporter(taskName, { color: taskColor });

	let instance;

	logger.emit('start', 'bundle js with webpack');

	return new Promise((resolve, reject) => {
		logger.emit('info', 'running webpack');

		instance = webpack(webpackConfig, (error, stats) => {
			compilerLogger(error, stats, logger);

			if (options.eventBus && error === null && !stats.hasErrors()) {
				options.eventBus.emit('bs:reload');
			}

			if (error === null && !stats.hasErrors()) {
				logger.emit('done', 'webpack compilation completed');
			} else if (error !== null || stats.hasErrors()) {
				logger.emit('error', 'error while running webpack');

				reject(new Error('webpack error'));
			}

			resolve(instance);
		});
	});
}

module.exports = compileJS;
