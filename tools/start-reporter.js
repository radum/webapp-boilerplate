/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// const EventEmitter = require('events');
const Emittery = require('emittery');

const chalk = require('chalk');
// const logger = require('debug');
// const ora = require('ora');
const figures = require('figures');
const indentString = require('indent-string');
const humanizeMs = require('ms');
const timestamp = require('time-stamp');

function getTimestamp() {
	return '[' + chalk.grey(timestamp('HH:mm:ss')) + ']';
}
// const reporter = new EventEmitter();
const reporter = new Emittery();

// logger.enable('*');

const tasks = {};
const plugins = {};

reporter.on('task:start', (params) => {
	// loggers[params.taskName].logger(chalk.yellow(`${figures.arrowRight} Starting`));

	tasks[params.taskName] = {
		totalTime: +new Date()
	};

	console.log(getTimestamp() + ' ' + chalk.blue(params.taskName) + ' ' + chalk.yellow(`${figures.arrowRight} Starting`));
});

reporter.on('plugin:start', (params) => {
	// loggers[params.taskName].logger(indentString(params.pluginName + ' ' + chalk.yellow('start'), 2));

	plugins[params.pluginName] = {
		totalTime: +new Date()
	};

	console.log(getTimestamp() + ' ' + indentString(figures.pointer + ' ' + chalk.magentaBright(params.pluginName) + ' ' + chalk.yellow(`${figures.arrowRight} Starting`), 0));
});

reporter.on('plugin:log', (params) => {
	// loggers[params.taskName].logger(params.pluginName + ' ' + chalk.blue(`${figures.pointerSmall}` + params.message));
	console.log(getTimestamp() + ' ' + indentString(figures.pointer + ' ' + chalk.magentaBright(params.pluginName) + ' ' + chalk.yellow(`${figures.pointerSmall} ${params.message}`), 0));
});

reporter.on('plugin:done', (params) => {
	// loggers[params.taskName].logger(params.pluginName + ' ' + chalk.green(`${figures.tick} done`));
	console.log(getTimestamp() + ' ' + indentString(figures.pointer + ' ' + chalk.magentaBright(params.pluginName) + ' ' + chalk.green(`${figures.tick} done`) + ' ' + chalk.gray(humanizeMs(new Date() - plugins[params.pluginName].totalTime)), 0));
});

reporter.on('plugin:error', (params) => {
	// loggers[params.taskName].logger(params.pluginName + ' ' + chalk.red(`${figures.cross} Plugin error`));
	console.log(getTimestamp() + ' ' + indentString(figures.pointer + ' ' + chalk.magentaBright(params.pluginName) + ' ' + chalk.red(`${figures.cross} Plugin error`), 0));
});

reporter.on('task:error', (params) => {
	// loggers[params.taskName].logger(params.pluginName + ' ' + chalk.red(`${figures.cross} Task error`));
	console.log(getTimestamp() + ' ' + chalk.blue(params.taskName) + ' ' + chalk.red(`${figures.cross} Task error`));
});

reporter.on('task:done', (params) => {
	// loggers[params.taskName].logger(chalk.green(`${figures.tick} done`) + ' ' + humanizeMs(new Date() - loggers[params.taskName].totalTime));
	console.log(getTimestamp() + ' ' + chalk.blue(params.taskName) + ' ' + chalk.green(`${figures.tick} done`) + ' ' + chalk.gray(humanizeMs(new Date() - tasks[params.taskName].totalTime)));
});

module.exports = reporter;
