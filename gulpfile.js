/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

// This is used to transform this file and all the subsequent requires / imports
// Used in particular for transforming async / await
// require('babel-register');

const dir = require('require-dir');
const gulp = require('gulp');
const gulpPlugins = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();

const config = require('./tools/config');
const clean = require('./tools/clean');
const copy = require('./tools/copy');
const serve = require('./tools/serve');

// Require all tasks in `tools/gulp-tasks`, including subfolders
const tasks = dir('./tools/gulp-tasks', { recurse: true });

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
gulp.task('clean', clean);
// Gulp task: Copies static files such as robots.txt, favicon.ico to the build folder
gulp.task('copy', copy);
// Gulp task: Starts the local dev environemnt
gulp.task('serve', () => serve(blueprint));

/**
 * Prepare local structure for first run. Clear build folder, copy files, etc.
 * @type {gulp.series}
 */
const prepareTasks = gulp.series(
	clean,
	copy,
	gulp.parallel('styles', 'images')
);

// Start local dev task
gulp.task('start', gulp.series(prepareTasks, 'serve', 'watch'));

// Gulp default task runs `start`
gulp.task('default', gulp.series('start'));
