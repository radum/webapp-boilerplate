const clean = require('./tasks/clean');
const {
	copyStatic,
	copyServer,
	copySSL,
	copyExtra
} = require('./tasks/copy');
const compileSass = require('./tasks/styles-css');
const compiler = require('./tasks/compiler');
const imagemin = require('./tasks/imagemin');
const imageResize = require('./tasks/image-resize');
const compression = require('./tasks/compression');

/**
 * Run the build task, building a production ready app
 *
 * @param {*} opts Task options object
 * @param {*} logger Signale logger used to announce
 * @param {*} flags	CLI flags passed
 */
async function startBuild(opts, logger, flags) {
	logger.log('starting build');

	await clean(opts);

	await copyStatic(opts);
	await copyServer(opts);
	await copySSL(opts);
	await copyExtra(opts);

	await Promise.all([
		compileSass({
			...opts,
			isDebug: !flags.release,
			sourceMapEmbed: !flags.release
		}),
		compiler(opts),
		imagemin(opts)
	]);

	await compression(opts);
	await imageResize(opts);
}

module.exports = startBuild;
