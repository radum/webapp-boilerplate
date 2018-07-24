const config = require('../config');
const fs = require('../lib/fs');

/**
 * Cleans up the output (build) directory.
 *
 * @param {Array} input - Array of paths to be cleared
 * @param {Object} options - Options object
 * @returns Promise
 */
function clean(options) {
	const logger = options.logger.scope('clean');

	logger.start('cleaning temp folders');
	logger.info('cleaning path: ' + config.paths.buildPath);

	const task = Promise.all([
		fs.cleanDir(config.paths.buildPath + '/*', {
			nosort: true,
			dot: true,
			ignore: [config.paths.buildPath + '/.git'],
		}),
	]);

	task.then(() => {
		logger.success();
	}).catch((err) => {
		logger.error(err);
	});

	return task;
}

module.exports = clean;
