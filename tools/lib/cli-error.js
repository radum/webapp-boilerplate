class CLIError extends Error {
	/**
	 * Creates an instance of CLIError extending the native Error.
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
		// default: CLI
		// Other possible values used in the project:
		//  - task
		this.errorType = type || 'CLI';
	}
}

function createCLIError(message, type) {
	// NOTE: We are overriding the "implementationContext" so that the createCLIError()
	// function is not part of the resulting stacktrace.
	return(new CLIError(message, type, createCLIError));
}

// Export the constructor function.
exports.CLIError = CLIError;

// Export the factory function for the custom error object. The factory function lets
// the calling context create new CLIError instances without calling the [new] keyword.
exports.createCLIError = createCLIError;
