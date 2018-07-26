/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const path = require('path');
// TODO: use dart Sass?
const sass = require('node-sass');
const humanizeMs = require('ms');
const chalk = require('chalk');
const fs = require('../lib/fs');
const minifyCss = require('./minify-css');
const config = require('../config');

const defaultOpts = {
	isVerbose: false,
	isDebug: true,
	bsReload: undefined
};

// TODO: Standardise this for all plugins
function formatError(error) {
	let relativePath = '';
	const filePath = error.file;

	let message = '';

	relativePath = path.relative(process.cwd(), filePath);

	message += (relativePath) + '\n';
	message += error.formatted;

	error.messageFormatted = message;
	error.messageOriginal = error.message;
	error.message = message;

	error.relativePath = relativePath;

	return error.messageFormatted;
}

async function compileSass(options) {
	const opts = { ...defaultOpts, ...options };

	const logger = options.logger.scope('compile-sass');

	let cssOutput;

	logger.start('compiling sass files');

	return new Promise((resolve, reject) => {
		sass.render({
			file: config.paths.stylesEntryPoint,
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.'],
			sourceMapContents: true,
			sourceMapEmbed: opts.sourceMapEmbed || false
		}, async (err, result) => {
			if (err) {
				reject(formatError(err));
			} else {
				try {
					await fs.makeDir(path.resolve(config.paths.stylesOutputDest));

					if (opts.isDebug) {
						cssOutput = result.css;
					} else {
						const minifyResponse = await minifyCss(result.css, { verbose: true });

						cssOutput = minifyResponse.cssOutput;

						logger.info(minifyResponse.logMsg);
					}

					await fs.writeFile(path.resolve(config.paths.stylesOutputDest + '/main.css'), cssOutput);

					resolve(cssOutput);

					logger.info('styles entry point ' + result.stats.entry.split(process.cwd())[1]);
					logger.debug('included files', result.stats.includedFiles);
					logger.success('styles compiled' + chalk.gray(` (${humanizeMs(result.stats.duration)})`));

					// TODO: Explore if using an EventEmitter will be better
					// The export will have to be an object with an init and the emitter also.
					if (options.bsReload) {
						logger.info('BS reloaded');

						options.bsReload();
					}
				} catch (error) {
					reject(formatError(error));
				}

				resolve(result);
			}
		});
	});
}

module.exports = compileSass;
