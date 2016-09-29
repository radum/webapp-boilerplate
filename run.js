'use strict';

const includes = require('array-includes')

// TODO Remove this polyfill and bump dep to Node 6
includes.shim();
includes.getPolyfill();

const fs = require('fs');
const del = require('del');
var _ = require('lodash');
const webpack = require('webpack');

// TODO: Update configuration settings
const config = {
	title: 'Webapp webpack Boilerplate',      // Your website title
	url: 'https://radumicu.com',              // Your website URL
	project: 'webapp-boilerplate-webpack',    // Firebase project. See README.md -> How to Deploy
	trackingID: 'UA-XXXXX-Y',                 // Google Analytics Site's ID
};

// The collection of automation tasks ('clean', 'build', 'publish', etc.)
const tasks = new Map();

// Loadah settings
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

/**
 * Task runner function
 * @param  {String} task Task name to run
 * @return {Promise}     Running task promise
 */
function run(task) {
	const start = new Date();

	console.log(`Starting '${task}'...`);

	return Promise.resolve().then(() => tasks.get(task)()).then(() => {
		console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
	}, err => console.error(err.stack));
}

// Clean up the output directory
// --------------------------------------------------------------
tasks.set('clean', () => del(['app/dist/*', '!app/dist/.git'], { dot: true }));

// Copy ./index.html into the /dist folder
// --------------------------------------------------------------
tasks.set('html', () => {
	const webpackConfig = require('./webpack.config');
  	const assets = JSON.parse(fs.readFileSync('./app/dist/assets.json', 'utf8'));
	const template = fs.readFileSync('./app/index.html.tpl', 'utf8');
	const render = _.template(template);
	const output = render({
		debug: webpackConfig.debug,
		bundle: assets.main.js,
		title: config.title
	});

	fs.writeFileSync('./app/index.html', output, 'utf8');
});

// Build website into a distributable format
// --------------------------------------------------------------
tasks.set('bundle', () => {
	const webpackConfig = require('./webpack.config');

	return new Promise((resolve, reject) => {
		webpack(webpackConfig).run((err, stats) => {
			if (err) {
				reject(err);
			} else {
				console.log(stats.toString(webpackConfig.stats));
				resolve();
			}
		});
	});
});

// Build website into a distributable format
// --------------------------------------------------------------
tasks.set('build', () => {
	global.DEBUG = process.argv.includes('--debug') || false;

	return Promise.resolve()
		.then(() => run('clean'))
		.then(() => run('bundle'))
		.then(() => run('html'))
});

// Build website and launch it in a browser for testing (default)
// --------------------------------------------------------------
tasks.set('start', () => {
	let count = 0;

	global.HMR = !process.argv.includes('--no-hmr'); // Hot Module Replacement (HMR)

	return run('clean').then(() => new Promise(resolve => {
		const bs = require('browser-sync').create();
		const webpackConfig = require('./webpack.config');
		const compiler = webpack(webpackConfig);

		// Node.js middleware that compiles application in watch mode with HMR support
    	// http://webpack.github.io/docs/webpack-dev-middleware.html
    	const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
    		publicPath: webpackConfig.output.publicPath,
    		stats: webpackConfig.stats
    	});

    	compiler.plugin('done', stats => {
    		const bundle = stats.compilation.chunks.find(x => x.name === 'main').files[0];
			const template = fs.readFileSync('./app/index.html.tpl', 'utf8');
			const render = _.template(template);
			const output = render({
				debug: true,
				bundle: `/dist/${bundle}`,
				title: config.title
			});

			fs.writeFileSync('./app/index.html', output, 'utf8');

			// Launch Browsersync after the initial bundling is complete
			// For more information visit https://browsersync.io/docs/options
			if (++count === 1) {
				bs.init({
					port: process.env.PORT || 3000,
					ui: { port: Number(process.env.PORT || 3000) + 1 },
					server: {
						baseDir: 'app',
						middleware: [
							webpackDevMiddleware,
							require('webpack-hot-middleware')(compiler),
							require('connect-history-api-fallback')(),
						],
					},
				}, resolve);
			}
    	});
	}));
});

// Execute the specified task or default one. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);
