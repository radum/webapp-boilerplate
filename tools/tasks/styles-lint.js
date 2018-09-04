/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const path = require('path');
const stylelint = require('stylelint');
const stylelintFormatter = require('stylelint-formatter-pretty');
const { config } = require('../config');

function stylesLint(options) {
	const logger = options.logger.scope('styles-lint');

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
				logger.error('stylelint violations 💥' + data.output);
			} else {
				logger.fav('no violations found 🎉');
			}

			logger.success();
		})
		.catch((err) => {
			logger.error(err);
		});

	return task;
}

module.exports = stylesLint;
