const config = require('../config');
const fs = require('../lib/fs');

/**
 * Cleans up the output (build) directory.
 *
 * @param {Array} input - Array of paths to be cleared
 * @param {Object} options - Options object
 * @param {Function} options.log - Passed log function used by a custom reporter to report progress
 * @returns Promise
 */
function clean(options) {
	options.log('cleaning path: ' + config.paths.buildPath);

	return Promise.all([
		fs.cleanDir(config.paths.buildPath + '/*', {
			nosort: true,
			dot: true,
			ignore: [config.paths.buildPath + '/.git'],
		}),
	]);
}

module.exports = clean;
