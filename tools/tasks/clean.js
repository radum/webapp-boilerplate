const config = require('../config');
const fs = require('../lib/fs');
const Logger = require('../lib/logger');

/**
 * Cleans up the output (build) directory.
 *
 * @param {Array} input - Array of paths to be cleared
 * @param {Object} options - Options object
 * @returns Promise
 */
function clean(options = { isVerbose: false }) {
	const logger = new Logger({
		name: 'clean',
		isVerbose: options.isVerbose
	});

	logger.start('cleaning temp folders');
	logger.verbose().log('cleaning path: ' + config.paths.buildPath);

	const task = Promise.all([
		fs.cleanDir(config.paths.buildPath + '/*', {
			nosort: true,
			dot: true,
			ignore: [config.paths.buildPath + '/.git'],
		}),
	]);

	task.then(() => {
		logger.done();
	}).catch((err) => {
		logger.error(err);
	});

	return task;
}

module.exports = clean;
