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
 * @param {*} opts Task options object
 * @param {*} logger Signale logger used to announce
 * @param {*} flags	CLI flags passed
 */
async function startDev(opts, logger, flags) {
	const cssSettings = {
		isDebug: !flags.release,
		sass: {
			sourceMapEmbed: !flags.release,
			bsReload: bs.bsReload
		}
	};

	logger.log('starting dev');

	await clean(opts);
	await copyStatic(opts);

	await Promise.all([
		stylesCSS({ ...opts, ...cssSettings }),
		compiler({ ...opts, bsReload: bs.bsReload })
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
	watcher(['src/styles/**/*.scss'], { ...opts, label: 'sass files' }, () => stylesCSS({ ...opts, ...cssSettings }));
	watcher(['src/html/**/*.*'], { ...opts, label: 'html files' }, () => runServer({ ...opts, inspect: flags.inspect }));
	watcher(['src/server/**/*.js'], { ...opts, label: 'server files' }, () => runServer({ ...opts, inspect: flags.inspect }));
}

module.exports = startDev;
