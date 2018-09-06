const { config } = require('../config');
const fs = require('../lib/fs');
const pkg = require('../../package.json');
const pe = require('./../lib/youch');

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 * @param {Object} options - Options object
 * @returns {Promise} Task promise
 */
async function copyStatic(options) {
	const logger = options.logger.scope('copy:static');
	logger.setScopeColor(config.taskColor[1]);
	logger.start();

	try {
		logger.info('make dir → ' + config.paths.buildPath);
		await fs.makeDir(config.paths.buildPath);

		logger.info('copy dir ' + config.paths.staticAssets + ' → ' + config.paths.staticAssetsOutput);
		await fs.copyDir(config.paths.staticAssets, config.paths.staticAssetsOutput);

		logger.success();
	} catch (error) {
		logger.error(`¯\\_(ツ)_/¯ there was an error ${pe.render(error)}`);
	}
}

/**
 * Copy all server related files to the
 * output (build) folder
 * @param {Object} options - Options object
 * @returns {Promise} Task promise
 */
async function copyServer(options) {
	const logger = options.logger.scope('copy:server');
	logger.setScopeColor(config.taskColor[1]);
	logger.start();
	logger.info('copy server files ' + config.paths.serverPath);
	logger.info('copy server files ' + config.paths.serverHtmlPath);

	await Promise.all([
		fs.copyDir(config.paths.serverPath, config.paths.serverOutput),
		fs.copyDir(config.paths.serverHtmlPath, config.paths.serverHtmlOutput)
	])
		.then(() => logger.success())
		.catch((error) => {
			logger.error(`¯\\_(ツ)_/¯ there was an error ${pe.render(error)}`);
		});
}

/**
 * Copy SSL files for testing the build
 * @param {Object} options - Options object
 * @returns {Promise} Task promise
 */
async function copySSL(options) {
	const logger = options.logger.scope('copy:ssl');
	logger.setScopeColor(config.taskColor[1]);
	logger.start();
	logger.info('copy ssl files ' + config.paths.sslFilesPath);

	try {
		await fs.copyDir(config.paths.sslFilesPath, config.paths.sslFilesOutput);

		logger.success();
	} catch (error) {
		logger.error(`¯\\_(ツ)_/¯ there was an error ${pe.render(error)}`);
	}
}

/**
 * Copy other requried information and generate the production package.json file
 * @param {Object} options - Options object
 * @returns {Promise} Task promise
 */
async function copyExtra(options) {
	const logger = options.logger.scope('copy:extra');
	logger.setScopeColor(config.taskColor[1]);
	logger.start();
	logger.info('copy extra files (package.json, .env)');

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
		.then(() => logger.success())
		.catch((error) => {
			logger.error(`¯\\_(ツ)_/¯ there was an error ${pe.render(error)}`);
		});
}

module.exports = {
	copyStatic,
	copyServer,
	copySSL,
	copyExtra
};
