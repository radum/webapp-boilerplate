const chokidar = require('chokidar');
const { config } = require('../config');

const defaultOpts = {
	label: 'file',
	events: ['add', 'change', 'unlink'],
	chokidar: {
		ignoreInitial: true,
		queue: true
	}
};

/**
 * Watch for changes and run the callback function on change.
 *
 * This is heavily inspired by https://github.com/deepsweet/start/tree/master/packages/plugin-watch (more like a rip off) (4438d42619d205c4c782ed3f8541d2b78ef83ce2)
 * Kudos to @deepsweet and everyone for for making it so simple.
 *
 * @param {Array|String} glob - Glob string or aray of globs of all files to watch
 * @param {Object} options - Options object
 * @param {Function} taskFn - Task function to call on changes
 * @returns {Promise} Return promise object
 */
async function watcherTask(glob, options, taskFn) {
	const opts = { ...defaultOpts, ...options };

	const logger = opts.logger.scope('watch');
	logger.setScopeColor(config.taskColor[5]);

	await new Promise((resolve, reject) => {
		const watcher = chokidar.watch(glob, opts.chokidar);

		watcher.once('error', reject);
		watcher.once('ready', () => {
			const watchForChanges = () => {
				opts.events.forEach((event) => {
					watcher.once(event, async () => {
						try {
							logger.watch(`files changed (${opts.label})`);

							await taskFn();
						} finally {
							watchForChanges();
						}
					});
				});
			};

			watchForChanges();
			logger.watch(`${opts.label} (press ctrl-c to exit)`);
			resolve();
		});
	});
}

module.exports = watcherTask;
