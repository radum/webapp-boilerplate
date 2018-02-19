/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const Logger = require('../lib/logger');

const chalk = require('chalk');
const prettifyTime = require('../lib/prettifyTime');

let logger;

function compilerLogger(err, stats) {
	if (err) {
		throw new Error('webpack', err);
	}

	const jsonStats = stats.toJson();
	const statColor = jsonStats.warnings.length < 1 ? chalk.green : chalk.yellow;

	if (jsonStats.errors.length > 0) {
		const error = new Error(jsonStats.errors[0]);
		error.errors = jsonStats.errors;
		error.warnings = jsonStats.warnings;

		logger.log(chalk.red(error));
		logger.log(chalk.red('Failed to build webpack'));
	} else {
		const compileTime = prettifyTime(stats.endTime - stats.startTime);

		logger.log(statColor(stats));
		logger.log(`Compiled with ${chalk.cyan('webpack')} in ` + chalk.magenta(compileTime));
	}
}

/**
 * Bundle JS files using webpack.
 */
function compiler(options = { isVerbose: false, bsReload: undefined }) {
	let instance;

	logger = new Logger({
		name: 'js-compiler',
		isVerbose: options.isVerbose
	});

	logger.start('bundle js with webpack');

	return new Promise((resolve) => {
		logger.log('running webpack');

		instance = webpack(webpackConfig, (err, stats) => {
			compilerLogger(err, stats);

			// TODO: Explore if using an EventEmitter will be better
			// The export will have to be an object with an init and the emitter also.
			if (options.bsReload) {
				logger.log('BS reloaded');

				options.bsReload();
			}

			logger.done();

			resolve(instance);
		});
	});
}

module.exports = compiler;
