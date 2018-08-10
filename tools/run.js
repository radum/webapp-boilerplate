#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const cli = require('./cli');
const signale = require('./lib/signale');
const startDev = require('./run-dev');
const startBuild = require('./run-build');
const startLint = require('./run-lint');

// Load .env files based on the rules defined in the docs
// TODO: This env loading stuff should stay in a module
dotenv.load({ path: path.resolve(process.cwd(), '.env') });
dotenv.load({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });
if (fs.existsSync(path.resolve(process.cwd(), '.env.local'))) { dotenv.load({ path: '.env.local' }); }
if (fs.existsSync(path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}.local`))) { dotenv.load({ path: `.env.${process.env.NODE_ENV}.local` }); }

signale.config({
	displayTimestamp: true,
	logLevel: cli.flags.verbose ? 3 : 8
});

const options = {
	logger: signale
};

const catchErrors = fn => (...args) => fn(...args).catch(error => signale.fatal(error));

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
