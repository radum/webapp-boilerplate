const fs = require('../lib/fs');
const TaskError = require('../lib/task-error').TaskError
const reporter = require('../lib/reporter');

/**
 * Cleans up the output (build) directory, or any other path that you pass.
 * @param {Array} paths - Array of paths to be removed
 * @param {Object} options Options object
 * @param {String} options.taskName Task name used for reporting purposes
 * @param {String} options.taskColor Task color used for reporting purposes
 * @returns {Promise} Task promise
 */
function clean(paths, options) {
	const taskName = options.taskName || 'clean';
	const taskColor = options.taskColor || '#F3FFBD;'
	const logger = reporter(taskName, { color: taskColor });

	logger.emit('start', 'cleaning temp folders');

	if (!Array.isArray(paths)) {
		const arrayErr = 'First param should be an array of paths!';
		logger.emit('error', arrayErr);

		throw new TaskError(arrayErr);
	}

	// Generate job array for all paths
	const cleanJobs = paths.map(path => {
		logger.emit('info', `cleaning path: ${path}`);

		return fs.cleanDir(path, {
			nosort: true,
			dot: true
		})
	});

	return Promise.all(cleanJobs)
		.then(() => {
			logger.emit('done', 'temp folders cleaned');

			return null;
		});
}

module.exports = clean;
