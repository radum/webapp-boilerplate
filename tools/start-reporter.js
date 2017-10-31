/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const EventEmitter = require('events');
const chalk = require('chalk');
const logger = require('debug');

const reporter = new EventEmitter();

// Reporter Object
// task - start { name: 'test', plugins: [''] }
// task - start { name: 'build', plugins: ['clean'] }
// plugin - start { name: 'clean' }
// plugin - log { name: 'clean', message: 'Cleaning path -> build' }
// plugin - error { name: 'clean', error: ErrObj }
// plugin - done { name: 'clean' }

logger.enable('*');

const loggers = {};

reporter.on('task-start', (params) => {
	loggers[params.name] = logger(params.name);
	loggers[params.name]('→ Starting');
});

reporter.on('plugin-start', (params) => {
	loggers[params.name] = logger(params.name);
	loggers[params.name](chalk.yellow('❯ start'));
});

reporter.on('plugin-log', (params) => {
	loggers[params.name](chalk.blue('› ' + params.message));
});

reporter.on('plugin-done', (params) => {
	loggers[params.name](chalk.green('✔ done'));
});

reporter.on('plugin-error', (params) => {
	loggers[params.name](chalk.red('✖ Plugin error'));
});


module.exports = reporter;
