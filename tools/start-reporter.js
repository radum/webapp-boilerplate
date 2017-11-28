/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// const EventEmitter = require('events');
const Emittery = require('emittery');

const chalk = require('chalk');
const logger = require('debug');
const ora = require('ora');
const figures = require('figures');
const indentString = require('indent-string');
const humanizeMs = require('ms');

// const reporter = new EventEmitter();
const reporter = new Emittery();

logger.enable('*');

const loggers = {};

reporter.on('task:start', (params) => {
	// loggers[params.taskName] = {
	// 	logger: logger(params.taskName),
	// 	totalTime: +new Date()
	// };
	// loggers[params.taskName].logger(chalk.yellow(`${figures.arrowRight} Starting`));
	loggers[params.taskName] = ora('params.taskName Starting').start();
});

reporter.on('plugin:start', (params) => {
	loggers[params.taskName].logger(
		indentString(params.pluginName + ' ' + chalk.yellow('start'), 2)
	);
});

reporter.on('plugin:log', (params) => {
	loggers[params.taskName].logger(params.pluginName + ' ' + chalk.blue(`${figures.pointerSmall}` + params.message));
});

reporter.on('plugin:done', (params) => {
	loggers[params.taskName].logger(params.pluginName + ' ' + chalk.green(`${figures.tick} done`));
});

reporter.on('plugin:error', (params) => {
	loggers[params.taskName].logger(params.pluginName + ' ' + chalk.red(`${figures.cross} Plugin error`));
});

reporter.on('task:error', (params) => {
	loggers[params.taskName].logger(params.pluginName + ' ' + chalk.red(`${figures.cross} Task error`));
});

reporter.on('task:done', (params) => {
	loggers[params.taskName].logger(chalk.green(`${figures.tick} done`) + ' ' + humanizeMs(new Date() - loggers[params.taskName].totalTime));
});

module.exports = reporter;
