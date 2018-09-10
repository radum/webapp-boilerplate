#!/usr/bin/env node

const Emittery = require('emittery');
const figures = require('figures');
const chalk = require('chalk');
const loadEnv = require('./lib/load-env');
const cli = require('./cli');
const signale = require('./lib/signale');
const startDev = require('./run-dev');
const startBuild = require('./run-build');
const startLint = require('./run-lint');

loadEnv(process.env.NODE_ENV);

signale.config({
	displayTimestamp: true,
	logLevel: cli.flags.verbose ? 3 : 8
});

const eventBus = new Emittery();

const options = {
	logger: signale,
	eventBus
};

const catchErrors = fn => (...args) => fn(...args).catch(error => {
	if (error && error.isAppError) {
		signale.error(error);
	}

	console.error(`\n${chalk.red(figures.cross)} ${chalk.bgRedBright(`Some tasks didn't complete successfully`)}\n${error}`);

	if (cli.flags.release) {
		process.exitCode = 1;
	}
});

/**
 * CLI commands switchboard
 */
switch (cli.input[0]) {
	case 'dev':
		catchErrors(startDev)(options, cli.flags);
		break;
	case 'build':
		catchErrors(startBuild)(options, cli.flags);
		break;
	case 'lint':
		catchErrors(startLint)(options);
		break;
	case 'version':
		signale.log('{version.number}');
		break;
	default:
		catchErrors(startBuild)(options, cli.flags);
		break;
}
