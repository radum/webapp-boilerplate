/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

module.exports = (gulp, plugins, blueprint) => {
	// var webpackConfig = webpackMultiConfig('development');
	const compiler = webpack(blueprint.webpackConfig);

	blueprint.browserSync.init({
		server: {
			baseDir: 'build'
		},
		middleware: [
			webpackDevMiddleware(compiler, {
				publicPath: blueprint.webpackConfig.output.publicPath,
				stats: 'errors-only'
			}),
			webpackHotMiddleware(compiler)
		]
	});
};
