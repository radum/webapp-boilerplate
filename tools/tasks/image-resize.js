const path = require('path');
const os = require('os');
const sharp = require('sharp');
const globby = require('globby');
const pMap = require('p-map');

const TaskError = require('../lib/task-error').TaskError
const { config } = require('../config');
const fs = require('../lib/fs');

const defaultSizes = [
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

/**
 * Resize responsive images task
 * @param {Object} options - Options object
 * @returns {Promise} Promise object
 */
function imageResizeTask(options) {
	const reporter = options.reporter('image-image', { color: config.taskColor[4] });
	reporter.emit('start', 'generating responsive images');

	const sizes = [
		...defaultSizes,
		...(options.sizes ? options.sizes : [])
	];
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
		const msg = `generated ${totalFiles} new images`;

		reporter.emit('done', msg);

		return(msg);
	});
}

module.exports = imageResizeTask;
