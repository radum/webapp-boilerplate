const config = require('../config');
const pageDataAssets = require('../data/page-data-assets');
const pageData = require('../data/page-data');

// App template
// const template = require(`${config.server.paths.htmlTemplates}/pages/about.html`);

// Template data
const data = {
	app: {
		...pageData,
		...pageDataAssets('about.js')
	},
	page: {

	}
};

function aboutPageRouter (req, res) {
	// res.marko(template, data);
	res.render('pages/about', { data: data });
}

module.exports = aboutPageRouter;
