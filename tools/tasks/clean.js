const { config } = require('../config');
const fs = require('../lib/fs');
const pe = require('./../lib/youch');

/**
 * Cleans up the output (build) directory.
 *
 * @param {Object} options - Options object
 * @returns {Promise} Task promise
 */
function clean(options) {
	const logger = options.logger.scope('clean');
	logger.setScopeColor(config.taskColor[2]);

	logger.start('cleaning temp folders');
	logger.info('cleaning path: ' + config.paths.buildPath);

	const task = Promise.all([
		fs.cleanDir(config.paths.buildPath + '/*', {
			nosort: true,
			dot: true,
			ignore: [config.paths.buildPath + '/.git'],
		})
	]);

	task.then(() => logger.success())
		.catch((error) => {
			logger.error(`¯\\_(ツ)_/¯ there was an error ${pe.render(error)}`);
		});

	return task;
}

module.exports = clean;
