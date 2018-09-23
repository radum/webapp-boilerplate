#!/usr/bin/env node

const figures = require('figures');
const chalk = require('chalk');
const StackUtils = require('stack-utils');
const loadEnv = require('./lib/load-env');
const cli = require('./cli');
const startDev = require('./run-dev');
const startBuild = require('./run-build');
const startLint = require('./run-lint');

loadEnv(process.env.NODE_ENV);

const catchErrors = fn => (...args) => fn(...args).catch(error => {
	const stackUtils = new StackUtils({
		cwd: process.cwd(),
		internals: StackUtils.nodeInternals()
	})
	const stack = stackUtils.clean(error.stack)

	if (error.isAppError && error.errorType === 'task') {
		console.error(`\n${chalk.red(figures.cross)} ${chalk.bgRedBright(`Some tasks didn't complete successfully`)}`);
	} else {
		console.error(`\n${chalk.red(figures.cross)} ${chalk.bgRedBright(`There was an error`)}`);
		console.error(error);
		console.error(`\n${chalk.red(stack)}`);
	}

	if (cli.flags.release) {
		process.exitCode = 1;
	}
});

/**
 * CLI commands switchboard
 */
switch (cli.input[0]) {
	case 'dev':
		catchErrors(startDev)({
			isDebug: !cli.flags.release,
			nodeInspect: cli.flags.inspect,
			loagLevel: cli.flags.verbose ? 3 : 8
		});
		break;
	case 'build':
		catchErrors(startBuild)({
			isDebug: !cli.flags.release,
			loagLevel: cli.flags.verbose ? 3 : 8
		});
		break;
	case 'lint':
		catchErrors(startLint)();
		break;
	case 'version':
		console.log('{version.number}');
		break;
	default:
		catchErrors(startBuild)({
			isDebug: !cli.flags.release,
			loagLevel: cli.flags.verbose ? 3 : 8
		});
		break;
}
