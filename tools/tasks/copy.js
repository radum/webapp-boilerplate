/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const config = require('../config');
const fs = require('../lib/fs');
const pkg = require('../../package.json');

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 *
 * @returns Promise
 */
async function copyStatic(options = { isVerbose: false }) {
	const logger = options.signale.scope('copy:static');

	logger.start();

	logger.info('make dir → ' + config.paths.buildPath);
	await fs.makeDir(config.paths.buildPath);

	logger.info('copy dir ' + config.paths.staticAssets + ' → ' + config.paths.staticAssetsOutput);
	await fs.copyDir(config.paths.staticAssets, config.paths.staticAssetsOutput);

	logger.success();
}

async function copyServer(options = { isVerbose: false }) {
	const logger = options.signale.scope('copy:server');

	logger.start();

	logger.info('copy server files ' + config.paths.serverPath);
	logger.info('copy server files ' + config.paths.serverHtmlPath);

	await Promise.all([
		fs.copyDir(config.paths.serverPath, config.paths.serverOutput),
		fs.copyDir(config.paths.serverHtmlPath, config.paths.serverHtmlOutput)
	]);

	logger.success();
}

async function copySSL(options = { isVerbose: false }) {
	const logger = options.signale.scope('copy:ssl');

	logger.start();
	logger.info('copy ssl files ' + config.paths.sslFilesPath);

	await fs.copyDir(config.paths.sslFilesPath, config.paths.sslFilesOutput);

	logger.success();
}

async function copyExtra(options = { isVerbose: false }) {
	const logger = options.signale.scope('copy:extra');

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
	]);

	logger.success();
}

module.exports = {
	copyStatic,
	copyServer,
	copySSL,
	copyExtra
};
