/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

/**
 * Read the content of a file and return a Promise
 *
 * @param {String} file - File name / path to read
 * @returns Promise
 */
const readFile = (file, opts) => new Promise((resolve, reject) => {
	fs.readFile(
		file,
		{
			encoding: (opts.encoding === undefined) ? 'utf8' : opts.encoding
		},
		(err, data) => (err ? reject(err) : resolve(data))
	);
});

/**
 * Write content to a file
 *
 * @param {String} file - File name / path to read
 * @param {String} contents - File content
 * @returns Promise
 */
const writeFile = (file, contents) => new Promise((resolve, reject) => {
	fs.writeFile(file, contents, { encoding: Buffer.isBuffer(contents) ? null : 'utf8' }, err => (err ? reject(err) : resolve()));
});

/**
 * Copy file from source to target location
 * @param {String} source Source location of the file
 * @param {String} target Target location of the copied file
 */
const copyFile = (source, target) => new Promise((resolve, reject) => {
	let cbCalled = false;

	function done(err) {
		if (!cbCalled) {
			cbCalled = true;
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		}
	}

	const rd = fs.createReadStream(source);

	rd.on('error', err => done(err));

	const wr = fs.createWriteStream(target);

	wr.on('error', err => done(err));
	wr.on('close', err => done(err));

	rd.pipe(wr);
});

/**
 * Rename a file
 * @param {String} source
 * @param {String} target
 */
const renameFile = (source, target) => new Promise((resolve, reject) => {
	fs.rename(source, target, err => (err ? reject(err) : resolve()));
});

/**
 * Create a new folder
 * @param {String} name Folder name
 */
const makeDir = name => new Promise((resolve, reject) => {
	mkdirp(name, err => (err ? reject(err) : resolve()));
});

const readDir = (pattern, options) => globby(pattern, options);

const moveDir = async (source, target) => {
	const dirs = await readDir('**/*.*', {
		cwd: source,
		nosort: true,
		dot: true
	});

	await Promise.all(dirs.map(async (dir) => {
		const from = path.resolve(source, dir);
		const to = path.resolve(target, dir);
		await makeDir(path.dirname(to));
		await renameFile(from, to);
	}));
};

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

const cleanDir = (pattern, options) => new Promise((resolve, reject) => {
	rimraf(pattern, { glob: options }, (err, result) => (err ? reject(err) : resolve(result)));
});

module.exports = {
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
