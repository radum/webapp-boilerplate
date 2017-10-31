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
async function copyStatic(options) {
	options.log('make dir → ' + config.paths.buildPath);
	await fs.makeDir(config.paths.buildPath);

	options.log('copy dir ' + config.paths.staticAssets + ' → ' + config.paths.staticAssetsOutput);
	await fs.copyDir(config.paths.staticAssets, config.paths.staticAssetsOutput);
}

async function copyServer() {
	await Promise.all([
		fs.copyDir(config.paths.serverPath, config.paths.serverOutput),
		fs.copyDir(config.paths.serverHtmlPath, config.paths.serverHtmlOutput)
	]);
}

async function copyExtra() {
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
}

module.exports = {
	copyStatic,
	copyServer,
	copyExtra
};
