const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
	appSrc: resolveApp('src'),
	appPath: resolveApp('.'),
	appNodeModules: resolveApp('node_modules'),
	appJsConfig: resolveApp('jsconfig.json'),
}
