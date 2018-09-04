/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminWebp = require('imagemin-webp');
const globby = require('globby');
const os = require('os');
const prettyBytes = require('pretty-bytes');
const pMap = require('p-map');
const replaceExt = require('replace-ext');
const chalk = require('chalk');

const { config } = require('../config');
const fs = require('../lib/fs');

async function imageminTask(options) {
	const logger = options.logger.scope('imagemin');
	logger.setScopeColor(config.taskColor[4]);

	logger.start('minify images seamlessly');

	const files = globby.sync(config.paths.imagesPath + '/**/*.{jpg,jpeg,png}');

	const pluginsDefault = [
		imageminMozjpeg({
			quality: 80,
			progressive: true
		}),
		imageminOptipng()
	];

	const pluginsWebP = [
		imageminWebp({
			quality: 75,
			method: 6
		})
	];

	let totalBytes = 0;
	let totalSavedBytes = 0;
	let totalFiles = 0;

	const processFile = (file, plugins, opts) => fs.readFile(file, { encoding: null })
		.then(buf => Promise.all([imagemin.buffer(buf, { plugins }), buf]))
		.then((imageminBuf) => {
			const optimizedBuf = imageminBuf[0];
			const originalBuf = imageminBuf[1];
			const originalSize = originalBuf.length;
			const optimizedSize = optimizedBuf.length;
			const saved = originalSize - optimizedSize;
			const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
			const savedMsg = `saved ${prettyBytes(saved)} - ${percent.toFixed(1).replace(/\.0$/, '')}%`;
			const msg = saved > 0 ? savedMsg : 'already optimized';
			let destFile = file.replace(config.paths.imagesPath, config.paths.imagesOutputDest)

			if (saved > 0) {
				totalBytes += originalSize;
				totalSavedBytes += saved;
				totalFiles += 1;
			}

			if (opts && opts.ext) {
				destFile = replaceExt(destFile, opts.ext);
			}

			fs.writeFile(destFile, optimizedBuf);

			logger.info(destFile + chalk.gray(` (${msg})`));
		})
		.catch((err) => {
			logger.error(`${err} in file ${file}`);
		});

	const mapper = (file) => {
		return Promise.all([
			processFile(file, pluginsDefault),
			processFile(file, pluginsWebP, { ext: '.webp' })
		]);
	};

	return pMap(files, mapper, { concurrency: os.cpus().length }).then(() => {
		const percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
		let msg = `minified ${totalFiles} images`;

		if (totalFiles > 0) {
			msg += chalk.gray(` (saved ${prettyBytes(totalSavedBytes)} - ${percent.toFixed(1).replace(/\.0$/, '')}%)`);
		}

		logger.success(msg);
	});
}

module.exports = imageminTask;
