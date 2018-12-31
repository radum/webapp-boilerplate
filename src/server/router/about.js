const config = require('../config');
const pageDataAssets = require('../data/page-data-assets');
const pageData = require('../data/page-data');

// App template
const template = `${config.server.paths.htmlTemplates}/pages/about.pug`;

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
	res.render(template, data);
}

module.exports = aboutPageRouter;
