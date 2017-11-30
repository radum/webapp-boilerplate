/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const cli = require('./start-cli');
const Task = require('./start-runner');
const reporter = require('./start-reporter');

const clean = require('./tasks/clean');
const { copyStatic, copyServer, copySSL, copyExtra } = require('./tasks/copy');
const compiler = require('./tasks/compiler');
const bs = require('./tasks/browserSync');
const stylesSass = require('./tasks/styles-sass');
const runServer = require('./tasks/runServer');

const config = require('./config');

const task = Task(reporter);

const copyAllAssets = () => task('copy-assets')(
	copyStatic(),
	copyServer(),
	copySSL(),
	copyExtra()
);

const startDev = () => task('start-dev')(
	clean(),
	copyStatic(),
	stylesSass({
		sourceMapEmbed: config.isDebug
	}),
	compiler({
		bsReload: bs.bsReload
	}),
	runServer(),
	bs.init({
		https: true
	})
);

const startBuild = () => task('start-build')(
	clean(),
	copyAllAssets(),
	stylesSass({
		sourceMapEmbed: config.isDebug
	}),
	compiler({
		bsReload: bs.bsReload
	})
);

if (cli.command === 'run') {
	switch (cli.argv.task) {
		case 'dev':
			startDev()()
				.then(() => console.log(''))
				.catch(error => console.log('oops', error));
			break;
		case 'build':
			startBuild()();
			break;
		default:
			startBuild()();
			break;
	}
}
