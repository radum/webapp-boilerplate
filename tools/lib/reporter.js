/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}], no-underscore-dangle: off, no-console: off */

// TODO: DEPRECATED, Remove and deps also
const chalk = require('chalk');
const Randoma = require('randoma');
const ora = require('ora');
const figures = require('figures');
const indentString = require('indent-string');
const humanizeMs = require('ms');
const timestamp = require('time-stamp');

function getTimestamp() {
	return '[' + chalk.grey(timestamp('HH:mm:ss')) + ']';
}

const defaults = {
	verbose: false
};

const ICONS = {
	start: figures('●'),
	info: figures('ℹ'),
	success: figures('✔'),
	error: figures('✖'),
	fatal: figures('✖'),
	warn: figures('⚠'),
	debug: figures('…'),
	trace: figures('…'),
	default: figures('❯'),
	ready: figures('♥')
}

const tasks = {};

class Reporter {
	constructor(options = {}) {
		this.options = Object.assign({}, defaults, options);

		this.prefixColor = '#FFFFFF';
		this.taskName = 'default';
		this.spinner = ora(this.taskName);
	}

	set taskname(name) {
		this.taskName = name;
		// this.prefixColor = (new Randoma({ seed: `${Randoma.seed()}` })).color(0.75).hex().toString();
	}

	chalkColor(text) {
		return chalk.hex(this.prefixColor)(text);
	}

	_getPrefix() {
		return getTimestamp() + ' ' + this.chalkColor(this.taskName);
	}

	start(msg) {
		tasks[this.taskName] = {
			totalTime: +new Date()
		};

		let text = chalk.blue(`${ICONS.start} start`);
		if (msg) {
			text += ' ' + msg;
		}

		console.log(this._getPrefix() + ' ' + chalk.yellow(`${text}`));
	}

	log(msg) {
		console.log(this._getPrefix() + ' ' + chalk.yellow(`${figures.pointerSmall} ${msg}`));
	}

	done(msg) {
		const text = msg ? `success - ${msg}` : 'success';
		const time = chalk.gray(humanizeMs(new Date() - tasks[this.taskName].totalTime));

		console.log(this._getPrefix() + ' ' + chalk.green(`${ICONS.success} ${text}`) + ' ' + time);
	}

	error(msg) {
		const text = msg ? `task error - ${msg}` : 'task error';

		console.error(this._getPrefix() + ' ' + chalk.red(`${figures.cross} ${text}`));
	}
}

module.exports = Reporter;
