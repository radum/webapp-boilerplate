/* global document, __SENTRY_DSN_URL__ */

// Global imports
// import 'babel-polyfill';
// import 'whatwg-fetch';
// import fastClick from 'fastclick';
import Raven from 'raven-js';
import App from './app';

// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick
// fastClick(document.body);

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
