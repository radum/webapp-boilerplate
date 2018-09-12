const browserSyncInstance = require('browser-sync').create('browserSyncInstance');

/**
 * Init Browser Sync
 * @param {object} options - options object
 * @param {object} options.port - BS port, default 3000
 * @param {object} options.https - BS https enabled, default false
 * @returns {Promise} Promise object
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
		browserSyncInstance.init(settings, () => {
			listenEvents(options.eventBus);
			resolve()
		});
	});
}

/**
 * Listen to events fired by other tasks and reload the browser or show a message on screen
 * @param {EventEmitter} eventBus - EventEmitter instace
 */
function listenEvents(eventBus) {
	eventBus.on('bs:reload', () => {
		browserSyncInstance.reload();
	});

	eventBus.on('bs:fullscreen:message', (data) => {
		// TODO: This needs to be added to client side also.
		// Using something like https://github.com/CodeSeven/toastr could show errors on screen.
		// To get access to the BS socket we need `window.___browserSync___.socket` and then `socket.on({MSG_EVENT}, (data) => {})`
		browserSyncInstance.sockets.emit('fullscreen:message', {
			title: data.title,
			body: data.body,
			timeout: data.timeout || 3000
		});
	});
}

module.exports = {
	browserSyncInstance,
	init: bs
};
