const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

const config = {
	isProd,
	server: {
		port: process.env.PORT,
		morganLogLevel: isProd ? 'combined' : 'dev',
		paths: {
			staticAssets: isProd ? path.resolve(__dirname, 'static') : path.resolve(__dirname, '../../build/static'),
			htmlTemplates: isProd ? path.resolve(__dirname, 'html') : path.resolve(__dirname, '../html'),
			scriptsManifestFile: isProd ?
				path.resolve(__dirname, 'static/scripts/manifest.json') : path.resolve(__dirname, '../../build/static/scripts/manifest.json'),
			assetsWebpackJsonFile: isProd ?
				path.resolve(__dirname, 'assets.json') : path.resolve(__dirname, '../../build/assets.json')
		}
	}
};

module.exports = config;
