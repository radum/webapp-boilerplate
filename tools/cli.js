/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const meow = require('meow');

const cli = meow(`
	Usage
	  $ run dev
	  $ run build

	Options
	  --verbose, Verbose the logs
	  --release, Build a release

	Examples
	  $ npm run dev
	  $ npm run dev:verbose
	  $ npm run dev:release
	  $ npm run dev:analyze
`, {
	flags: {
		verbose: {
			type: 'boolean'
		},
		release: {
			type: 'boolean'
		},
		analyze: {
			type: 'boolean'
		}
	}
});

module.exports = cli;
