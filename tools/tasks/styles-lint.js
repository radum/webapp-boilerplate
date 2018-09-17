const path = require('path');
const stylelint = require('stylelint');
const stylelintFormatter = require('stylelint-formatter-pretty');
const { config } = require('../config');

function stylesLint(options) {
	const reporter = options.reporter('styles-lint', { color: config.taskColor[0] });
	reporter.emit('start', 'linting styles with stylelint');

	const task = stylelint.lint({
		files: path.resolve(config.paths.styles),
		formatter: stylelintFormatter,
		syntax: 'scss',
		cache: true,
		cacheLocation: path.resolve(config.paths.cacheFolder + '/.stylelintcache')
	});

	task
		.then((data) => {
			if (data.errored) {
				reporter.emit('error', 'stylelint violations 💥' + data.output);
			} else {
				reporter.emit('fav', 'no violations found 🎉');
			}

			reporter.emit('done');
		})
		.catch((err) => {
			reporter.emit('error', err);
		});

	return task;
}

module.exports = stylesLint;
