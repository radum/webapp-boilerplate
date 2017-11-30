/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const path = require('path');
const sass = require('node-sass');
const fs = require('../lib/fs');
const minifyCss = require('./minify-css');
const config = require('../config');
const { plugin } = require('../start-runner');

const compileSass = plugin('compile-styles')(options => async ({ log }) => {
	let cssOutput;

	return new Promise((resolve, reject) => {
		sass.render({
			file: config.paths.stylesEntryPoint,
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.'],
			sourceMapContents: true,
			sourceMapEmbed: options.sourceMapEmbed || false
		}, async (err, result) => {
			if (err) {
				reject(err);
			} else {
				try {
					await fs.makeDir(path.resolve(config.paths.stylesOutputDest));

					if (config.isDebug) {
						cssOutput = result.css;
					} else {
						cssOutput = await minifyCss(result.css, { verbose: true }, log);
					}

					await fs.writeFile(path.resolve(config.paths.stylesOutputDest + '/main.css'), cssOutput);

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
