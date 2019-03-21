const util = require('util');
const path = require('path');
const sass = require('sass');
const Fiber = require('fibers');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssColorMod = require('postcss-color-mod-function');
const postcssReporter = require('postcss-reporter');
const indentString = require('indent-string');
const humanizeMs = require('ms');
const chalk = require('chalk');
const revHash = require('rev-hash');
const fs = require('../lib/fs');
const TaskError = require('../lib/task-error').TaskError
const reporter = require('../lib/reporter');
const cssMinify = require('./css-minify');

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
async function compileSass(options) {
	const logger = reporter(options.taskName, { subTaskName: options.subTaskName, color: options.taskColor });
	const sassOptions = {
		file: options.entryPoint,
		outputStyle: 'expanded',
		includePaths: ['.'],
		sourceMapContents: true,
		sourceMapEmbed: options.sass.sourceMapEmbed || false,
		fiber: Fiber, // This increases perf for render https://github.com/sass/dart-sass#javascript-api
		...options.sass
	}
	const render = util.promisify(sass.render);

	logger.emit('start', 'compiling sass files');

	try {
		const result = await render(sassOptions);

		if (options.eventBus) {
			options.eventBus.emit('bs:reload');
		}

		logger.emit('info', 'styles entry point ' + result.stats.entry.split(process.cwd())[1]);
		logger.emit('debug', {
			message: 'included files',
			data: result.stats.includedFiles
		});
		logger.emit('done', `styles compiled ${chalk.gray(humanizeMs(result.stats.duration))}`);

		return result.css;
	} catch (error) {
		const errorObj = sassFormatError(error);

		throw new Error(errorObj.messageFormatted);
	}
}

/**
 * Run PostCSS transform on the CSS output
 * @param {String} cssInput - CSS string input
 * @param {Object} options - Options object
 * @returns {Promise} Promise object
 */
function postCSSTransform(cssInput, options) {
	const logger = reporter('css-compiler', { subTaskName: 'postcss', color: options.taskColor });
	const plugins = [
		postcssCustomProperties,
		postcssColorMod,
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

	logger.emit('start', 'running postcss');

	return postcss(plugins).process(cssInput, { ...settings, ...options.postcss });
}

/**
 * Write file to disk with the CSS output and revision the filename
 * @param {String} cssOutput - CSS output
 * @param {String} dest - CSS output folder path
 * @param {Object} options - Options object
 * @returns {Promise} Promise object
 */
function writeFileToDisk(cssOutput, dest, options) {
	const outputHash = options.isDebug ? 'dev' : revHash(cssOutput);
	const entryPointFileName = path.basename(options.entryPoint, '.scss');
	const manifestContent = `{
	"${options.entryPoint}": "/styles/${entryPointFileName}.build.${outputHash}.css"
}`;

	options.logger.emit('info', `writing ${options.isDebug ? 'dev' : 'production'} files to disk`)

	return Promise.all([
		fs.writeFile(path.resolve(options.buildPath + `/asset-manifest-style.json`), manifestContent),
		fs.writeFile(path.resolve(dest + `/${entryPointFileName}.build.${outputHash}.css`), cssOutput)
	]);
}

/**
 * Run all CSS transformation tasks. SASS, PostCSS, etc, and the write and revsion the output to disk
 * @param {String} entryPoint CSS entry point gile path
 * @param {String} dest CSS output folder path
 * @param {Object} options Options object
 * @param {String} options.taskName Task name used for reporting purposes
 * @param {String} options.taskColor Task color used for reporting purposes
 * @param {String} options.isDebug Debug flag used to generate source maps or to minify the response or not
 * @param {String} options.eventBus Event emitter used to pass messages to other lib like Browsersync
 * @param {String} options.sass Sass lib options
 * @returns {Promise} Promise object
 */
async function compileCSS(entryPoint, dest, options) {
	const taskName = options.taskName || 'css-compiler';
	const taskColor = options.taskColor || '#FFD166;'
	const logger = reporter(taskName, { color: taskColor });

	logger.emit('start', 'running css compile steps');

	// Parameters, options checks.
	if (entryPoint === undefined || entryPoint.length === 0) {
		const entryPointErr = 'Entry point file path is missing!';

		throw new TaskError(entryPointErr);
	}

	// Compile CSS steps
	let cssOutput = await compileSass({
		entryPoint,
		taskName,
		subTaskName: 'sass',
		taskColor,
		isDebug: options.isDebug,
		eventBus: options.eventBus,
		sass: {
			sourceMapEmbed: options.sass.sourceMapEmbed
		}
	});

	// PostCSS transform SASS output
	const postCSSOutput = await postCSSTransform(cssOutput, {
		reporter: logger,
		taskColor,
		postcss: {
			map: {
				inline: options.sourceMapEmbed,
			}
		}
	});

	cssOutput = postCSSOutput.css;

	// Minify content if build is run with release flag
	if (!options.isDebug) {
		cssOutput = await cssMinify(cssOutput);
	}

	// Create output folder and write results to output files
	await fs.makeDir(path.resolve(dest));
	await writeFileToDisk(cssOutput, dest, {
		entryPoint,
		isDebug: options.isDebug,
		buildPath: options.buildPath,
		logger
	});

	logger.emit('done', 'css build done');
}

module.exports = compileCSS;
