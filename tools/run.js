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

async function startDev(flags) {
	const taskOpts = {
		signale
	};

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
			compileSass(sassOpts),
			compiler({ signale, bsReload: bs.bsReload })
		]);
		await runServer({ inspect: flags.inspect });
		await bs.init({ https: true });

		watcher(['src/static/**/*.*'], copyStatic);
		watcher(['src/styles/**/*.scss'], () => compileSass(sassOpts));
	} catch (error) {
		// TODO: Standardise this for all plugins
		console.log(error);
	}
}

async function startBuild(flags) {
	await clean();
	await copyStatic();
	await copyServer();
	await copySSL();
	await copyExtra();
	await Promise.all([
		compileSass({
			isDebug: !flags.release,
			sourceMapEmbed: !flags.release
		}),
		compiler(),
		imagemin()
	]);
}

async function startLint() {
	await Promise.all([
		stylesLint(),
		jsLint()
	]);
}

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
