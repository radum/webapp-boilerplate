const Emittery = require('emittery');
const reporter = require('./lib/reporter');
const clean = require('./tasks/clean');
const { copyStatic } = require('./tasks/copy');
const buildCSS = require('./tasks/styles-css');
const compiler = require('./tasks/compiler');
const imageResize = require('./tasks/image-resize');
const bs = require('./tasks/browser-sync');
const runServer = require('./tasks/run-server');
const watcher = require('./tasks/watcher');

/**
 * Run the dev task, compile css and js and run the local server
 * @param {Object} options - Task options object
 * @returns {Promise} - Promise object
 */
async function startDev(options) {
	const eventBus = new Emittery();
	const opts = {
		reporter,
		eventBus
	};
	const cssSettings = {
		isDebug: options.isDebug,
		sass: {
			sourceMapEmbed: options.isDebug
		}
	};

	reporter('dev').emit('log', 'starting dev');

	await clean(opts);
	await copyStatic(opts);
	await Promise.all([
		buildCSS({
			...opts,
			...cssSettings
		}),
		compiler(opts),
		imageResize(opts)
	]);
	await runServer({
		...opts,
		inspect: options.nodeInspect
	});
	await bs.init({
		eventBus: opts.eventBus,
		https: process.env.HTTPS_ENABLED,
		key: `src/ssl/${process.env.SSL_KEY_FILE_NAME}`,
		cert: `src/ssl/${process.env.SSL_CERT_FILE_NAME}`
	});

	await new watcher(['src/static/**/*.*'], { ...opts, label: 'static assets' }, () => copyStatic(opts));
	await new watcher(['src/styles/**/*.scss'], { ...opts, label: 'sass files' }, () => buildCSS({ ...opts, ...cssSettings }));
	await new watcher(['src/html/**/*.*'], { ...opts, label: 'html files' }, () => runServer({ ...opts, inspect: options.nodeInspect }));
	await new watcher(['src/server/**/*.js'], { ...opts, label: 'server files' }, () => runServer({ ...opts, inspect: options.nodeInspect }));
}

module.exports = startDev;
