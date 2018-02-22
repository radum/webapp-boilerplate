/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const chokidar = require('chokidar');
const _ = require('lodash');
// const asyncDone = require('async-done');
const Logger = require('../lib/logger');

const defaultOpts = {
	isVerbose: false,
	isDebug: true,
	delay: 200,
	chokidar: {
		events: ['add', 'change', 'unlink'],
		ignoreInitial: true,
		queue: true
	}
};

function listenerCount(ee, evtName) {
	if (typeof ee.listenerCount === 'function') {
		return ee.listenerCount(evtName);
	}

	return ee.listeners(evtName).length;
}

function hasErrorListener(ee) {
	return listenerCount(ee, 'error') !== 0;
}

/**
 * Watch for changes and run the callback function on change.
 *
 * This is heavily inspired from https://github.com/gulpjs/glob-watcher (more like a rip off)
 * Kudos to them for making it so simple.
 *
 * @param {Array} glob
 * @param {Object} options
 * @param {Function} cb
 * @returns Object
 */
function watch(glob, options, cb) {
	if (typeof options === 'function') {
		cb = options;
		options = {};
	}

	const opts = { ...defaultOpts, ...options };

	const logger = new Logger({
		name: 'watch',
		isVerbose: opts.isVerbose
	});

	let queued = false;
	let running = false;

	const watcher = chokidar.watch(glob, opts.chokidar);

	function runComplete(err) {
		running = false;

		if (err && hasErrorListener(watcher)) {
			watcher.emit('error', err);
		}

		// If we have a run queued, start onChange again
		if (queued) {
			queued = false;

			onChange();
		}
	}

	function onChange() {
		if (running) {
			if (opts.chokidar.queue) {
				queued = true;
			}
			return;
		}

		running = true;

		// asyncDone(cb, runComplete);
		cb().then(runComplete);
	}

	let fn;

	if (typeof cb === 'function') {
		fn = _.debounce(onChange, opts.delay);
	}

	if (fn) {
		opts.chokidar.events.forEach((eventName) => {
			watcher.on(eventName, fn);
		});
	}

	logger.start('watching files');
	logger.log('');
	logger.done();

	return watcher;
}

module.exports = watch;
