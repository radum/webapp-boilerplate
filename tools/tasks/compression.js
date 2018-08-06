const os = require('os');
const globby = require('globby');
const pMap = require('p-map');
const brotliCompress = require('iltorb').compress;

const config = require('../config');
const fs = require('../lib/fs');

async function compression(options) {
	const logger = options.logger.scope('compression');
	logger.setScopeColor(config.taskColor[0]);

	logger.start('compressing asstes (js, css)');

	const files = globby.sync(config.paths.scriptsOutputDest + '/**/*.js');
	let totalFiles = 0;

	const compress = (file) => fs.readFile(file, { encoding: null }).then((fileBuffer) => {
		totalFiles += 1;

		try {
			const output = await brotliCompress(fileBuffer);

			fs.writeFile(`${file}.br`, output);
		} catch(err) {
			logger.error(err);
		}
	});

	return pMap(files, compress, { concurrency: os.cpus().length }).then(() => {
		let msg = `compressed ${totalFiles} files`;

		logger.success(msg);
	});
}

module.exports = compression;
