const config = require('../config');
const pageDataAssets = require('../data/page-data-assets');
const pageData = require('../data/page-data');

// App template
// const template = require(`${config.server.paths.htmlTemplates}/pages/home.html`);

// Template data
const data = {
	app: {
		...pageData,
		...pageDataAssets('main.js')
	},
	page: {
		x: 1
	}
};

function homePageRouter (req, res) {
	// res.marko(template, data);
	res.render('pages/home', { data: data });
}

module.exports = homePageRouter;
