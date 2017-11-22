/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const yargs = require('yargs');

// TODO:
// - https://github.com/SamVerschueren/listr
// - https://github.com/sindresorhus/ora
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

module.exports = {
	command,
	argv
};
