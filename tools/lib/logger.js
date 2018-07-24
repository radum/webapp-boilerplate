/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// TODO: DEPRECATED, Remove and deps also
const Reporter = require('./reporter');

const defaults = {
	verbose: false
};

class Logger {
	constructor(options = {}) {
		this.taskName = options.name || '';
		this.reporter = options.reporter || new Reporter(options.reporterOptions || {});

		this.options = Object.assign({}, defaults, options);

		this.reporter.taskname = this.taskName;
	}

	start(msg) {
		if (!this.reporter.start) {
			return;
		}

		this.reporter.start(msg);
	}

	log(msg) {
		if (!this.reporter.log) {
			return;
		}

		this.reporter.log(msg);
	}

	done(msg) {
		if (!this.reporter.done) {
			return;
		}

		this.reporter.done(msg);
	}

	error(msg) {
		if (!this.reporter.error) {
			return;
		}

		this.reporter.error(msg);
	}

	verbose() {
		return {
			log: (msg) => {
				if (this.options.verbose) {
					this.log(msg);
				}
			}
		};
	}
}

module.exports = Logger;
