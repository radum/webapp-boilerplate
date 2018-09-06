#!/usr/bin/env node

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

const options = {
	logger: signale
};

const catchErrors = fn => (...args) => fn(...args).catch(error => {
	if (!error.isAppError) {
		signale.error(error);
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
