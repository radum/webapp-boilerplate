/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const meow = require('meow');

const clean = require('./tasks/clean');

const cli = meow(`
	Usage
	  $ run dev
	  $ run build

	Options
	  --verbose, Verbose the logs

	Examples
	  $ foo dev --verbose
`, {
		flags: {
			verbose: {
				type: 'boolean'
			}
		}
	});

async function startDev() {
	await clean();
}

async function startBuild() {
	await clean();
}

switch (cli.input[0]) {
	case 'dev':
		startDev();
		break;
	case 'build':
		startBuild();
		break;
	default:
		startBuild();
		break;
}
