const path = require('path');
const common = require('./common');

const morganDevLog = ':timestamp :method :url :status :response-time ms - :res[content-length]';

const config = {
	server: {
		port: process.env.PORT,
		https_port: process.env.HTTPS_PORT,
		morganLogLevel: common.isProd ? 'combined' : morganDevLog,
		paths: {
			staticAssets: common.isProd ? path.resolve(__dirname, '../../../static') : path.resolve(__dirname, '../../../../build/static'),
			htmlTemplates: common.isProd ? path.resolve(__dirname, '../../../html') : path.resolve(__dirname, '../../../html'),
			assetsWebpackJSONFile: common.isProd ?
				path.resolve(__dirname, '../../../asset-manifest-script-modern.json') : path.resolve(__dirname, '../../../../build/asset-manifest-script-modern.json'),
			assetsLegacyWebpackJSONFile: common.isProd ?
				path.resolve(__dirname, '../../../asset-manifest-script-legacy.json') : path.resolve(__dirname, '../../../../build/asset-manifest-script-legacy.json'),
			assetsStylesJSONFile: common.isProd ?
				path.resolve(__dirname, '../../../asset-manifest-style.json') : path.resolve(__dirname, '../../../../build/asset-manifest-style.json')
		}
	}
};

module.exports = config;
