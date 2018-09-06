const path = require('path');
const sass = require('node-sass'); // TODO: use dart Sass?
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssReporter = require('postcss-reporter');
const indentString = require('indent-string');
const humanizeMs = require('ms');
const chalk = require('chalk');
const revHash = require('rev-hash');
const fs = require('../lib/fs');
const { config } = require('../config');
const minifyCss = require('./styles-minify');

/**
 * Formats a Sass error object and returns an new Error object
 *
 * @param {Object} error Sass object error
 * @returns {Error} New formated Error object
 */
function sassFormatError(error) {
	let relativePath = '';
	const filePath = error.file;

	let message = '';

	relativePath = path.relative(process.cwd(), filePath);

	message += [chalk.underline(relativePath), error.formatted].join('\n');

	error.messageFormatted = indentString(chalk.redBright(message), 11);
	error.messageOriginal = error.message;

	error.relativePath = relativePath;

	return error;
}

function compileSass(options) {
	const logger = options.logger.scope('build-css', 'compile-sass');
	logger.setScopeColor(config.taskColor[3]);

	logger.start('compiling sass files');

	return new Promise((resolve, reject) => {
		sass.render({
			file: config.paths.stylesEntryPoint,
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.'],
			sourceMapContents: true,
			sourceMapEmbed: options.sourceMapEmbed || false
		}, (err, result) => {
			if (err) {
				const errorObj = sassFormatError(err);

				reject(new Error(errorObj.messageFormatted));
			} else {
				logger.info('styles entry point ' + result.stats.entry.split(process.cwd())[1]);
				logger.debug('included files', result.stats.includedFiles);

				if (options.bsReload) {
					logger.info('BS reloaded');
					options.bsReload();
				}

				logger.success('styles compiled' + chalk.gray(` (${humanizeMs(result.stats.duration)})`));

				resolve(result.css);
			}
		});
	});
}

function postCSSTransform(cssInput, options) {
	const logger = options.logger.scope('build-css', 'postcss');
	const plugins = [
		postcssCustomProperties,
		autoprefixer,
		postcssReporter
	];
	const settings = {
		// Without `from` option PostCSS could generate wrong source map and will not find Browserslist config.
		// Set it to CSS file path or to `undefined` to prevent this warning. So far works OK.
		from: undefined,
		map: {
			inline: options.sourceMapEmbed,
		}
	};

	logger.start('running postcss');

	return postcss(plugins).process(cssInput, settings);
}

async function writeFileToDisk(cssOutput, opts) {
	const outputHash = opts.isDebug ? 'dev' : revHash(cssOutput);
	const manifestContent = `{
	"${config.paths.stylesEntryPoint}": "/styles/${config.paths.stylesOutputFile}.${outputHash}.css"
}`;

	await fs.writeFile(path.resolve(config.paths.buildPath + `/asset-manifest-style.json`), manifestContent);

	return fs.writeFile(path.resolve(config.paths.stylesOutputDest + `/${config.paths.stylesOutputFile}.${outputHash}.css`), cssOutput);
}

async function buildCSS(options) {
	const logger = options.logger.scope('build-css');
	logger.setScopeColor(config.taskColor[3]);

	const sassDefaultOpts = {
		isVerbose: false,
		isDebug: true,
		bsReload: undefined,
		logger
	};
	let cssOutput;

	logger.start('running css build steps');

	// Create output folder if missing
	await fs.makeDir(path.resolve(config.paths.stylesOutputDest));

	// Compile CSS steps
	cssOutput = await compileSass({ ...sassDefaultOpts, ...options.sass });
	const postCSSOutput = await postCSSTransform(cssOutput, { sourceMapEmbed: options.sass.sourceMapEmbed, logger });
	cssOutput = postCSSOutput.css;

	if (!options.isDebug) {
		const minifyResponse = await minifyCss(cssOutput, { verbose: true, logger });
		cssOutput = minifyResponse.cssOutput;
	}

	// Write the output to disk
	await writeFileToDisk(cssOutput, { isDebug: sassDefaultOpts.isDebug });

	logger.success('css build done');
}

module.exports = buildCSS;
