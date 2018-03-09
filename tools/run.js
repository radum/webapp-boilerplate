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

async function startDev(flags) {
	const defaultSettings = {
		isDebug: !flags.release,
		sourceMapEmbed: !flags.release,
		bsReload: bs.bsReload
	};

	try {
		await clean();
		await copyStatic();
		await Promise.all([
			compileSass(defaultSettings),
			compiler({ bsReload: bs.bsReload })
		]);
		await runServer();
		await bs.init({ https: true });

		watcher(['src/static/**/*.*'], copyStatic);
		watcher(['src/styles/**/*.scss'], () => compileSass(defaultSettings));
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

switch (cli.input[0]) {
	case 'dev':
		startDev(cli.flags);
		break;
	case 'build':
		startBuild(cli.flags);
		break;
	default:
		startBuild(cli.flags);
		break;
}
