/* global document */

// Global imports
// import 'babel-polyfill';
// import 'whatwg-fetch';
// import fastClick from 'fastclick';
import Raven from 'raven-js';
import now from 'lodash/now';
import App from './app';

// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick
// fastClick(document.body);

if (__SENTRY_DSN_URL__) {
	Raven
		.config(__SENTRY_DSN_URL__);
		.install();

	// TODO: Not sure I actually need this from Sentry
	Raven.context(() => {
		const app = new App();
	});
} else {
	const app = new App();
}
