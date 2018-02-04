/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}], no-underscore-dangle: off, no-console: off */

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
		this.prefixColor = (new Randoma({ seed: `${name}x` })).color().hex().toString();
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

		const text = msg ? `Starting - ${msg}` : 'Starting';

		console.log(this._getPrefix() + ' ' + chalk.yellow(`${figures.arrowRight} ${text}`));
	}

	log(msg) {
		console.log(this._getPrefix() + ' ' + chalk.yellow(`${figures.pointerSmall} ${msg}`));
	}

	done(msg) {
		const text = msg ? `done - ${msg}` : 'done';
		const time = chalk.gray(humanizeMs(new Date() - tasks[this.taskName].totalTime));

		console.log(this._getPrefix() + ' ' + chalk.green(`${figures.tick} ${text}`) + ' ' + time);
	}

	error(msg) {
		const text = msg ? `Task error - ${msg}` : 'Task error';

		console.error(this._getPrefix() + ' ' + chalk.red(`${figures.cross} ${text}`));
	}
}

module.exports = Reporter;
