'use strict';
const config = require('../config');
const pageDataAssets = require('../data/page-data-assets');
const pageData = require('../data/page-data');

// App template
const template = require(`${config.server.paths.htmlTemplates}/pages/about.marko`);

// Template data
const data = {
	app: {
		...pageData,
		...pageDataAssets('about')
	},
	page: {

	}
};

function aboutPageRouter (req, res) {
	res.marko(template, data);
}

module.exports = aboutPageRouter;
