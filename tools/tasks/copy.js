const cpy = require('cpy');
const TaskError = require('../lib/task-error').TaskError
const reporter = require('../lib/reporter');

/**
 * Copy static assets from on location to another
 * @param {Object} options Options object
 * @param {String} options.taskName Task name used for reporting purposes
 * @param {String} options.taskColor Task color used for reporting purposes
 * @param {String | Array} options.src Task src string Array of files needed to be copied
 * @param {String} options.dest Task destination directory
 * @param {Object} options.cpy Cpy options. Options are passed to cp-file and globby also
 * @returns {Promise} Task `cpy` promise
 */
function copyStatic(options) {
	const taskName = options.taskName || 'copy:static';
	const taskColor = options.taskColor || '#B2DBBF;'
	const logger = reporter(taskName, { color: taskColor });

	let completedFiles = 0;

	logger.emit('start', `copy ${taskName} assets`);

	// Parameters, options checks.
	if (options.src === undefined || options.dest === undefined) {
		const paramErr = '`options.src` and `options.dest` are mandatory!';

		logger.emit('error', paramErr);

		throw new TaskError(paramErr);
	}

	return cpy(options.src, options.dest, options.cpy || {}).on('progress', report => {
		logger.emit('debug', `${report.completedFiles} / ${report.totalFiles} copied`);

		completedFiles = report.completedFiles;
	})
		.then(() => {
			logger.emit('info', `${completedFiles} static assets copied`);
			logger.emit('done', `${taskName} files copied`);

			return null;
		});
}

module.exports = copyStatic;
