const catchErrors = (fn, logger) => (...args) => fn(...args).catch(error => logger.fatal(error));

module.exports = catchErrors;
