/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const config = require('../config');
const fs = require('../lib/fs');
const pkg = require('../../package.json');
const Logger = require('../lib/logger');

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 *
 * @returns Promise
 */
async function copyStatic(options = { isVerbose: false }) {
	const logger = new Logger({
		name: 'copy:static',
		verbose: config.isVerbose
	});

	logger.start();

	logger.verbose().log('make dir → ' + config.paths.buildPath);
	await fs.makeDir(config.paths.buildPath);

	logger.verbose().log('copy dir ' + config.paths.staticAssets + ' → ' + config.paths.staticAssetsOutput);
	await fs.copyDir(config.paths.staticAssets, config.paths.staticAssetsOutput);

	logger.done();
}

async function copyServer(options = { isVerbose: false }) {
	const logger = new Logger({
		name: 'copy:server',
		verbose: config.isVerbose
	});

	logger.start();

	logger.verbose().log('copy server files ' + config.paths.serverPath);
	logger.verbose().log('copy server files ' + config.paths.serverHtmlPath);

	await Promise.all([
		fs.copyDir(config.paths.serverPath, config.paths.serverOutput),
		fs.copyDir(config.paths.serverHtmlPath, config.paths.serverHtmlOutput)
	]);

	logger.done();
}

async function copySSL(options = { isVerbose: false }) {
	const logger = new Logger({
		name: 'copy:ssl',
		verbose: config.isVerbose
	});

	logger.start();
	logger.verbose().log('copy ssl files ' + config.paths.sslFilesPath);

	await fs.copyDir(config.paths.sslFilesPath, config.paths.sslFilesOutput);

	logger.done();
}

async function copyExtra(options = { isVerbose: false }) {
	const logger = new Logger({
		name: 'copy:extra',
		verbose: config.isVerbose
	});

	logger.start();
	logger.verbose().log('copy extra files (package.json, .env)');

	await Promise.all([
		fs.writeFile(config.paths.buildPath + '/package.json', JSON.stringify({
			private: true,
			engines: pkg.engines,
			dependencies: pkg.dependencies,
			scripts: {
				start: 'node ./server/server.js',
			},
		}, null, 2)),
		fs.copyFile('.env.dev', config.paths.buildPath + '/.env')
	]);

	logger.done();
}

module.exports = {
	copyStatic,
	copyServer,
	copySSL,
	copyExtra
};
