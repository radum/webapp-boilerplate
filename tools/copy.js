/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const config = require('./config');
const fs = require('./lib/fs');
const pkg = require('../package.json');

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 *
 * @returns Promise
 */
async function copy() {
	await fs.makeDir(config.paths.buildPath);
	await Promise.all([
		fs.writeFile(config.paths.buildPath + '/package.json', JSON.stringify({
			private: true,
			engines: pkg.engines,
			dependencies: pkg.dependencies,
			scripts: {
				start: 'node server.js',
			},
		}, null, 2)),
		fs.copyDir(config.paths.staticAssets, 'build/static')
	]);
}

module.exports = copy;
