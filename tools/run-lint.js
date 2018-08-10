const stylesLint = require('./tasks/styles-lint');
const jsLint = require('./tasks/js-lint');

/**
 * Start the linitig process running Sylelint and ESlint
 *
 * @param {Object} options Options object
 * @param {Function} options.logger Signale logger instance
 * @returns {Promise} Runner promise
 */
function startLint(options) {
	const taskOpts = { logger: options.logger };

	options.logger.log('starting lint');

	return Promise.all([
		stylesLint(taskOpts),
		jsLint(taskOpts)
	]);
}

module.exports = startLint;
