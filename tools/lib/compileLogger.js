/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const gutil = require('gulp-util');
const prettifyTime = require('./prettifyTime');

// TODO: Remove `gulp-util` dependency
// https://github.com/gulpjs/gulp/blob/4.0/docs/API.md#gulptaskname-fn
// https://github.com/gulpjs/undertaker#usage
// We can use a promise in the main `scripts.js` task to handle the error.
// Gulp function tasks will work if the function returns a promise.
// And we can reject if there are any errors, simulating `gutil.PluginError`.
function compileLogger(err, stats) {
	if (err) {
		throw new gutil.PluginError('webpack', err);
	}

	const jsonStats = stats.toJson();
	let statColor = jsonStats.warnings.length < 1 ? 'green' : 'yellow';

	if (jsonStats.errors.length > 0) {
		const error = new Error(jsonStats.errors[0]);
		error.errors = jsonStats.errors;
		error.warnings = jsonStats.warnings;
		statColor = 'red';


		gutil.log(gutil.colors[statColor](error));
		gutil.log('Failed to build', gutil.colors.cyan('webpack'));
	} else {
		const compileTime = prettifyTime(stats.endTime - stats.startTime);
		gutil.log(gutil.colors[statColor](stats));
		gutil.log('Compiled with', gutil.colors.cyan('webpack'), 'in', gutil.colors.magenta(compileTime));
	}
}

module.exports = compileLogger;
