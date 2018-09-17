const webpack = require('webpack');
const chalk = require('chalk');
const prettifyTime = require('../lib/prettify-time');
const TaskError = require('../lib/task-error').TaskError
const { config, webpackConfig } = require('../config');

let reporter;

/**
 * Compiler logger function that transforms the output into a readable stream of text
 * @param {Error} err - Error object in case webpack fails (these are not compilation errors)
 * @param {Object} stats - Webpack stats object that contains all information about your build
 */
function compilerLogger(err, stats) {
	if (err) {
		reporter.emit('fatal', err.name);
		reporter.emit('log', err.details);

		throw new TaskError('webpack', err);
	}

	const jsonStats = stats.toJson();

	if (stats.hasErrors()) {
		const error = new Error(jsonStats.errors[0]);
		error.errors = jsonStats.errors;
		error.warnings = jsonStats.warnings;

		reporter.emit('log', chalk.red(error));
		reporter.emit('log', chalk.red('Failed to build webpack'));
	} else {
		const compileTime = prettifyTime(stats.endTime - stats.startTime);

		reporter.emit('note', `compilation finished\n${stats.toString({ colors: true })}`);
		reporter.emit('note', `compiled with ${chalk.cyan('webpack')} in ${chalk.magenta(compileTime)}`);
	}
}

/**
 * Bundle JS files using webpack.
 * @param {Object} options object
 * @returns {Promise} Compiler promise
 */
function compiler(options) {
	let instance;

	reporter = options.reporter('js-compiler', { color: config.taskColor[0] });
	reporter.emit('start', 'bundle js with webpack');

	return new Promise((resolve) => {
		reporter.emit('info', 'running webpack');

		instance = webpack(webpackConfig, (err, stats) => {
			compilerLogger(err, stats);

			if (options.eventBus && err === null && !stats.hasErrors()) {
				options.eventBus.emit('bs:reload');
			}

			if (err === null && !stats.hasErrors()) {
				reporter.emit('done', 'webpack compilation completed');
			} else if (err !== null || stats.hasErrors()) {
				reporter.emit('error', 'error while running webpack');
			}

			resolve(instance);
		});
	});
}

module.exports = compiler;
