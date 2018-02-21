const Logger = require('../lib/logger');

const defaultOpts = {
	isVerbose: false,
	isDebug: true
};

function watch(glob, options) {
	const opts = { ...defaultOpts, ...options };

	const logger = new Logger({
		name: 'watch',
		isVerbose: opts.isVerbose
	});

	logger.start('watching files');
	logger.log('');
	logger.done();
}

module.exports = watch;
