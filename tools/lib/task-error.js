class TaskError extends Error {
	/**
	 * Creates an instance of TaskError extending the native Error.
	 * @param {String} message Error message
	 * @param {String} type Error type
	 * @param {Object} implementationContext Implementation context
	 */
	constructor(message, type, implementationContext) {
		// Calling parent constructor of base Error class.
		super(message);

		// Saving class name in the property of our custom error as a shortcut.
		this.name = this.constructor.name;

		// This is just a flag that will indicate if the error is a custom AppError. If this
		// is not an AppError, this property will be undefined, which is a Falsey.
		this.isAppError = true;

		// Capturing stack trace, excluding constructor call from it.
		Error.captureStackTrace(this, (implementationContext || this.constructor));

		// Type of error
		// default: Task
		// Other possible values used in the project:
		//  - task
		this.errorType = type || 'task';
	}
}

function createTaskError(message, type) {
	// NOTE: We are overriding the "implementationContext" so that the createTaskError()
	// function is not part of the resulting stacktrace.
	return(new TaskError(message, type, createTaskError));
}

// Export the constructor function.
exports.TaskError = TaskError;

// Export the factory function for the custom error object. The factory function lets
// the calling context create new TaskError instances without calling the [new] keyword.
exports.createTaskError = createTaskError;
