const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

const morganDevLog = ':timestamp :method :url :status :response-time ms - :res[content-length]';

const config = {
	isProd,
	server: {
		port: process.env.PORT,
		https_port: process.env.HTTPS_PORT,
		morganLogLevel: isProd ? 'combined' : morganDevLog,
		paths: {
			staticAssets: isProd ? path.resolve(__dirname, '../static') : path.resolve(__dirname, '../../../build/static'),
			htmlTemplates: isProd ? path.resolve(__dirname, '../html') : path.resolve(__dirname, '../../html'),
			scriptsManifestFile: isProd ?
				path.resolve(__dirname, '../static/scripts/asset-manifest.json') : path.resolve(__dirname, '../../../build/static/scripts/asset-manifest.json'),
			assetsWebpackJsonFile: isProd ?
				path.resolve(__dirname, '../assets.json') : path.resolve(__dirname, '../../../build/assets.json')
		}
	}
};

module.exports = config;
