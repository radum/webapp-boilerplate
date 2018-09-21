/* eslint promise/catch-or-return: 0, promise/always-return: 0  */

const chokidar = require('chokidar');
const { config } = require('../config');

const MIN_DEBOUNCE_DELAY = 50;
const INITIAL_DEBOUNCE_DELAY = 250;

/**
 * Class representing a function debouncer
 * @class Debouncer
 */
class Debouncer {
	/**
	 * Creates an instance of Debouncer.
	 * @param {Object} watcher - Watcher instance
	 * @memberof Debouncer
	 */
	constructor(watcher) {
		this.watcher = watcher;
		this.timer = null;
		this.repeat = false;
	}

	debounce(delay) {
		if (this.timer) {
			this.again = true;
			return;
		}

		delay = delay ? Math.max(delay, MIN_DEBOUNCE_DELAY) : INITIAL_DEBOUNCE_DELAY;

		if (this.watcher.busy === undefined) {
			this.watcher.rerunAll();
		} else {
			const timer = setTimeout(() => {
				this.watcher.busy.then(() => {
					// Do nothing if debouncing was canceled while waiting for the busy
					// promise to fulfil
					if (this.timer !== timer) {
						return;
					}

					if (this.again) {
						this.timer = null;
						this.again = false;
						this.debounce(delay / 2);
					} else {
						this.watcher.runAfterChanges();
						this.timer = null;
						this.again = false;
					}
				});
			}, delay);

			this.timer = timer;
		}
	}

	cancel() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
			this.again = false;
		}
	}
}

// function rethrowAsync(err) {
// 	// Don't swallow exceptions. Note that any
// 	// expected error should already have been logged
// 	setImmediate(() => {
// 		throw err;
// 	});
// }

/**
 * Class representing a watcher task
 * Inspired by [AVA watcher](https://github.com/avajs/ava/blob/master/lib/watcher.js)
 * @class Watcher
 */
class Watcher {
	/**
	 * Watch for changes and run the callback function on change via the debouncer.
	 * @param {Array|String} filesGlob - Glob string or aray of globs of all files to watch
	 * @param {Object} options - Options object
	 * @param {Function} taskFn - Task function to call on changes
	 */
	constructor(filesGlob, options, taskFn) {
		this.debouncer = new Debouncer(this);
		this.filesGlob = filesGlob;
		this.options = options;
		this.taskFn = taskFn;
		this.reporter = options.reporter('watch', { color: config.taskColor[5] });

		this.reporter.emit('watch', `${options.label} (press ctrl-c to exit)`);

		this.run = () => {
			// this.busy = this.taskFn().catch(rethrowAsync);
			this.busy = this.taskFn().catch(() => {
				this.busy = undefined;
			});
		}

		this.watchFiles();
	}

	async watchFiles() {
		const patterns = this.filesGlob;

		await new Promise((resolve, reject) => {
			const watcher = chokidar.watch(patterns, {
				ignoreInitial: true
			})

			watcher.once('error', reject);
			watcher.on('all', (event, path) => {
				if (event === 'add' || event === 'change' || event === 'unlink') {
					this.reporter.emit('watch', `files changed (${this.options.label})`);
					this.reporter.emit('info', `Detected ${event} of ${path}`);

					this.debouncer.debounce();
				}
			});

			resolve();
		});
	}

	rerunAll() {
		this.run();
	}

	runAfterChanges() {
		this.run();
	}
}

module.exports = Watcher;
