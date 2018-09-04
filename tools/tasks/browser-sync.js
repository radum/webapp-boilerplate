const browserSyncInstance = require('browser-sync').create('browserSyncInstance');

/**
 * Init Browser Sync
 *
 * @param {object} options - options object
 * @param {object} options.port - BS port, default 3000
 * @param {object} options.https - BS https enabled, default false
 */
function bs(options) {
	const settings = {
		// No need for bs JS script to be logged to the consosle - https://browsersync.io/docs/options#option-logSnippet
		logSnippet: false,
		// Make BS faster a bit - https://browsersync.io/docs/options#option-online
		online: false,
		port: options.port || 3001,
		https: options.https !== undefined ? options.https === 'true' : false,
		key: options.key || 'src/ssl/localhost.key',
		cert: options.cert || 'src/ssl/localhost.crt'
	};

	if (settings.https) {
		settings.https = {
			key: settings.key,
			cert: settings.cert
		};
	}

	return new Promise((resolve) => {
		browserSyncInstance.init(settings, resolve);
	});
}

function bsReload(done) {
	browserSyncInstance.reload();

	if (done) {
		done();
	}
}

module.exports = {
	browserSyncInstance,
	init: bs,
	bsReload // TODO: Explore if using an EventEmitter will be better (emittery)
};
