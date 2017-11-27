/**
 * Simplistic Task runner
 *
 * Reporter API:
 * 	- task:start
 * 	- plugin:start
 * 	- plugin:log
 * 	- plugin:done
 * 	- plugin:error
 * 	- task:error
 *  - task:done
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
const task = reporter => taskName => (...plugins) => (input) => {
	reporter.emit('task:start', {
		taskName,
		plugins: plugins.map(plugin => plugin.name)
	});

	return plugins.reduce((current, plugin) => {
		// Nested task
		if (typeof plugin === 'function') {
			return current.then(plugin);
		}

		return current
			.then((output) => {
				reporter.emit('plugin:start', { taskName, pluginName: plugin.name });

				return plugin.run({
					input: output,
					log: message => reporter.emit('plugin:log', { taskName, pluginName: plugin.name, message })
				});
			})
			.then((result) => {
				reporter.emit('plugin:done', { taskName, pluginName: plugin.name });

				return result;
			})
			.catch((error) => {
				reporter.emit('plugin:error', { taskName, pluginName: plugin.name, error });
				reporter.emit('task:error', { taskName });

				throw error;
			});
	}, Promise.resolve(input))
		.then((result) => {
			reporter.emit('task:done', { taskName });

			return result;
		});
};

const plugin = name => run => (...args) => ({
	name,
	run: run(...args)
});

module.exports = task;
module.exports.plugin = plugin;
