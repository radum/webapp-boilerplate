/* global __SENTRY_DSN_URL__, __DEV__ */

// Global imports

/**
 * Polyfills are necessary for enabling features like Promise, Symbol in environments that do not have support for them.
 * This is important when differentiating between what Babel does as a compiler (transforms syntax)
 * vs. a polyfill (implements built-in functions/objects). https://babeljs.io/blog/2018/08/27/7.0.0#automatic-polyfilling-experimental
 * Babel applies syntactical transforms to our ES6+ code nothing more. Built-in features introduced in ES6+ — such as Promise, Map and Set,
 * and new array and string methods — still need to be polyfilled.
 *
 * 		import "@babel/polyfill"; // This loads all polyfills
 *
 * It includes the whole polyfill, and you may not need to import everything if browsers support it already.
 * The option "useBuiltIns: "usage" (set in .babelrc) is Babel's first attempt at enabling something like that.
 */

// https://github.com/github/fetch
// import 'whatwg-fetch';
import Raven from 'raven-js';
import App from './App';

// Make sure you set the `SENTRY_DSN_URL` env var via .env files
// if you need this to work in the code, as the entire IF will be skiped on compile
if (__SENTRY_DSN_URL__ && !__DEV__) {
	Raven
		.config(__SENTRY_DSN_URL__, {
			// TODO: Make this available from webpack as a defined var or something else
			release: '0.0.1'
		})
		.install();

	// TODO: Not sure I actually need this from Sentry
	Raven.context(() => {
		const app = new App();

		app.init();
	});
} else {
	const app = new App();

	app.init();
}
