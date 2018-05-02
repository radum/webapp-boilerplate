/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const path = require('path');
const CLIEngine = require('eslint').CLIEngine;
const config = require('../config');
const Logger = require('../lib/logger');

function jsLint(options = { isVerbose: false }) {
	const logger = new Logger({
		name: 'js-lint',
		isVerbose: options.isVerbose,
	});

	const eslintOptions = {
		cache: true,
		cacheLocation: path.resolve(config.paths.cacheFolder + '/.eslintcache')
	};

	logger.start('linting js with eslint');

	const cli = new CLIEngine(eslintOptions);
	const report = cli.executeOnFiles([config.paths.scriptsFiles]);

	// TODO: Use `codeframe` option when we are in verbose
	const formatter = cli.getFormatter('pretty');

	if (report.errorCount > 0 || report.warningCount > 0) {
		logger.log('eslint violations 💥' + formatter(report.results));
	}

	if (report.errorCount === 0 && report.warningCount === 0) {
		logger.log('no violations found ¯\\_(ツ)_/¯');
	}

	logger.done();
}

module.exports = jsLint;
