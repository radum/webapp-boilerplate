const Logger = require('../lib/logger');

function watch(options = { isVerbose: false }) {
	const logger = new Logger({
		name: 'watch',
		isVerbose: options.isVerbose
	});

	logger.start('watching files');
	logger.log('');
	logger.done();
}

module.exports = watch;
