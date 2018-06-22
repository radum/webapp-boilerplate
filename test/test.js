const test = require('ava');
const execa = require('execa');

test('run [default]', async (t) => {
	const { stdout } = await execa('./tools/run.js', ['version']);
	t.true(stdout.length > 0);
});
