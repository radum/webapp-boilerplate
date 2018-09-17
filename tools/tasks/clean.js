const { config } = require('../config');
const fs = require('../lib/fs');
const TaskError = require('../lib/task-error').TaskError

/**
 * Cleans up the output (build) directory.
 * @param {Object} options - Options object
 * @returns {Promise} Task promise
 */
async function clean(options) {
	const reporter = options.reporter('clean', { color: config.taskColor[2] });
	const cleanPaths = [];
	reporter.emit('start', 'cleaning temp folders');

	// Push all paths that need to be cleared
	cleanPaths.push(config.paths.buildPath + '/*');

	// Generate job array for all paths
	const cleanJobs = cleanPaths.map(path => {
		reporter.emit('info', `cleaning path: ${path}`);

		return fs.cleanDir(path, {
			nosort: true,
			dot: true
		})
	});

	try {
		await  Promise.all(cleanJobs);

		reporter.emit('done', 'temp folders cleaned')
	} catch (error) {
		reporter.emit('error', error);

		throw new TaskError(error);
	}
}

module.exports = clean;
