/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// TODO:
// - https://github.com/SamVerschueren/listr

const EventEmitter = require('events');
const logger = require('debug')('worker:a');
const Task = require('./start-runner');
const Plugin = require('./start-runner').plugin;
const clean = require('./clean');

const reporter = new EventEmitter();

logger.enabled = true;
logger('name');

reporter.on('task-start', params => console.log('task-start', params));
reporter.on('plugin-start', params => console.log('plugin-start', params));
reporter.on('plugin-log', params => console.log('plugin-log', params));
reporter.on('plugin-done', params => console.log('plugin-done', params));
reporter.on('plugin-error', params => console.log('plugin-error', params));

const task = Task(reporter);

const build = () => task('build')(
	Plugin('clean', opts => clean(opts))
);

const test = () => task('test')(build());

test()()
	.then(() => console.log('done!'))
	.catch(error => console.log('oops', error));
