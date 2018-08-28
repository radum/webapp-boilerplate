const joi = require('joi');
const config = require('../config');

// Webpack assets file
const webpackStaticAssetsObj = require(config.server.paths.assetsWebpackJsonFile);

const dataSchema = joi.object({
	assets: joi.object({
		scripts: joi.array().min(3).required()
	})
}).unknown().required();

module.exports = (script) => {
	const data = {
		assets: {
			scripts: []
		}
	};

	if (webpackStaticAssetsObj['runtime.js']) data.assets.scripts.push(webpackStaticAssetsObj['runtime.js']);
	if (webpackStaticAssetsObj['chunk-vendors.js']) data.assets.scripts.push(webpackStaticAssetsObj['chunk-vendors.js']);

	if (webpackStaticAssetsObj[script]) data.assets.scripts.push(webpackStaticAssetsObj[script]);

	const dataVars = joi.attempt(data, dataSchema)

	return dataVars;
};
