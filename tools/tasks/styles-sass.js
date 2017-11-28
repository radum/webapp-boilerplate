/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const path = require('path');
const sass = require('node-sass');
const CleanCSS = require('clean-css');
const fs = require('../lib/fs');
const config = require('../config');
const { plugin } = require('../start-runner');

const minify = (input, options) => new CleanCSS({
	level: 2,
	sourceMap: true
}).minify(input).styles;

const compileSass = plugin('compile-styles')(options => async ({ log }) => {
	return new Promise((resolve, reject) => {
		sass.render({
			file: config.paths.stylesEntryPoint,
			outputStyle: 'expanded',
			precision: 10
		}, async (err, result) => {
			if (err) {
				reject(err);
			} else {
				try {
					await fs.makeDir(path.resolve(config.paths.stylesOutputDest));
					await fs.writeFile(path.resolve(config.paths.stylesOutputDest + '/main.css'), result.css);

					log('styles compiled');
				} catch (error) {
					reject(error);
				}

				resolve(result);
			}
		});
	});
});

module.exports = compileSass;
