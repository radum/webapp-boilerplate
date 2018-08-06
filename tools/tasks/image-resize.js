const path = require('path');
const os = require('os');
const sharp = require('sharp');
const globby = require('globby');
const pMap = require('p-map');

const config = require('../config');
const fs = require('../lib/fs');

const sizes = [
	{ w: 200, h: 119 },
	{ w: 721, h: 430 },
	{ w: 1062, h: 633 },
	{ w: 1325, h: 789 },
	{ w: 1559, h: 929 },
	{ w: 1775, h: 105 },
	{ w: 1987, h: 118 },
	{ w: 2048, h: 122 }
];

// Try to enable the use of SIMD instructions. Seems to provide a smallish
// speedup on resizing heavy loads (~10%). Sharp disables this feature by
// default as there's been problems with segfaulting in the past but we'll be
// adventurous and see what happens with it on.
sharp.simd(true);

function imageResizeTask(options) {
	const logger = options.logger.scope('image-resize');
	logger.setScopeColor(config.taskColor[4]);

	logger.start('generating responsive images');

	const files = globby.sync([
		config.paths.imagesOutputDest + '/**/*.{jpg,jpeg,png,webp}',
		`!${config.paths.imagesOutputDest}/touch`
	]);
	let totalFiles = 0;

	const resize = (file) => fs.readFile(file, { encoding: null }).then((imgBuf) => {
		totalFiles += sizes.length;

		return Promise.all([
			...sizes.map(size => {
				return sharp(imgBuf)
					.resize(size.w)
					.toFile(file.replace(path.extname(file), '') + `_w_${size.w}${path.extname(file)}`)
			})
		]);
	});

	const mapper = (file) => {
		return Promise.all([
			resize(file)
		]);
	};

	return pMap(files, mapper, { concurrency: os.cpus().length }).then(() => {
		let msg = `minified ${totalFiles} images`;

		logger.success(msg);
	});
}

module.exports = imageResizeTask;
