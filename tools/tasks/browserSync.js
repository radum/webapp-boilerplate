/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const browserSyncInstance = require('browser-sync').create('browserSyncInstance');
const { plugin } = require('../start-runner');

/**
 * Init Browser Sync
 *
 * @param {object} options - options object
 * @param {object} options.port - BS port, default 3000
 * @param {object} options.https - BS https enabled, default false
 */
const bs = plugin('bs-server')(options => ({ log }) => {
	const settings = {
		// No need for bs JS script to be logged to the consosle - https://browsersync.io/docs/options#option-logSnippet
		logSnippet: false,
		// Make BS faster a bit - https://browsersync.io/docs/options#option-online
		online: false,
		port: options.port || 3001,
		https: false
	};

	if (options.https) {
		settings.https = {
			key: 'src/ssl/localhost.key',
			cert: 'src/ssl/localhost.crt'
		};
	}

	return new Promise((resolve) => {
		browserSyncInstance.init(settings, resolve);
	});
});

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
// TODO: Alternative to the above syntax
// module.exports.bsReload = bsReload;
