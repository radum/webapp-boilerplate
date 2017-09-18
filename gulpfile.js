/* eslint-env node */
/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

// This is used to transform this file and all the subsequent requires / imports
// Used in particular for transforming async / await
// require('babel-register');

// Node module requirements
const dir = require('require-dir');
const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpPlugins = require('gulp-load-plugins')();

// ENV main config object
const config = require('./tools/config');

// Independent task functions that will be used as Gulp taks
const clean = require('./tools/clean');
const copy = require('./tools/copy');
const compiler = require('./tools/compiler');
const bs = require('./tools/browserSync');

// Gulp specific tasks via gulp plugins.
// Require all tasks in `tools/gulp-tasks`, including subfolders
const tasks = dir('./tools/gulp-tasks', { recurse: true });

// Gulp tasks main config
const blueprint = Object.assign({}, config);

/**
 * Create a gulp task from each file in `/tools/gulp-tasks` folder
 * @type {Function}
 */
Object.keys(tasks).forEach((taskName) => {
	gulp.task(taskName, done => tasks[taskName](gulp, gulpPlugins, blueprint, done));
});

// TODO: Check if this is really needed, we can run without converting them to a gulp task
// Create a Gulp task out of each file used
// Gulp task: Deletes non esential resources like the build folder
gulp.task('clean', clean);
// Gulp task: Copies static files such as robots.txt, favicon.ico to the build folder
gulp.task('copy', copy);
// Gulp task: Bundles the JS code
// gulp.task('compiler', compiler);
// Gulp task: Starts the local dev environemnt
gulp.task('browserSyncTask', () => bs({
	proxy: {
		target: 'localhost:3000'
	},
	port: 3001
}));

/**
 * Prepare local structure for first run. Clear build folder, copy files, etc.
 * @type {gulp.series}
 */
const start = gulp.series(
	clean,
	copy,
	gulp.parallel('styles'),
	'browserSyncTask'
);

// Log environment status information
gutil.log('ENV status', gutil.colors.cyan('isDebug'), gutil.colors.magenta(config.isDebug));
gutil.log('ENV status', gutil.colors.cyan('isProd'), gutil.colors.magenta(config.isProd));
gutil.log('ENV status', gutil.colors.cyan('isVerbose'), gutil.colors.magenta(config.isVerbose));

// Start local dev task
gulp.task('start', gulp.series(start));

// Gulp default task runs `start`
gulp.task('default', gulp.series('start'));
