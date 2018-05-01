/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const path = require('path');
const stylelint = require('stylelint');
const stylelintFormatter = require('stylelint-formatter-pretty');
const config = require('../config');
const Logger = require('../lib/logger');

function clean(options = { isVerbose: false }) {
	const logger = new Logger({
		name: 'styles-lint',
		isVerbose: options.isVerbose,
	});

	logger.start('linting styles with stylelint');

	const task = stylelint.lint({
		files: path.resolve(config.paths.styles),
		formatter: stylelintFormatter,
		syntax: 'scss',
		cache: true,
		cacheLocation: path.resolve(config.paths.cacheFolder + '/.stylelintcache')
	});

	task
		.then((data) => {
			if (data.errored) {
				logger.log('stylelint violations 💥' + data.output);
			} else {
				logger.log('no violations found 🎉');
			}

			logger.done();
		})
		.catch((err) => {
			logger.error(err);
		});

	return task;
}

module.exports = clean;
