const TaskError = require('../lib/task-error').TaskError
const reporter = require('../lib/reporter');

/**
 * Cleans up the output (build) directory, or any other path that you pass.
 * @param {Array} paramA - Array of paths to be removed
 * @param {Object} options Options object
 * @param {String} options.taskName Task name used for reporting purposes
 * @param {String} options.taskColor Task color used for reporting purposes
 * @returns {Promise} Task promise
 */
async function _example(paramA, options = {}) {
	const taskName = options.label || 'task-name-example';
	const taskColor = options.taskColor || '#FFFFFF;'
	const logger = reporter(taskName, { color: taskColor });

	logger.emit('start', 'cleaning temp folders');

	// Parameters, options checks.
	if (!Array.isArray(paramA)) {
		const arrayErr = 'First param should be an array of paths!';

		logger.emit('error', arrayErr);

		// Use `TaskError` to throw task specific errors only.
		// It will set up some Error obj defaults to be used outside to condition the error reporting.
		// For example `.errorType`.
		throw new TaskError(arrayErr);
	}

	// The current archtecture of the taks runner is to deal with errors outside of task itself.
	// This means there is not custom error handling for each individual task.
	// Another way to do this is to async all tasks and do error reporting within the task itself, and then
	// throw the same error again to be dealt with if needed outside of the scoped task.
	try {
		// DO WORK
		await job();

		logger.emit('done', 'job done')
	} catch (error) {
		// This catch is not needed in most cases.
		// But if you need to log something or do some work on fail please remember to throw the error again,
		// as the upper global catch will not catch it unless we pass the error again via a throw.
		logger.emit('error', error);

		throw error;
	}
}

module.exports = _example;
