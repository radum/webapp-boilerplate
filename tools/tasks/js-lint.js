/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const path = require('path');
const { CLIEngine } = require('eslint');
const { config } = require('../config');

function jsLint(options = { isVerbose: false }) {
	const logger = options.logger.scope('js-lint');

	const eslintOptions = {
		cache: true,
		cacheLocation: path.resolve(config.paths.cacheFolder + '/.eslintcache')
	};

	logger.start('linting js with eslint');

	const cli = new CLIEngine(eslintOptions);
	const report = cli.executeOnFiles([
		config.paths.scriptsFiles,
		config.paths.serverJsFiles
	]);

	// TODO: Use `codeframe` option when we are in verbose
	const formatter = cli.getFormatter('pretty');

	if (report.errorCount > 0 || report.warningCount > 0) {
		logger.error('eslint violations 💥' + formatter(report.results));
	}

	if (report.errorCount === 0 && report.warningCount === 0) {
		logger.fav('no violations found ¯\\_(ツ)_/¯');
	}

	logger.success();
}

module.exports = jsLint;
