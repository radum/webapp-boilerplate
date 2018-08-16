const express = require('express');
const config = require('../config');

const homePageRouter = express.Router();

// App template
const template = require(`${config.server.paths.htmlTemplates}/pages/index.marko`);

// Webpack assets
const webpackStaticAssetsObj = require(config.server.paths.assetsWebpackJsonFile);

// Template data
const data = {
	app: {
		isProd: config.isProd,
		domainName: process.env.APP_DOMAIN_NAME,
		// TODO: Removed for now because not sure how Webpack 4 works and I removed
		// soundcloud/chunk-manifest-webpack-plugin as it was to old, alternative should be found if
		// is really needed now with Webpack 4
		webpackChunkManifestContent: false, // fs.readFileSync(config.server.paths.XXX),
		assets: {
			scripts: [],
		},
		browserSync: {
			HOST: '',
		}
	},
	page: {

	}
};

if (webpackStaticAssetsObj['runtime.js']) data.app.assets.scripts.push(webpackStaticAssetsObj['runtime.js']);
if (webpackStaticAssetsObj['chunk-vendors.js']) data.app.assets.scripts.push(webpackStaticAssetsObj['chunk-vendors.js']);
data.app.assets.scripts.push(webpackStaticAssetsObj['main.js']);

homePageRouter.get('/', (req, res) => {
	// If the request is via HTTPS, change the browserSync host to HTTPS
	if (req.isSpdy) {
		data.app.browserSync.HOST = req.headers.host;
	}

	res.marko(template, data);
});

module.exports = homePageRouter;
