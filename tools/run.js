#!/usr/bin/env node
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const cli = require('./cli');
const clean = require('./tasks/clean');
const {
	copyStatic,
	copyServer,
	copySSL,
	copyExtra
} = require('./tasks/copy');
const compileSass = require('./tasks/styles-sass');
const compiler = require('./tasks/compiler');
const bs = require('./tasks/browserSync');
const runServer = require('./tasks/runServer');
const watcher = require('./tasks/watch');
const imagemin = require('./tasks/imagemin');
const stylesLint = require('./tasks/styles-lint');
const jsLint = require('./tasks/js-lint');
const signale = require('./lib/signale');

signale.config({
	displayTimestamp: true,
	logLevel: cli.flags.verbose ? 3 : 8
});

const taskOpts = {
	logger: signale
};

async function startDev(flags) {
	const sassOpts = {
		isDebug: !flags.release,
		sourceMapEmbed: !flags.release,
		bsReload: bs.bsReload
	};

	signale.log('starting dev');

	try {
		await clean(taskOpts);
		await copyStatic(taskOpts);
		await Promise.all([
			compileSass({ ...taskOpts, ...sassOpts }),
			compiler({ ...taskOpts, bsReload: bs.bsReload })
		]);
		await runServer({ ...taskOpts, inspect: flags.inspect });
		// TODO: This should be behind a flag if BS doesn't work for both in the same time
		await bs.init({ https: false });

		watcher(['src/static/**/*.*'], taskOpts, () => copyStatic(taskOpts));
		watcher(['src/styles/**/*.scss'], taskOpts, () => compileSass({ ...taskOpts, ...sassOpts }));
	} catch (error) {
		// TODO: Standardise this for all plugins
		signale.fatal(error);
	}
}

async function startBuild(flags) {
	signale.log('starting build');

	await clean(taskOpts);
	await copyStatic(taskOpts);
	await copyServer(taskOpts);
	await copySSL(taskOpts);
	await copyExtra(taskOpts);
	await Promise.all([
		compileSass({
			...taskOpts,
			isDebug: !flags.release,
			sourceMapEmbed: !flags.release
		}),
		compiler(taskOpts),
		imagemin(taskOpts)
	]);
}

async function startLint() {
	signale.log('starting lint');

	await Promise.all([
		stylesLint(taskOpts),
		jsLint(taskOpts)
	]);
}

/**
 * CLI commands switchboard
 */
switch (cli.input[0]) {
	case 'dev':
		startDev(cli.flags);
		break;
	case 'build':
		startBuild(cli.flags);
		break;
	case 'lint':
		startLint(cli.flags);
		break;
	case 'version':
		console.log('{version.number}');
		break;
	default:
		startBuild(cli.flags);
		break;
}
