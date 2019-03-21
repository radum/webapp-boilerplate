const fs = require('fs');
const path = require('path');
const globby = require('globby');
const makeDir = require('make-dir');
const rimraf = require('rimraf');

/**
 * Check synchronously if a file exists or not
 * @param {Path} file - Path to file
 * @returns {Boolean} Boolean value
 */
const fileExists = (file) => {
	return fs.existsSync(file);
};

/**
 * Read the content of a file and return a Promise
 * @param {String} file - File name / path to read
 * @param {Object} opts - Options object
 * @returns {Promise} Promise object
 */
const readFile = (file, opts) => new Promise((resolve, reject) => {
	fs.readFile(
		file,
		{
			encoding: (opts.encoding === undefined) ? 'utf8' : opts.encoding
		},
		(error, data) => (error ? reject(new Error(error)) : resolve(data))
	);
});

/**
 * Write content to a file
 * @param {String} file - File name / path to read
 * @param {String} contents - File content
 * @returns {Promise} Promise obkecy
 */
const writeFile = (file, contents) => new Promise((resolve, reject) => {
	fs.writeFile(file, contents, { encoding: Buffer.isBuffer(contents) ? null : 'utf8' }, error => (error ? reject(new Error(error)) : resolve()));
});

/**
 * Copy file from source to target location
 * @param {String} source - Source location of the file
 * @param {String} target - Target location of the copied file
 * @returns {Promise} Execution promise
 */
const copyFile = (source, target) => new Promise((resolve, reject) => {
	let cbCalled = false;

	function done(error) {
		if (!cbCalled) {
			cbCalled = true;
			if (error) {
				reject(new Error(error));
			} else {
				resolve();
			}
		}
	}

	const rd = fs.createReadStream(source);

	rd.on('error', error => done(error));

	const wr = fs.createWriteStream(target);

	wr.on('error', error => done(error));
	wr.on('close', error => done(error));

	rd.pipe(wr);
});

/**
 * Rename a file
 * @param {String} source - File source path
 * @param {String} target - File target path
 * @returns {Promise} Promise object
 */
const renameFile = (source, target) => new Promise((resolve, reject) => {
	fs.rename(source, target, error => (error ? reject(new Error(error)) : resolve()));
});

/**
 * Read directory as a glob promise
 * @param {(String|Array)} pattern - Globby pattern
 * @param {Object} options - Options object
 * @returns {Promise} Promise object
 */
const readDir = (pattern, options) => globby(pattern, options);

/**
 * Move direcotry from source to target location
 * @param {String} source - Source directory
 * @param {String} target - Target location
 */
const moveDir = async (source, target) => {
	const dirs = await readDir('**/*.*', {
		cwd: source,
		nosort: true,
		dot: true,
		nodir: true
	});

	await Promise.all(dirs.map(async (dir) => {
		const from = path.resolve(source, dir);
		const to = path.resolve(target, dir);
		await makeDir(path.dirname(to));
		await renameFile(from, to);
	}));
};

/**
 * Copy directory from source to target path
 * @param {String} source Path of the source directory
 * @param {String} target Path to the destination directory
 */
const copyDir = async (source, target) => {
	const dirs = await readDir('**/*.*', {
		cwd: source,
		nosort: true,
		dot: true,
	});

	await Promise.all(dirs.map(async (dir) => {
		const from = path.resolve(source, dir);
		const to = path.resolve(target, dir);

		await makeDir(path.dirname(to));
		await copyFile(from, to);
	}));
};

/**
 * Clean a directory
 * @param {String} pattern to be used by rimraf to remove them from the fs
 * @param {Object} options object
 * @returns {Promise} Promise object
 */
const cleanDir = (pattern, options) => new Promise((resolve, reject) => {
	rimraf(pattern, { glob: options }, (error) => (error ? reject(new Error(error)) : resolve()));
});

module.exports = {
	fileExists,
	readFile,
	writeFile,
	renameFile,
	copyFile,
	readDir,
	makeDir,
	copyDir,
	moveDir,
	cleanDir
};
