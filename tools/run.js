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

async function startDev(flags) {
	await clean();
	await copyStatic();
	await compileSass({
		isDebug: !flags.release,
		sourceMapEmbed: !flags.release
	});
	await compiler({ bsReload: bs.bsReload });
}

async function startBuild(flags) {
	await clean();
	await copyStatic();
	await copyServer();
	await copySSL();
	await copyExtra();
	await compileSass({
		isDebug: !flags.release,
		sourceMapEmbed: !flags.release
	});
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
