import now from 'lodash/now';
import $ from 'jquery';

import logger from './lib/logger';
import Controller from './controller';
import { $on } from './helpers';
import Template from './template';
import Store from './store';
import View from './view';

class App {
	constructor() {
		const store = new Store('todos-vanilla-es6');

		const template = new Template();
		const view = new View(template);

		/**
		 * @type {Controller}
		 */
		const controller = new Controller(store, view);

		const setView = () => controller.setView(document.location.hash);
		$on(window, 'load', setView);
		$on(window, 'hashchange', setView);

		$('body').append('jQuery fire to test webpack vendors split');
		// import(
		// 	/* webpackChunkName: "jquery" */
		// 	/* webpackMode: "lazy" */
		// 	'jquery'
		// ).then($ => {
		// 	$.default('body').append('jQuery fire to test webpack vendors split');
		// }).catch(
		// 	error => {
		// 		console.log(err);
		// 	}
		// );

		const testBabelNeedForRuntimeOrPolyfil = [6, -5, 8].find(x => x < 0);
		console.log(`Babel runtime or polyfil added and works: ${testBabelNeedForRuntimeOrPolyfil}`);

		logger.log(`App module a initialized! ${now()}`);
	}
}

export default App;
