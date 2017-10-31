/**
 * Simplistic Task runner
 *
 * Reporter API:
 * 	- task-start
 * 	- plugin-start
 * 	- plugin-log
 * 	- plugin-done
 * 	- plugin-error
 *
 * Plugin API:
 *  - Create a plugin entry like this `Plugin('clean', opts => yourPromiseReturningFunction(opts))`
 *  - opts definition:
 *  {
 *    input - input data (can be anything)
 *    log - logger function that logs progress
 *    verbose - verbose option for extra logging
 *  }
 *
 * @param {events} reporter - EventEmitter events reporter
 * @param {String} taskname - The name of the task
 * @param {Args} All passed sub-tasks following the same format
 */
const task = reporter => taskName => (...plugins) => {
	return (input) => {
		reporter.emit('task-start', {
			name: taskName,
			plugins: plugins.map(plugin => plugin.name)
		});

		return plugins.reduce((current, plugin) => {
			// Nested task
			if (typeof plugin === 'function') {
				return current.then(plugin);
			}

			return current
				.then((output) => {
					reporter.emit('plugin-start', { name: plugin.name });

					return plugin.run({
						input: output,
						log: message => reporter.emit('plugin-log', { name: plugin.name, message })
					});
				})
				.then((result) => {
					reporter.emit('plugin-done', { name: plugin.name });

					return result;
				})
				.catch((error) => {
					reporter.emit('plugin-error', { name: plugin.name, error });

					throw error;
				});
		}, Promise.resolve(input));
	};
};

const plugin = (name, run) => ({
// const plugin = name => run => (...args) => ({
	name,
	run
	// run: run(...args)
});

module.exports = task;
module.exports.plugin = plugin;
