const clean = require('./tasks/clean');
const { copyStatic } = require('./tasks/copy');
const buildCSS = require('./tasks/styles-css');
const compiler = require('./tasks/compiler');
const imageResize = require('./tasks/image-resize');
const bs = require('./tasks/browser-sync');
const runServer = require('./tasks/run-server');
const watcher = require('./tasks/watch');

/**
 * Run the dev task, compile css and js and run the local server
 * @param {Object} options - Task options object
 * @param {Function} options.logger - Signale logger used to announce
 * @param {Object} flags - CLI flags passed
 */
async function startDev(options, flags) {
	const opts = {
		logger: options.logger
	};
	const cssSettings = {
		isDebug: !flags.release,
		sass: {
			sourceMapEmbed: !flags.release,
			bsReload: bs.bsReload
		}
	};

	options.logger.log('starting dev');

	await clean(opts);
	await copyStatic(opts);
	await Promise.all([
		buildCSS({
			...opts,
			...cssSettings
		}),
		compiler({ ...opts, bsReload: bs.bsReload }),
		imageResize(opts)
	]);
	await runServer({
		...opts,
		inspect: flags.inspect
	});
	await bs.init({
		https: process.env.HTTPS_ENABLED,
		key: `src/ssl/${process.env.SSL_KEY_FILE_NAME}`,
		cert: `src/ssl/${process.env.SSL_CERT_FILE_NAME}`
	});

	watcher(['src/static/**/*.*'], { ...opts, label: 'static assets' }, () => copyStatic(opts));
	watcher(['src/styles/**/*.scss'], { ...opts, label: 'sass files' }, () => buildCSS({ ...opts, ...cssSettings }));
	watcher(['src/html/**/*.*'], { ...opts, label: 'html files' }, () => runServer({ ...opts, inspect: flags.inspect }));
	watcher(['src/server/**/*.js'], { ...opts, label: 'server files' }, () => runServer({ ...opts, inspect: flags.inspect }));
}

module.exports = startDev;
