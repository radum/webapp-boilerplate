const path = require('path');
const reporter = require('./lib/reporter');
const clean = require('./tasks/clean');
const copyStatic = require('./tasks/copy');
const copyExtra = require('./tasks/copy-extra');
const compileCSS = require('./tasks/css-compiler');
const compileJS = require('./tasks/js-compiler');
// const imagemin = require('./tasks/imagemin');
// const imageResize = require('./tasks/image-resize');
// const compression = require('./tasks/compression');
const { config } = require('./config');

/**
 * Run the build task, building a production ready app
 * @param {Object} options - Task options object
 * @returns {Promise} - Promise object
 */
async function startBuild(options) {
	reporter('build').emit('log', 'starting build');

	await clean([`${config.paths.buildPath}/*`], { reporter });

	// To preserve folder structure, CPY needs `cwd` to be passed.
	const cpy = { cwd: path.join(process.cwd(), config.paths.srcPath), parents: true };
	const absoluteBuildPath = path.join(process.cwd(), config.paths.buildPath);

	await Promise.all([
		copyStatic({ taskName: 'copy:static', src: 'static/**/*', dest: absoluteBuildPath, cpy }),
		copyStatic({ taskName: 'copy:server', src: 'server/**/*', dest: absoluteBuildPath, cpy }),
		copyStatic({ taskName: 'copy:server-template', src: 'html/**/*', dest: absoluteBuildPath, cpy }),
		copyStatic({ taskName: 'copy:ssl', src: 'ssl/**/*', dest: absoluteBuildPath, cpy })
	]);

	await copyExtra();

	await Promise.all([
		compileCSS(config.paths.stylesEntryPoint, {
			isDebug: options.isDebug,
			sass: {
				sourceMapEmbed:	options.isDebug
			}
		}),
		compileJS(),
		// TODO: Add it back
		// imagemin(opts)
	]);
	// TODO: Add it back
	// await compression(opts);
	// await imageResize(opts);
}

module.exports = startBuild;
