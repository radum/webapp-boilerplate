const fs = require('../lib/fs');
const reporter = require('../lib/reporter');
const pkg = require('../../package.json');
const { config } = require('../config');

/**
 * Copy other requried information and generate the production package.json file
 * @param {Object} options Options object
 * @param {String} options.taskName Task name used for reporting purposes
 * @param {String} options.taskColor Task color used for reporting purposes
 * @returns {Promise} Task promise
 */
function copyExtra(options = {}) {
	const taskName = options.taskName || 'copy:extra';
	const taskColor = options.taskColor || '#B2DBBF;'
	const logger = reporter(taskName, { color: taskColor });

	logger.emit('start', 'copy extra files');
	logger.emit('info', 'copy extra files (package.json, .env)');

	return Promise.all([
		fs.writeFile(config.paths.buildPath + '/package.json', JSON.stringify({
			private: true,
			engines: pkg.engines,
			dependencies: pkg.dependencies,
			scripts: {
				start: 'node ./server/server.js',
			},
		}, null, 2)),
		...(fs.fileExists('.env') ? [fs.copyFile('.env', config.paths.buildPath + '/.env')] : [])
	])
		.then(() => logger.emit('done', 'all other files copied'));
}

module.exports = copyExtra;
