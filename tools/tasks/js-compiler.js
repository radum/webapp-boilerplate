const webpack = require('webpack');
const chalk = require('chalk');
const prettifyTime = require('../lib/prettify-time');
const TaskError = require('../lib/task-error').TaskError
const reporter = require('../lib/reporter');
const { webpackConfig } = require('../config');

/**
 * Compiler logger function that transforms the output into a readable stream of text
 * @param {Error} err - Error object in case webpack fails (these are not compilation errors)
 * @param {Object} stats - Webpack stats object that contains all information about your build
 * @param {EventEmitter} logger - Logger event emitter
 */
function compilerLogger(err, stats, logger) {
	if (err) {
		logger.emit('fatal', err.name);
		logger.emit('log', err.details);

		throw new TaskError('webpack', err);
	}

	const jsonStats = stats.toJson();

	if (stats.hasErrors()) {
		const error = new Error(jsonStats.errors[0]);
		error.errors = jsonStats.errors;
		error.warnings = jsonStats.warnings;

		logger.emit('log', chalk.red(error));
		logger.emit('log', chalk.red('Failed to build webpack'));
	} else {
		const compileTime = prettifyTime(stats.endTime - stats.startTime);

		logger.emit('note', `compilation finished\n${stats.toString({ colors: true })}`);
		logger.emit('note', `compiled with ${chalk.cyan('webpack')} in ${chalk.magenta(compileTime)}`);
	}
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

	return new Promise((resolve) => {
		logger.emit('info', 'running webpack');

		instance = webpack(webpackConfig, (err, stats) => {
			compilerLogger(err, stats, logger);

			if (options.eventBus && err === null && !stats.hasErrors()) {
				options.eventBus.emit('bs:reload');
			}

			if (err === null && !stats.hasErrors()) {
				logger.emit('done', 'webpack compilation completed');
			} else if (err !== null || stats.hasErrors()) {
				logger.emit('error', 'error while running webpack');
			}

			resolve(instance);
		});
	});
}

module.exports = compileJS;
