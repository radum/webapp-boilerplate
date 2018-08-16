const express = require('express');
const config = require('../config');

const homePageRouter = express.Router();

// App template
const template = require(`${config.server.paths.htmlTemplates}/pages/about.marko`);

// Webpack assets
const webpackStaticAssetsObj = require(config.server.paths.assetsWebpackJsonFile);

// Template data
const data = {
	app: {
		isProd: config.isProd,
		domainName: process.env.APP_DOMAIN_NAME,
		webpackChunkManifestContent: false,
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

homePageRouter.get('/about', (req, res) => {
	// If the request is via HTTPS, change the browserSync host to HTTPS
	if (req.isSpdy) {
		data.app.browserSync.HOST = req.headers.host;
	}

	res.marko(template, data);
});

module.exports = homePageRouter;
