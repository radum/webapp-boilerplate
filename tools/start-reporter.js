/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const EventEmitter = require('events');
const chalk = require('chalk');
const logger = require('debug');

const reporter = new EventEmitter();

logger.enable('*');

const loggers = {};

reporter.on('task:start', (params) => {
	loggers[params.taskName] = logger(params.taskName);
	loggers[params.taskName]('→ Starting');
});

reporter.on('plugin:start', (params) => {
	loggers[params.taskName + ':' + params.pluginName] = logger(params.taskName + ':' + params.pluginName);
	loggers[params.taskName + ':' + params.pluginName](chalk.yellow('❯ start'));
});

reporter.on('plugin:log', (params) => {
	loggers[params.taskName + ':' + params.pluginName](chalk.blue('› ' + params.message));
});

reporter.on('plugin:done', (params) => {
	loggers[params.taskName + ':' + params.pluginName](chalk.green('✔ done'));
});

reporter.on('plugin:error', (params) => {
	loggers[params.taskName + ':' + params.pluginName](chalk.red('✖ Plugin error'));
});

reporter.on('task:error', (params) => {
	loggers[params.taskName](chalk.red('✖ Task error'));
});

reporter.on('task:done', (params) => {
	loggers[params.taskName](chalk.green('✔ done'));
});

module.exports = reporter;
