/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}], prefer-destructuring: 0 */

const CleanCSS = require('clean-css');
const prettyBytes = require('pretty-bytes');

/**
 * Minify css files.
 *
 * @returns Promise
 */
function minifyCSS(source) {
	return new Promise((resolve, reject) => {
		const cleanTask = new CleanCSS({
			level: 2,
			returnPromise: true,
			sourceMap: false
		});

		cleanTask
			.minify(source)
			.then((output) => {
				const originalSize = prettyBytes(output.stats.originalSize);
				const minifiedSize = prettyBytes(output.stats.minifiedSize);
				const efficiency = output.stats.efficiency.toFixed(1).replace(/\.0$/, '');
				const timeSpent = output.stats.timeSpent;

				resolve({
					cssOutput: output.styles,
					logMsg: `Minify CSS from ${originalSize} to ${minifiedSize} (${efficiency}% in ${timeSpent}ms)`
				});
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = minifyCSS;
