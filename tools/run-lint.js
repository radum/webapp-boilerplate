const reporter = require('./lib/reporter');
const stylesLint = require('./tasks/styles-lint');
const jsLint = require('./tasks/js-lint');

/**
 * Start the linitig process running Sylelint and ESlint
 * @returns {Promise} Runner promise
 */
function startLint() {
	const opts = { reporter };

	reporter('build').emit('log', 'starting lint');

	return Promise.all([
		stylesLint(opts),
		jsLint(opts)
	]);
}

module.exports = startLint;
