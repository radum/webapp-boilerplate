/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const CleanCSS = require('clean-css');

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
					pluginLogger(`Minify CSS from ${output.stats.originalSize} to ${output.stats.minifiedSize} (${output.stats.efficiency} in ${output.stats.timeSpent}ms)`);
				}
				resolve(output.styles);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = minifyCSS;
