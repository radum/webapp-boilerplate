const config = require('../config');
const pageDataAssets = require('../data/page-data-assets');
const pageData = require('../data/page-data');

// App template
const template = `${config.server.paths.htmlTemplates}/pages/home.pug`;

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
	res.render(template, data);
}

module.exports = homePageRouter;
