const path = require('path');
const Emittery = require('emittery');
const reporter = require('./lib/reporter');
const clean = require('./tasks/clean');
const copyStatic = require('./tasks/copy');
const compileCSS = require('./tasks/css-compiler');
const compileJS = require('./tasks/js-compiler');
// const imageResize = require('./tasks/image-resize');
const bs = require('./tasks/browser-sync');
const runServer = require('./tasks/run-server');
const watcher = require('./tasks/watcher');
const { config } = require('./config');

/**
 * Run the dev task, compile css and js and run the local server
 * @param {Object} options - Task options object
 * @returns {Promise} - Promise object
 */
async function startDev(options) {
	const eventBus = new Emittery();

	reporter('dev').emit('log', 'starting dev');

	await clean([`${config.paths.buildPath}/*`], { reporter });
	await copyStatic({
		taskName: 'copy:static',
		src: 'static/**/*',
		dest: path.join(process.cwd(), config.paths.buildPath),
		cpy: {
			cwd: path.join(process.cwd(), config.paths.srcPath),
			parents: true
		}
	});

	await Promise.all([
		compileCSS(config.paths.stylesEntryPoint, config.paths.stylesOutputDest, {
			isDebug: options.isDebug,
			eventBus,
			buildPath: config.paths.buildPath,
			sass: {
				sourceMapEmbed:	options.isDebug
			}
		}),
		compileJS({ eventBus }),
		// TODO: Add it back
		// imageResize(opts)
	]);

	await runServer({ inspect: options.nodeInspect });
	await bs.init({
		eventBus,
		https: process.env.HTTPS_ENABLED,
		key: `src/ssl/${process.env.SSL_KEY_FILE_NAME}`,
		cert: `src/ssl/${process.env.SSL_CERT_FILE_NAME}`
	});

	// TODO: Add it back
	// await new watcher(['src/static/**/*.*'], { ...opts, label: 'static assets' }, () => copyStatic(opts));
	await new watcher([`${config.paths.srcPath}/styles/**/*.scss`], { label: 'sass files' }, () => {
		return compileCSS(config.paths.stylesEntryPoint, config.paths.stylesOutputDest, {
			isDebug: options.isDebug,
			eventBus,
			buildPath: config.paths.buildPath,
			sass: {
				sourceMapEmbed:	options.isDebug
			}
		});
	});
	await new watcher(['src/html/**/*.*'], { label: 'html files' }, () => runServer({ inspect: options.nodeInspect }));
	await new watcher(['src/server/**/*.js'], { label: 'server files' }, () => runServer({ inspect: options.nodeInspect }));
}

module.exports = startDev;
