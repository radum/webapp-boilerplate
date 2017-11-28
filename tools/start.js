/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const cli = require('./start-cli');
const Task = require('./start-runner');
const reporter = require('./start-reporter');

const clean = require('./tasks/clean');
const copy = require('./tasks/copy');
const stylesSass = require('./tasks/styles-sass');

const task = Task(reporter);

const copyAssets = () => task('copy-assets')(
	copy.copyStatic(),
	copy.copyServer(),
	copy.copyExtra()
);

const startDev = () => task('start-dev')(
	clean(),
	copyAssets(),
	stylesSass()
);

if (cli.command === 'run' && cli.argv.task === 'dev') {
	startDev()()
		.then(() => console.log('done!'))
		.catch(error => console.log('oops', error));
}
