const defaults = {
	verbose: false
};

class Reporter {
	constructor(task, options) {
		this.taskName = task;
		this.options = Object.assign({}, defaults, options);
	}

	start(msg) {
		console.log(this.taskName + msg);
	}

	log(msg) {
		console.log(this.taskName + msg);
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

module.exports = Reporter;
