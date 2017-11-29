/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const config = require('../config');
const fs = require('../lib/fs');
const pkg = require('../../package.json');
const { plugin } = require('../start-runner');

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 *
 * @returns Promise
 */
const copyStatic = plugin('copy:static')(() => async ({ log }) => {
	log('make dir → ' + config.paths.buildPath);
	await fs.makeDir(config.paths.buildPath);

	log('copy dir ' + config.paths.staticAssets + ' → ' + config.paths.staticAssetsOutput);
	await fs.copyDir(config.paths.staticAssets, config.paths.staticAssetsOutput);
});

const copyServer = plugin('copy:server')(() => async ({ log }) => {
	log('copy server files ' + config.paths.serverPath);
	log('copy server files ' + config.paths.serverHtmlPath);

	await Promise.all([
		fs.copyDir(config.paths.serverPath, config.paths.serverOutput),
		fs.copyDir(config.paths.serverHtmlPath, config.paths.serverHtmlOutput)
	]);
});

const copyExtra = plugin('copy:extra')(() => async ({ log }) => {
	log('copy extra files');

	await Promise.all([
		fs.writeFile(config.paths.buildPath + '/package.json', JSON.stringify({
			private: true,
			engines: pkg.engines,
			dependencies: pkg.dependencies,
			scripts: {
				start: 'node ./server/server.js',
			},
		}, null, 2))
	]);
});

module.exports = {
	copyStatic,
	copyServer,
	copyExtra
};
