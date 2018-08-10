const clean = require('./tasks/clean');
const { copyStatic } = require('./tasks/copy');
const stylesCSS = require('./tasks/styles-css');
const compiler = require('./tasks/compiler');
const bs = require('./tasks/browserSync');
const runServer = require('./tasks/run-server');
const watcher = require('./tasks/watch');

/**
 * Run the dev task, compile css and js and run the local server
 *
 * @param {Object} options Task options object
 * @param {Function} options.logger Signale logger used to announce
 * @param {Object} flags CLI flags passed
 */
async function startDev(options, flags) {
	const taskOpts = { logger: options.logger };
	const cssSettings = {
		isDebug: !flags.release,
		sass: {
			sourceMapEmbed: !flags.release,
			bsReload: bs.bsReload
		}
	};

	options.logger.log('starting dev');

	await clean(taskOpts);
	await copyStatic(taskOpts);

	await Promise.all([
		stylesCSS({ ...taskOpts, ...cssSettings }),
		compiler({ ...taskOpts, bsReload: bs.bsReload })
	]);

	await runServer({
		...taskOpts,
		inspect: flags.inspect
	});

	await bs.init({
		https: process.env.HTTPS_ENABLED,
		key: `src/ssl/${process.env.SSL_KEY_FILE_NAME}`,
		cert: `src/ssl/${process.env.SSL_CERT_FILE_NAME}`
	});

	watcher(['src/static/**/*.*'], { ...taskOpts, label: 'static assets' }, () => copyStatic(taskOpts));
	watcher(['src/styles/**/*.scss'], { ...taskOpts, label: 'sass files' }, () => stylesCSS({ ...taskOpts, ...cssSettings }));
	watcher(['src/html/**/*.*'], { ...taskOpts, label: 'html files' }, () => runServer({ ...taskOpts, inspect: flags.inspect }));
	watcher(['src/server/**/*.js'], { ...taskOpts, label: 'server files' }, () => runServer({ ...taskOpts, inspect: flags.inspect }));
}

module.exports = startDev;
