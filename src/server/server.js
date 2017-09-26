const fs = require('fs');
const path = require('path');

// Using `spdy` module until this lands into Express 5.x
// https://github.com/expressjs/express/pull/3390
const http2 = require('spdy');

const timestamp = require('time-stamp');
const dotenv = require('dotenv');
const chalk = require('chalk');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const lusca = require('lusca');
const PrettyError = require('pretty-error');
const errorhandler = require('errorhandler');
const logger = require('morgan');
const expressStatusMonitor = require('express-status-monitor');

dotenv.config({ path: '.env.dev' });

const config = require('./config');

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
app.use('/static', express.static(config.server.paths.staticAssets));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

//
// Routes
// -----------------------------------------------------------------------------
const tplData = {
	isProd: config.isProd,
	webpackChunkManifestContent: fs.readFileSync(config.server.paths.scriptsManifestFile),
	assets: {
		scripts: []
	}
};

tplData.assets.scripts.push(webpackStaticAssetsObj.runtime.js);
tplData.assets.scripts.push(webpackStaticAssetsObj.commons.js);
tplData.assets.scripts.push(webpackStaticAssetsObj.main.js);

app.get('/', (req, res) => {
	res.marko(indexTpl, tplData);
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

if (process.env.NODE_ENV === 'development') {
	app.use(errorhandler());
}

app.listen(app.get('http-port'), () => {
	// If you update the text here update the ./tools/runServer.js RUNNING_REGEXP var also
	console.log('%s Server is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('http-port'), app.get('env'));
});

http2.createServer({
	cert: fs.readFileSync(path.resolve(__dirname, '../ssl/server.crt')),
	key: fs.readFileSync(path.resolve(__dirname, '../ssl/server.key'))
}, app).listen(app.get('https-port'), () => {
	// If you update the text here update the ./tools/runServer.js RUNNING_REGEXP var also
	console.log('%s Server is running at https://localhost:%d in %s mode', chalk.green('✓'), app.get('https-port'), app.get('env'));
});

module.exports = app;
