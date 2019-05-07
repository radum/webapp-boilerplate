const fs = require('fs');
const path = require('path');
const paths = require('./paths');

/**
 * Get the baseUrl of a compilerOptions object.
 *
 * @param {Object} options jsconfig compilerOptions
 * @returns {Array} baseUrl array path
 */
function getAdditionalModulePaths(options = {}) {
	const baseUrl = options.baseUrl;

	// We need to explicitly check for null and undefined (and not a falsy value) because
	// TypeScript treats an empty string as `.`.
	if (baseUrl == null) {
		// If there's no baseUrl set we respect NODE_PATH
		// Note that NODE_PATH is deprecated and will be removed
		// in the next major release of create-react-app.
		const nodePath = process.env.NODE_PATH || '';

		return nodePath.split(path.delimiter).filter(Boolean);
	}

	const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

	// We don't need to do anything if `baseUrl` is set to `node_modules`. This is the default behavior.
	if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
		return null;
	}

	// Allow the user set the `baseUrl` to `appSrc`.
	if (path.relative(paths.appSrc, baseUrlResolved) === '') {
		return [paths.appSrc];
	}

	// Otherwise, throw an error.
	throw new Error(
		console.log(
			"Your project's `baseUrl` can only be set to `src` or `node_modules`." +
			' Create React App does not support other values at this time.'
		)
	);
}

function getModules() {
	const hasJsConfig = fs.existsSync(paths.appJsConfig);
	let jsConfig = {};

	if (hasJsConfig) {
		jsConfig = require(paths.appJsConfig);
	}

	const options = jsConfig.compilerOptions || {};

	const additionalModulePaths = getAdditionalModulePaths(options);

	return {
		additionalModulePaths: additionalModulePaths
	};
}

module.exports = getModules();
