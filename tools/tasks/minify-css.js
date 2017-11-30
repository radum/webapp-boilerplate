/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const CleanCSS = require('clean-css');
const prettyBytes = require('pretty-bytes');

/**
 * Minify css files.
 *
 * @returns Promise
 */
function minifyCSS(source, options, pluginLogger) {
	return new Promise((resolve, reject) => {
		const cleanTask = new CleanCSS({
			level: 2,
			returnPromise: true,
			sourceMap: false
		});

		cleanTask
			.minify(source)
			.then((output) => {
				if (options.verbose) {
					pluginLogger(`Minify CSS from ${prettyBytes(output.stats.originalSize)} to ${prettyBytes(output.stats.minifiedSize)} (${output.stats.efficiency.toFixed(1).replace(/\.0$/, '')}% in ${output.stats.timeSpent}ms)`);
				}
				resolve(output.styles);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = minifyCSS;
