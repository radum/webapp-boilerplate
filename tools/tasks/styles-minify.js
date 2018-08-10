/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}], prefer-destructuring: 0 */

const CleanCSS = require('clean-css');
const prettyBytes = require('pretty-bytes');

/**
 * CSS minifier va CleanCSS
 *
 * @param {String} source CSS Source
 * @param {Object} options Options object
 * @returns {Promise} The return promise with the minified code and the log msg
 */
function minifyCSS(source, options) {
	return new Promise((resolve, reject) => {
		const logger = options.logger.scope('build-css', 'minify-css');
		const cleanTask = new CleanCSS({
			level: 2,
			returnPromise: true,
			sourceMap: false
		});

		logger.start('running cleancss minifier');

		cleanTask
			.minify(source)
			.then((output) => {
				const originalSize = prettyBytes(output.stats.originalSize);
				const minifiedSize = prettyBytes(output.stats.minifiedSize);
				const efficiency = output.stats.efficiency.toFixed(1).replace(/\.0$/, '');
				const timeSpent = output.stats.timeSpent;

				logger.info(`Minify CSS from ${originalSize} to ${minifiedSize} (${efficiency}% in ${timeSpent}ms)`);
				logger.success('css code minified');

				resolve({
					cssOutput: output.styles
				});
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = minifyCSS;
