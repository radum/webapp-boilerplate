/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const browserSyncInstance = require('browser-sync').create('browserSyncInstance');

/**
 * Init Browser Sync
 *
 * @param {object} options - options object
 * @param {object} options.port - BS port, default 3000
 */
function bs(options) {
	return new Promise((resolve) => {
		browserSyncInstance.init({
			// No need for bs JS script to be logged to the consosle - https://browsersync.io/docs/options#option-logSnippet
			logSnippet: false,
			// Make BS faster a bit - https://browsersync.io/docs/options#option-online
			online: false,
			port: options.port || 3001
			// https: true
		}, resolve);
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
	bsReload
};
