const os = require('os');
const globby = require('globby');
const pMap = require('p-map');
const brotliCompress = require('iltorb').compress;

const { config } = require('../config');
const fs = require('../lib/fs');

// TODO: https://github.com/Alorel/shrink-ray
function compression(options) {
	const reporter = options.reporter('compression', { color: config.taskColor[0] });

	reporter.emit('start', 'compressing asstes (js, css)');

	const files = globby.sync([
		config.paths.scriptsOutputDest + '/**/*.js',
		config.paths.staticAssetsOutput + '/sw.js',
		config.paths.stylesOutputDest + '/**/*.css'
	]);
	let totalFiles = 0;

	const compress = file =>
		fs.readFile(file, { encoding: null }).then(async fileBuffer => {
			totalFiles += 1;

			try {
				const output = await brotliCompress(fileBuffer);

				fs.writeFile(`${file}.br`, output);

				reporter.emit('info', `compressed ${file}.br`);
			} catch (error) {
				reporter.emit('error', error);
			}
		});

	return pMap(files, compress, { concurrency: os.cpus().length }).then(() => {
		let msg = `compressed ${totalFiles} files`;

		reporter.emit('done', msg);
	});
}

module.exports = compression;
