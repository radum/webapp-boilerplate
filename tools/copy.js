/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import path from 'path';
import chokidar from 'chokidar';
import { writeFile, copyFile, makeDir, copyDir, cleanDir } from './lib/fs';
import pkg from '../package.json';

/**
* Copies static files such as robots.txt, favicon.ico to the
* output (build) folder.
*/
async function copy() {
	await makeDir('build');
	await Promise.all([
		writeFile('build/package.json', JSON.stringify({
			private: true,
			engines: pkg.engines,
			dependencies: pkg.dependencies,
			scripts: {
				start: 'node server.js',
			},
		}, null, 2)),
		// // copyFile('LICENSE.txt', 'build/LICENSE.txt'),
		copyDir('static', 'build/static'),
	]);
}

export default copy;
