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
const TaskError = require('../lib/task-error').TaskError
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

	error.messageFormatted = indentString(chalk.redBright(message), 0);
	error.messageOriginal = error.message;

	error.relativePath = relativePath;

	return error;
}

/**
 * Compile SASS to CSS using `node-sass`
 * @param {Object} options - Options object
 * @returns {Promise} Promise object
 */
function compileSass(options) {
	const reporter = options.reporter('build-css', { subTask: 'compile-sass', color: config.taskColor[3] });

	reporter.emit('start', 'compiling sass files');

	return new Promise((resolve, reject) => {
		sass.render({
			file: config.paths.stylesEntryPoint,
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.'],
			sourceMapContents: true,
			sourceMapEmbed: options.sass.sourceMapEmbed || false
		}, (err, result) => {
			if (err) {
				const errorObj = sassFormatError(err);

				reject(new Error(errorObj.messageFormatted));
			} else {
				if (options.eventBus) {
					options.eventBus.emit('bs:reload');
				}

				reporter.emit('info', 'styles entry point ' + result.stats.entry.split(process.cwd())[1]);
				reporter.emit('debug', {
					message: 'included files',
					data: result.stats.includedFiles
				});
				reporter.emit('done', `styles compiled ${chalk.gray(humanizeMs(result.stats.duration))}`);

				resolve(result.css);
			}
		});
	});
}

/**
 * Run PostCSS transform on the CSS output
 * @param {String} cssInput - CSS string input
 * @param {Object} options - Options object
 * @returns {Promise} Promise object
 */
function postCSSTransform(cssInput, options) {
	const reporter = options.reporter('build-css', { subTask: 'postcss', color: config.taskColor[3] });
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
			inline: false
		}
	};

	reporter.emit('start', 'running postcss');

	return postcss(plugins).process(cssInput, { ...settings, ...options.postcss });
}

/**
 * Write file to disk with the CSS output and revision the filename
 * @param {String} cssOutput - CSS output
 * @param {Object} options - Options object
 * @returns {Promise} Promise object
 */
function writeFileToDisk(cssOutput, options) {
	const outputHash = options.isDebug ? 'dev' : revHash(cssOutput);
	const manifestContent = `{
	"${config.paths.stylesEntryPoint}": "/styles/${config.paths.stylesOutputFile}.${outputHash}.css"
}`;

	options.reporter.emit('info', `writing ${options.isDebug ? 'dev' : 'production'} files to disk`)

	return Promise.all([
		fs.writeFile(path.resolve(config.paths.buildPath + `/asset-manifest-style.json`), manifestContent),
		fs.writeFile(path.resolve(config.paths.stylesOutputDest + `/${config.paths.stylesOutputFile}.${outputHash}.css`), cssOutput)
	]);
}

/**
 * Run all CSS transformation tasks. SASS, PostCSS, etc, and the write and revsion the output to disk
 * @param {Object} options - Options object
 * @returns {Promise} Promise object
 */
async function buildCSS(options) {
	const reporter = options.reporter('build-css', { color: config.taskColor[3] });

	reporter.emit('start', 'running css build steps');

	try {
		// Compile CSS steps
		let cssOutput = await compileSass({
			isDebug: options.isDebug,
			eventBus: options.eventBus,
			reporter: options.reporter,
			sass: {
				sourceMapEmbed: options.sass.sourceMapEmbed
			}
		});
		// PostCSS transform SASS output
		const postCSSOutput = await postCSSTransform(cssOutput, {
			reporter: options.reporter,
			postcss: {
				map: {
					inline: options.sourceMapEmbed,
				}
			}
		});
		cssOutput = postCSSOutput.css;

		// Minify content if build is run with release flag
		if (!options.isDebug) {
			const minifyResponse = await minifyCss(cssOutput, { reporter: options.reporter });
			cssOutput = minifyResponse.cssOutput;
		}

		// Create output folder and write results to output files
		await fs.makeDir(path.resolve(config.paths.stylesOutputDest));
		await writeFileToDisk(cssOutput, {
			isDebug: options.isDebug,
			reporter
		});

		reporter.emit('done', 'css build done');
	} catch (error) {
		reporter.emit('error', error);

		throw new TaskError(error);
	}
}

module.exports = buildCSS;
