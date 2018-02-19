const fs = require('fs');
const timestamp = require('time-stamp');
const dotenv = require('dotenv');
const chalk = require('chalk');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
// TODO: I think Marko is alredy doing this
// const minifyHTML = require('express-minify-html');
const lusca = require('lusca');
const PrettyError = require('pretty-error');
const errorhandler = require('errorhandler');
const logger = require('morgan');
const expressStatusMonitor = require('express-status-monitor');

const config = require('../config');

dotenv.config({
	path: config.isProd ? '.env' : '.env.dev'
});

const webpackStaticAssetsObj = require(config.server.paths.assetsWebpackJsonFile);

// View engine via Marko
// TODO: Explore using https://github.com/tj/consolidate.js
// TODO: Explore using Dust instead of marko. Both of them are streaming engines.
// Other resources:
// * https://github.com/marko-js/templating-benchmarks
require('marko/compiler').defaultOptions.writeToDisk = config.isProd;
require('marko/node-require'); // Allow Node.js to require and load `.marko` files
const markoExpress = require('marko/express');

const indexTpl = require(config.server.paths.htmlTemplates + '/index.marko');

const app = express();

// Express configuration.
app.set('http-port', config.server.port || 3000);
app.set('https-port', config.server.https_port || 3443);

// Register Node.js middleware
// app.use(express.static(config.server.paths.staticAssets));
app.use('/', express.static(config.server.paths.staticAssets));

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Compress the response output
app.use(compression());

// Session settings
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

app.use(session({
	name: 'sid',
	resave: true,
	saveUninitialized: true,
	secret: process.env.SESSION_SECRET,
	// store: '',
	cookie: {
		httpOnly: true,
		maxAge: ONE_WEEK
	} // Configure when sessions expires
}));

// Extra
// -----------------------------------------------------------------------------
// Morgan logger for express
logger.token('timestamp', () => {
	return '[' + chalk.magenta(timestamp('HH:mm:ss')) + '][' + chalk.magenta('server') + ']';
});
app.use(logger(config.server.morganLogLevel));

// Simple, self-hosted module to report realtime server metrics for Express-based node servers.
// Link: http://localhost:{PORT}/status/
// https://www.npmjs.com/package/express-status-monitor
app.use(expressStatusMonitor());

// Application security
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

// View engine via Marko
app.use(markoExpress()); // enable res.marko(template, data)

// Routes
// -----------------------------------------------------------------------------
const tplData = {
	isProd: config.isProd,
	webpackChunkManifestContent: fs.readFileSync(config.server.paths.scriptsManifestFile),
	assets: {
		scripts: []
	},
	browserSync: {
		HOST: ''
	}
};

tplData.assets.scripts.push(webpackStaticAssetsObj.runtime.js);
tplData.assets.scripts.push(webpackStaticAssetsObj.commons.js);
tplData.assets.scripts.push(webpackStaticAssetsObj.main.js);

app.get('/', (req, res) => {
	if (req.isSpdy) {
		tplData.browserSync.HOST = req.headers.host;
	}

	res.marko(indexTpl, tplData);
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
	process.stderr.write(pe.render(err));
	next();
});

if (process.env.NODE_ENV === 'development') {
	app.use(errorhandler());
}

module.exports = app;
