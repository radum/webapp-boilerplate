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
const config = require('./config');

// Independent task functions that will be used as Gulp taks
const clean = require('./clean');
const copy = require('./copy');
const compiler = require('./compiler');
const bs = require('./browserSync');
const runServer = require('./runServer');
const minifyCss = require('./minify-css');

// Gulp specific tasks via gulp plugins.
// Require all tasks in `tools/gulp-tasks`, including subfolders
const tasks = dir('./gulp-tasks', { recurse: true });

// Gulp tasks main config
const blueprint = Object.assign({}, config, {
	minifyCss
});

/**
 * Create a gulp task from each file in `/tools/gulp-tasks` folder
 * @type {Function}
 */
Object.keys(tasks).forEach((taskName) => {
	gulp.task(taskName, done => tasks[taskName](gulp, gulpPlugins, blueprint, done));
});

// Create a Gulp task out of each file used (useful for running them via gulp run process)
// Gulp task: Deletes non esential resources like the build folder
gulp.task('clean-task', clean);
// Gulp task: Copies static files such as robots.txt, favicon.ico to the build folder
gulp.task('copy-task-static', copy.copyStatic);
gulp.task('copy-task-server', copy.copyServer);
gulp.task('copy-task-extra', copy.copyExtra);
// Gulp task: Bundles the JS code
gulp.task('compiler-task', () => compiler(bs.bsReload));
// Gulp task: Starts the local Express server
gulp.task('run-server-task', runServer);
// Gulp task: Starts the local dev environemnt
gulp.task('browser-sync-task', bs.init);
// Gulp task: Reloads BS
gulp.task('browser-sync-reload-task', (done) => { bs.bsReload(done); });

/**
 * Prepare local structure for first run. Clear build folder, copy files, etc.
 * @type {gulp.series}
 */
const startTask = gulp.series(
	'clean-task',
	'copy-task-static',
	gulp.parallel('styles', 'imagemin', 'compiler-task'),
	'run-server-task',
	'browser-sync-task',
	'watch'
);

const buildTask = gulp.series(
	'clean-task',
	gulp.parallel(
		'copy-task-static', 'copy-task-server', 'copy-task-extra',
		'styles',
		'imagemin',
		'compiler-task'
	)
);

// Log environment status information
gutil.log('Gulp ENV status', gutil.colors.cyan('isDebug'), gutil.colors.magenta(config.isDebug));
gutil.log('Gulp ENV status', gutil.colors.cyan('isProd'), gutil.colors.magenta(config.isProd));
gutil.log('Gulp ENV status', gutil.colors.cyan('isVerbose'), gutil.colors.magenta(config.isVerbose));

// Start local dev task
gulp.task('start', gulp.series(startTask));

// Build the app
gulp.task('build', gulp.series(buildTask));

// Gulp default task runs `start`
gulp.task('default', gulp.series('start'));
