/* global $ */

import $ from 'jquery';
import Console from './lib/console';

class Hello {
	constructor() {
		this.reply = 'Hello!';
		this.logger = new Console();
	}

	hi(name) {
		this.logger.log(this.reply + ' ' + name);
	}

	domUpdate() {
		setTimeout(() => {
			$('body').css('background-color', '#FF7043');
		}, 2000);
	}
}

export default Hello;
