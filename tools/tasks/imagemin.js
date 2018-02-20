/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const globby = require('globby');
const os = require('os');
const prettyBytes = require('pretty-bytes');
const chalk = require('chalk');
const pMap = require('p-map');

const config = require('../config');
const fs = require('../lib/fs');
const Logger = require('../lib/logger');

async function imageminTask(options = { isVerbose: false }) {
	const logger = new Logger({
		name: 'imagemin',
		isVerbose: options.isVerbose
	});

	logger.start('minify images seamlessly');

	const files = globby.sync(config.paths.imagesPath + '/**/*.{jpg,jpeg,png}');

	const plugins = [
		imageminMozjpeg({
			quality: 80,
			progressive: true
		}),
		imageminOptipng()
	];

	let totalBytes = 0;
	let totalSavedBytes = 0;
	let totalFiles = 0;

	const processFile = file => fs.readFile(file, { encoding: null })
		.then(buf => Promise.all([imagemin.buffer(buf, { plugins }), buf]))
		.then((res) => {
			// TODO: Use destructuring when targeting Node.js 6
			const optimizedBuf = res[0];
			const originalBuf = res[1];
			const originalSize = originalBuf.length;
			const optimizedSize = optimizedBuf.length;
			const saved = originalSize - optimizedSize;
			const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
			const savedMsg = `saved ${prettyBytes(saved)} - ${percent.toFixed(1).replace(/\.0$/, '')}%`;
			const msg = saved > 0 ? savedMsg : 'already optimized';

			if (saved > 0) {
				totalBytes += originalSize;
				totalSavedBytes += saved;
				totalFiles += 1;
			}

			fs.writeFile(file.replace(config.paths.imagesPath, config.paths.imagesOutputDest), optimizedBuf);
			logger.log(file + chalk.gray(` (${msg})`));
		})
		.catch((err) => {
			logger.log(`${err} in file ${file}`);
		});


	return pMap(files, processFile, { concurrency: os.cpus().length }).then(() => {
		const percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
		let msg = `minified ${totalFiles} images`;

		if (totalFiles > 0) {
			msg += chalk.gray(` (saved ${prettyBytes(totalSavedBytes)} - ${percent.toFixed(1).replace(/\.0$/, '')}%)`);
		}

		logger.done(msg);
	});
}

module.exports = imageminTask;
