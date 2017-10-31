/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// TODO:
// - https://github.com/SamVerschueren/listr
// - https://github.com/sindresorhus/ora

const yargs = require('yargs');

const Task = require('./start-runner');
const Plugin = require('./start-runner').plugin;
const reporter = require('./start-reporter');

const clean = require('./tasks/clean');
const copy = require('./tasks/copy');

const task = Task(reporter);

const start = task('start')(
	Plugin('clean-task', opts => clean(opts)),
	Plugin('copy-task:static', opts => copy.copyStatic(opts)),
);

yargs
	.usage('Usage: $0 <command> [options]')
	.command({
		command: 'run <task>',
		desc: 'Run tasks (dev, build, release)'
	})
	.example('$0 run dev --verbose', 'Run dev env using verbose output')
	.alias('v', 'verbose')
	.recommendCommands()
	.demandCommand(1, 'You need at least one command before moving on')
	.help('h')
	.version()
	.alias('h', 'help');

const { argv } = yargs;
const command = argv._[0];

if (command === 'run' && argv.task === 'dev') {
	start()
		.then(() => console.log('done!'))
		.catch(error => console.log('oops', error));
}
