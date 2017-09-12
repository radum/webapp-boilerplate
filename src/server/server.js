const path = require('path');
const fs = require('fs');
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
app.set('port', config.server.port || 3000);

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
app.use(logger(config.server.morganLogLevel));
app.use(expressStatusMonitor());

// Application security
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

// View engine via Marko
app.use(markoExpress()); // enable res.marko(template, data)

// Routes
const assetsData = {
	webpackChunkManifestContent: fs.readFileSync(config.server.paths.scriptsManifestFile),
	scripts: []
};

const assets = require(config.server.paths.assetsWebpackJsonFile);
assetsData.scripts.push(assets.runtime.js);
assetsData.scripts.push(assets.commons.js);
assetsData.scripts.push(assets.main.js);

app.get('/', (req, res) => {
	res.marko(indexTpl, {
		assets: assetsData
	});
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

app.listen(app.get('port'), () => {
	console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
	console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
