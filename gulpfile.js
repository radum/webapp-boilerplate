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
const browserSync = require('browser-sync').create();

// ENV main config object
const config = require('./tools/config');

// Independent task functions that will be used as Gulp taks
const clean = require('./tools/clean');
const copy = require('./tools/copy');
const browserSyncTask = require('./tools/browserSync');
const scripts = require('./tools/scripts');

// Gulp specific tasks via gulp plugins.
// Require all tasks in `tools/gulp-tasks`, including subfolders
const tasks = dir('./tools/gulp-tasks', { recurse: true });

// Gulp tasks main config
const blueprint = Object.assign({}, config, {
	browserSync
});

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
gulp.task('clean', done => clean(done));
// Gulp task: Copies static files such as robots.txt, favicon.ico to the build folder
gulp.task('copy', done => copy(done));
// Gulp task: Starts the local dev environemnt
gulp.task('browserSync', done => browserSyncTask(browserSync, done));
// Gulp task: Bundles the JS code
gulp.task('scripts', done => scripts(done));

/**
 * Prepare local structure for first run. Clear build folder, copy files, etc.
 * @type {gulp.series}
 */
const prepareTasks = gulp.series(
	clean,
	copy,
	gulp.parallel('styles'),
	'browserSync'
);

// Log environment status information
gutil.log('ENV status', gutil.colors.cyan('isDebug'), gutil.colors.magenta(config.isDebug));
gutil.log('ENV status', gutil.colors.cyan('isProd'), gutil.colors.magenta(config.isProd));
gutil.log('ENV status', gutil.colors.cyan('isVerbose'), gutil.colors.magenta(config.isVerbose));

// Start local dev task
gulp.task('start', gulp.series(prepareTasks));

// Gulp default task runs `start`
gulp.task('default', gulp.series('start'));
