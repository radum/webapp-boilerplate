/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const path = require('path');
const { CLIEngine } = require('eslint');
const { config } = require('../config');

function jsLint(options = { isVerbose: false }) {
	const reporter = options.reporter('js-lint', { color: config.taskColor[0] });

	const eslintOptions = {
		cache: true,
		cacheLocation: path.resolve(config.paths.cacheFolder + '/.eslintcache')
	};

	reporter.emit('start', 'linting JS files with eslint');

	const cli = new CLIEngine(eslintOptions);
	const report = cli.executeOnFiles([
		config.paths.scriptsFiles,
		config.paths.serverJsFiles
	]);

	// TODO: Use `codeframe` option when we are in verbose
	const formatter = cli.getFormatter('pretty');

	if (report.errorCount > 0 || report.warningCount > 0) {
		reporter.emit('warn', 'eslint violations 💥' + formatter(report.results));
	}

	if (report.errorCount === 0 && report.warningCount === 0) {
		reporter.emit('fav', 'no violations found ¯\\_(ツ)_/¯');
	}

	reporter.emit('done', 'linting done');
}

module.exports = jsLint;
