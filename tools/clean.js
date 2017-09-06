const config = require('./config');
const fs = require('./lib/fs');

/**
 * Cleans up the output (build) directory.
 *
 * @returns Promise
 */
function clean() {
	return Promise.all([
		fs.cleanDir(config.paths.buildPath + '/*', {
			nosort: true,
			dot: true,
			ignore: [config.paths.buildPath + '/.git'],
		}),
	]);
}

module.exports = clean;
