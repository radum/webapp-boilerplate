/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const chalk = require('chalk');
const prettifyTime = require('./prettifyTime');

// TODO: Remove `gulp-util` dependency
// https://github.com/gulpjs/gulp/blob/4.0/docs/API.md#gulptaskname-fn
// https://github.com/gulpjs/undertaker#usage
// We can use a promise in the main `scripts.js` task to handle the error.
// Gulp function tasks will work if the function returns a promise.
// And we can reject if there are any errors, simulating `gutil.PluginError`.
function compilerLogger(err, stats, pluginLogger) {
	if (err) {
		throw new Error('webpack', err);
	}

	const jsonStats = stats.toJson();
	const statColor = jsonStats.warnings.length < 1 ? chalk.green : chalk.yellow;

	if (jsonStats.errors.length > 0) {
		const error = new Error(jsonStats.errors[0]);
		error.errors = jsonStats.errors;
		error.warnings = jsonStats.warnings;

		pluginLogger(chalk.red(error));
		pluginLogger(chalk.red('Failed to build webpack'));
	} else {
		const compileTime = prettifyTime(stats.endTime - stats.startTime);

		pluginLogger(statColor(stats));
		pluginLogger(`Compiled with ${chalk.cyan('webpack')} in ` + chalk.magenta(compileTime));
	}
}

module.exports = compilerLogger;
