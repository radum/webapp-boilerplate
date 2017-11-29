/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const cli = require('./start-cli');
const Task = require('./start-runner');
const reporter = require('./start-reporter');

const clean = require('./tasks/clean');
const { copyStatic, copyServer, copyExtra } = require('./tasks/copy');
const compiler = require('./tasks/compiler');
const bs = require('./tasks/browserSync');
const stylesSass = require('./tasks/styles-sass');
const runServer = require('./tasks/runServer');

const config = require('./config');

const task = Task(reporter);

const copyAllAssets = () => task('copy-assets')(
	copyStatic(),
	copyServer(),
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

if (cli.command === 'run' && cli.argv.task === 'dev') {
	startDev()()
		.then(() => console.log(''))
		.catch(error => console.log('oops', error));
}
