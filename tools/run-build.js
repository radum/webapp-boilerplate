const reporter = require('./lib/reporter');
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
 * @param {Object} options - Task options object
 * @returns {Promise} - Promise object
 */
async function startBuild(options) {
	const opts = {
		reporter
	};

	reporter('build').emit('log', 'starting build');

	await clean(opts);
	await copyStatic(opts);
	await copyServer(opts);
	await copySSL(opts);
	await copyExtra(opts);
	await Promise.all([
		buildCSS({
			...opts,
			isDebug: options.isDebug,
			sass: {
				sourceMapEmbed:	options.isDebug
			}
		}),
		compiler(opts),
		imagemin(opts)
	]);
	await compression(opts);
	await imageResize(opts);
}

module.exports = startBuild;
