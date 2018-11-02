const path = require('path');
const fs = require('fs');
const joi = require('joi');
const config = require('../config');

// Webpack assets file
const webpackStaticAssetsObj = require(config.server.paths.assetsWebpackJSONFile);
const stylesAssetsObj = require(config.server.paths.assetsStylesJSONFile);
let runtimeContent;

if (webpackStaticAssetsObj.runtime) {
	runtimeContent = fs.readFileSync(path.join(config.server.paths.staticAssets, webpackStaticAssetsObj.runtime.js), 'utf-8');
}

const dataSchema = joi.object({
	assets: joi.object({
		styles: joi.array().min(1).required(),
		scripts: joi.array().min(2).required(),
		runtimeContent: joi.string().default(false)
	})
}).unknown().required();

module.exports = (script) => {
	const data = {
		assets: {
			styles: [],
			scripts: []
		}
	};

	Object.keys(stylesAssetsObj).map((style) => data.assets.styles.push(stylesAssetsObj[style]));

	if (webpackStaticAssetsObj['chunk-vendors']) data.assets.scripts.push(webpackStaticAssetsObj['chunk-vendors'].js);

	if (webpackStaticAssetsObj[script]) data.assets.scripts.push(webpackStaticAssetsObj[script].js);

	if (runtimeContent) {
		data.assets.runtimeContent = runtimeContent;
	}

	const dataVars = joi.attempt(data, dataSchema)

	return dataVars;
};
