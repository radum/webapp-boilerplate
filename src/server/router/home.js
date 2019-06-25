'use strict';
const config = require('../config');
const pageDataAssets = require('../data/page-data-assets');
const pageData = require('../data/page-data');

// App template
const template = require(`${config.server.paths.htmlTemplates}/pages/home.marko`);

// Template data
const data = {
	app: {
		...pageData,
		...pageDataAssets('main')
	},
	page: {

	}
};

function homePageRouter (req, res) {
	res.marko(template, data);
}

module.exports = homePageRouter;
