const path = require('path');
const fs = require('fs');
const joi = require('joi');
const config = require('../config');

// Webpack assets file
const webpackStaticAssetsObj = require(config.server.paths.assetsWebpackJsonFile);
let runtimeContent;

if (webpackStaticAssetsObj['runtime.js']) {
	runtimeContent = fs.readFileSync(path.join(config.server.paths.staticAssets, webpackStaticAssetsObj['runtime.js']), 'utf-8');
}

const dataSchema = joi.object({
	assets: joi.object({
		scripts: joi.array().min(2).required(),
		runtimeContent: joi.string().default(false)
	})
}).unknown().required();

module.exports = (script) => {
	const data = {
		assets: {
			scripts: []
		}
	};

	if (webpackStaticAssetsObj['chunk-vendors.js']) data.assets.scripts.push(webpackStaticAssetsObj['chunk-vendors.js']);

	if (webpackStaticAssetsObj[script]) data.assets.scripts.push(webpackStaticAssetsObj[script]);

	if (runtimeContent) {
		data.assets.runtimeContent = runtimeContent;
	}

	const dataVars = joi.attempt(data, dataSchema)

	return dataVars;
};
