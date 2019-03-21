#!/usr/bin/env node

const figures = require('figures');
const chalk = require('chalk');
const StackUtils = require('stack-utils');
const loadEnv = require('./lib/load-env');
const cli = require('./cli');
const runDev = require('./run-dev');
const runBuild = require('./run-build');
const runLint = require('./run-lint');

loadEnv(process.env.NODE_ENV);

const catchErrors = fn => (...args) => fn(...args).catch(error => {
	const stackUtils = new StackUtils({
		cwd: process.cwd(),
		internals: StackUtils.nodeInternals()
	})
	const stack = stackUtils.clean(error.stack)

	// Log task specific errors. These are task specific errors like invald params passed or invalid data sent.
	// or log generic errors tiggered by 3rd party non task specific code.
	if (error.isAppError && error.errorType === 'task') {
		console.error(`\n${chalk.red(figures.cross)} ${chalk.bgRedBright(`There was a task error`)}`);
		console.error(error);
		console.error(`\n${chalk.red(stack)}`);
	} else {
		console.error(`\n${chalk.red(figures.cross)} ${chalk.bgRedBright(`There was an error`)}`);
		console.error(error);
		console.error(`\n${chalk.red(stack)}`);
	}

	// Exit process if we are in `release` mode so that the build pipelie fails hard with a proper exit code.
	if (cli.flags.release) {
		process.exitCode = 1;
	}
});

/**
 * CLI commands switchboard
 */
switch (cli.input[0]) {
	case 'dev':
		catchErrors(runDev)({
			isDebug: !cli.flags.release,
			nodeInspect: cli.flags.inspect,
			logLevel: cli.flags.verbose ? 3 : 8
		});
		break;
	case 'build':
		catchErrors(runBuild)({
			isDebug: !cli.flags.release,
			logLevel: cli.flags.verbose ? 3 : 8
		});
		break;
	case 'lint':
		catchErrors(runLint)();
		break;
	case 'version':
		console.log('{version.number}');
		break;
	default:
		catchErrors(runBuild)({
			isDebug: !cli.flags.release,
			logLevel: cli.flags.verbose ? 3 : 8
		});
		break;
}
