const { config } = require('../config');
const fs = require('../lib/fs');
const TaskError = require('../lib/task-error').TaskError
const pkg = require('../../package.json');

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 * @param {Object} options - Options object
 * @returns {Promise} Task promise
 */
async function copyStatic(options) {
	const reporter = options.reporter('copy:static', { color: config.taskColor[1] });
	reporter.emit('start', 'copy static assets');

	try {
		reporter.emit('info', 'make dir → ' + config.paths.buildPath);
		await fs.makeDir(config.paths.buildPath);

		reporter.emit('info', 'copy dir ' + config.paths.staticAssets + ' → ' + config.paths.staticAssetsOutput);
		await fs.copyDir(config.paths.staticAssets, config.paths.staticAssetsOutput);

		reporter.emit('done', 'static assets copied');
	} catch (error) {
		reporter.emit('error', error);

		throw new TaskError(error); // Throwing here because we want the upper function (higher level `catchErrors` func) to catch and set the exit code properly
	}
}

/**
 * Copy all server related files to the
 * output (build) folder
 * @param {Object} options - Options object
 * @returns {Promise} Task promise
 */
async function copyServer(options) {
	const reporter = options.reporter('copy:server', { color: config.taskColor[1] });
	reporter.emit('start', 'copy server assets');
	reporter.emit('info', 'copy server files ' + config.paths.serverPath);
	reporter.emit('info', 'copy server files ' + config.paths.serverHtmlPath);

	await Promise.all([
		fs.copyDir(config.paths.serverPath, config.paths.serverOutput),
		fs.copyDir(config.paths.serverHtmlPath, config.paths.serverHtmlOutput)
	])
		.then(() => reporter.emit('done', 'server assets copied'))
		.catch((error) => {
			reporter.emit('error', error);

			throw new TaskError(error);
		});
}

/**
 * Copy SSL files for testing the build
 * @param {Object} options - Options object
 * @returns {Promise} Task promise
 */
async function copySSL(options) {
	const reporter = options.reporter('copy:ssl', { color: config.taskColor[1] });
	reporter.emit('start', 'copy ssl certs');
	reporter.emit('info', 'copy ssl files ' + config.paths.sslFilesPath);

	try {
		await fs.copyDir(config.paths.sslFilesPath, config.paths.sslFilesOutput);

		reporter.emit('done', 'ssl cert files copied');
	} catch (error) {
		reporter.emit('error', error);

		throw new TaskError(error);
	}
}

/**
 * Copy other requried information and generate the production package.json file
 * @param {Object} options - Options object
 * @returns {Promise} Task promise
 */
async function copyExtra(options) {
	const reporter = options.reporter('copy:extra', { color: config.taskColor[1] });
	reporter.emit('start', 'copy extra files');
	reporter.emit('info', 'copy extra files (package.json, .env)');

	await Promise.all([
		fs.writeFile(config.paths.buildPath + '/package.json', JSON.stringify({
			private: true,
			engines: pkg.engines,
			dependencies: pkg.dependencies,
			scripts: {
				start: 'node ./server/server.js',
			},
		}, null, 2)),
		...(fs.fileExists('.env') ? [fs.copyFile('.env', config.paths.buildPath + '/.env')] : [])
	])
		.then(() => reporter.emit('done', 'all other files copied'))
		.catch((error) => {
			reporter.emit('error', error);

			throw new TaskError(error);
		});
}

module.exports = {
	copyStatic,
	copyServer,
	copySSL,
	copyExtra
};
