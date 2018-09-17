const CleanCSS = require('clean-css');
const prettyBytes = require('pretty-bytes');
const TaskError = require('../lib/task-error').TaskError
const { config } = require('../config');

/**
 * CSS minifier va CleanCSS
 * @param {String} source CSS Source
 * @param {Object} options Options object
 * @returns {Promise} The return promise with the minified code and the log msg
 */
async function minifyCSS(source, options) {
	const reporter = options.reporter('build-css', { subTask: 'minify-css', color: config.taskColor[3] });
	reporter.emit('start', 'running cleancss minifier');

	const cleanTask = new CleanCSS({
		level: 2,
		returnPromise: true,
		sourceMap: false
	});
	let output;

	try	{
		output = await cleanTask.minify(source);

		const originalSize = prettyBytes(output.stats.originalSize);
		const minifiedSize = prettyBytes(output.stats.minifiedSize);
		const efficiency = output.stats.efficiency.toFixed(1).replace(/\.0$/, '');
		const timeSpent = output.stats.timeSpent;

		reporter.emit('info', `Minify CSS from ${originalSize} to ${minifiedSize} (${efficiency}% in ${timeSpent}ms)`);
		reporter.emit('done', 'css code minified');

		return { cssOutput: output.styles };
	} catch (error) {
		reporter.emit('error', error);

		throw new TaskError(error);
	}
}

module.exports = minifyCSS;
