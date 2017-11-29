const config = require('../config');
const fs = require('../lib/fs');
const { plugin } = require('../start-runner');

/**
 * Cleans up the output (build) directory.
 *
 * @param {Array} input - Array of paths to be cleared
 * @param {Object} options - Options object
 * @returns Promise
 */
const clean = plugin('clean')(() => ({ log }) => {
	log('cleaning path: ' + config.paths.buildPath);

	return Promise.all([
		fs.cleanDir(config.paths.buildPath + '/*', {
			nosort: true,
			dot: true,
			ignore: [config.paths.buildPath + '/.git'],
		}),
	]);
});

module.exports = clean;
