const test = require('ava');
const TaskError = require('./../tools/lib/task-error').TaskError;

function doSomethingBadConstructor() {
	throw new TaskError('It went bad! constructor', 'task');
}

try {
	doSomethingBadConstructor();
} catch (error) {
	test('The name property should be set to the error\'s name', (t) => {
		t.true(error.name === 'TaskError');
	});

	test('The error should be an instance of its class', (t) => {
		t.true(error instanceof TaskError);
	});

	test('The error should be an instance of builtin Error', (t) => {
		t.true(error instanceof Error);
	});

	test('The error should be recognized by Node.js\' util#isError', (t) => {
		t.true(require('util').isError(error));
	});

	test('The error should have recorded a stack', (t) => {
		t.true(error.stack !== undefined);
	});

	test('toString should return the default error message formatting', (t) => {
		t.deepEqual(error.toString(), 'TaskError: It went bad! constructor');
	});

	test('The stack should start with the default error message formatting', (t) => {
		t.deepEqual(error.stack.split('\n')[0], 'TaskError: It went bad! constructor');
	});

	test('The first stack frame should be the function where the error was thrown.', (t) => {
		t.deepEqual(error.stack.split('\n')[1].indexOf('doSomethingBadConstructor'), 7);
	});

	test('The errorType property should have been set', (t) => {
		t.deepEqual(error.errorType, 'task');
	});

	test('The isAppError property should be true', (t) => {
		t.true(error.isAppError);
	});
}
