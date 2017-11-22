/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const cli = require('./start-cli');
const Task = require('./start-runner');
const Plugin = require('./start-runner').plugin;
const reporter = require('./start-reporter');

const clean = require('./tasks/clean');
const copy = require('./tasks/copy');
const stylesSass = require('./tasks/styles-sass');

const task = Task(reporter);

const start = task('start')(
	Plugin('clean-task')(clean),
	// Plugin('copy-task:static')(copy.copyStatic),
	// Plugin('compile-styles')(stylesSass)
);

if (cli.command === 'run' && cli.argv.task === 'dev') {
	start()
		.then(() => console.log('done!'))
		.catch(error => console.log('oops', error));
}
