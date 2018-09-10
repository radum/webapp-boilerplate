const clean = require('./tasks/clean');
const {
	copyStatic,
	copyServer,
	copySSL,
	copyExtra
} = require('./tasks/copy');
const buildCSS = require('./tasks/styles-css');
const compiler = require('./tasks/compiler');
const imagemin = require('./tasks/imagemin');
const imageResize = require('./tasks/image-resize');
const compression = require('./tasks/compression');

/**
 * Run the build task, building a production ready app
 *
 * @param {Object} options Task options object
 * @param {Function} options.logger Task global logger
 * @param {Object} flags CLI flags passed
 */
async function startBuild(options, flags) {
	const taskOpts = { logger: options.logger };

	options.logger.log('starting build');

	await clean(taskOpts);
	await copyStatic(taskOpts);
	await copyServer(taskOpts);
	await copySSL(taskOpts);
	await copyExtra(taskOpts);
	await Promise.all([
		buildCSS({
			...taskOpts,
			isDebug: !flags.release,
			sass: { sourceMapEmbed: !flags.release }
		}),
		compiler(taskOpts),
		imagemin(taskOpts)
	]);
	await compression(taskOpts);
	await imageResize(taskOpts);
}

module.exports = startBuild;
