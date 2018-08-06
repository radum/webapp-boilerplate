const stylesLint = require('./tasks/styles-lint');
const jsLint = require('./tasks/js-lint');

async function startLint(opts, logger) {
	logger.log('starting lint');

	await Promise.all([
		stylesLint(opts),
		jsLint(opts)
	]);
}

module.exports = startLint;
