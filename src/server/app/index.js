// const fs = require('fs');
const timestamp = require('time-stamp');
const chalk = require('chalk');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const responseTime = require('response-time');
// TODO: I think Marko is alredy doing this
// const minifyHTML = require('express-minify-html');
const lusca = require('lusca');
const helmet = require('helmet');
const PrettyError = require('pretty-error');
const errorhandler = require('errorhandler');
const expressRoutesLogger = require('morgan');
const expressStatusMonitor = require('express-status-monitor');
const serverTiming = require('server-timing');
// TODO: https://www.npmjs.com/package/express-brute
const rateLimit = require('express-rate-limit');

const logger = require('../logger');
const config = require('../config');
const findEncoding = require('../util/encoding-selection').findEncoding;

const webpackStaticAssetsObj = require(config.server.paths.assetsWebpackJsonFile);

// View engine via Marko
// TODO: Explore using https://github.com/tj/consolidate.js
// TODO: Explore using Dust instead of marko. Both of them are streaming engines.
// Other resources:
// * https://github.com/marko-js/templating-benchmarks
require('marko/compiler').defaultOptions.writeToDisk = config.isProd;
require('marko/node-require'); // Allow Node.js to require and load `.marko` files
const markoExpress = require('marko/express');

const appTpl = require(`${config.server.paths.htmlTemplates}/app.marko`);

const app = express();

// Express configuration.

// Trust X-Forwarded-* headers so that when we are behind a reverse proxy,
// our connection information is that of the original client (according to
// the proxy), not of the proxy itself. We need this for HTTPS redirection
// and bot rendering.
app.set('trust proxy', true);

// Express http/s ports
app.set('http-port', config.server.port || 3000);
app.set('https-port', config.server.https_port || 3443);

if (config.isProd) {
	// Express Rate Limit
	const limiter = new rateLimit({
		windowMs: 15*60*1000, // 15 minutes
		max: 250, // limit each IP to 100 requests per windowMs
		delayMs: 0, // disable delaying - full speed until the max limit is reached,
		onLimitReached: () => {
			logger.log('warn', 'Express Rate Limit reached');
		}
	});
	app.use(limiter);
}

// Records the response time for requests in HTTP servers by adding `X-Response-Time` header to responses.
// Defined as the elapsed time from when a request enters this middleware to when the headers are written out.
app.use(responseTime());

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
expressRoutesLogger.token('timestamp', () => {
	return '[' + chalk.magenta(timestamp('HH:mm:ss')) + '] [' + chalk.magenta('server') + ']';
});
app.use(expressRoutesLogger(config.server.morganLogLevel));

// Simple, self-hosted module to report realtime server metrics for Express-based node servers.
// Link: http://localhost:{PORT}/status/
// https://www.npmjs.com/package/express-status-monitor
app.use(expressStatusMonitor());

// Application security
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(helmet());

// View engine via Marko
app.use(markoExpress()); // enable res.marko(template, data)

// This module adds [Server-Timing](https://www.w3.org/TR/server-timing/) to response headers.
app.use(serverTiming());

// Redirect to HTTPS automatically if options is set
if (process.env.HTTPS_REDIRECT === 'true') {
	console.info(`Redirecting HTTP requests to HTTPS.`);

	app.use((req, res, next) => {
		if (req.secure) {
			next();
			return;
		}

		res.redirect(301, `https://${req.hostname}${req.url}`);
	});
}

// Routes
// -----------------------------------------------------------------------------
const tplData = {
	isProd: config.isProd,
	// TODO: Removed for now because not sure how Webpack 4 works and I removed
	// soundcloud/chunk-manifest-webpack-plugin as it was to old, alternative should be found if
	// is really needed now with Webpack 4
	webpackChunkManifestContent: false, // fs.readFileSync(config.server.paths.XXX),
	assets: {
		scripts: [],
	},
	browserSync: {
		HOST: '',
	}
};

if (webpackStaticAssetsObj['runtime.js']) tplData.assets.scripts.push(webpackStaticAssetsObj['runtime.js']);
if (webpackStaticAssetsObj['vendors.js']) tplData.assets.scripts.push(webpackStaticAssetsObj['vendors.js']);
tplData.assets.scripts.push(webpackStaticAssetsObj['main.js']);

// TODO: Fix this, doesn't work. I think the `express.static()` above breaks it.
// On a second thought I think the regex is broken
app.get(/\.js\.map/, (req, res, next) => {
	if (req.headers['X-Sentry-Token'] !== process.env.X_SENTRY_TOKEN) {
		res
			.status(401)
			.send('Authentication access token is required to access the source map.');

		return;
	}

	next();
});

// Respond with Brotli files is the browser accepts it
if (false && config.isProd) {
	app.get(/\.js/, (req, res, next) => {
		// Get browser's' supported encodings
		const acceptEncoding = req.header('accept-encoding');

		const compressionType = findEncoding(acceptEncoding, [{ encodingName: 'br' }]);

		if (compressionType === 'br') {
			req.url = req.url + '.br';
			res.setHeader('Content-Encoding', 'br');
			res.setHeader('Content-Type', 'application/javascript; charset="utf-8"');
		}
	});
}

// Register express static for all files within the static folder
app.use('/', express.static(config.server.paths.staticAssets));

// If the request is via HTTPS, change the browserSync host to HTTPS
app.get('/', (req, res) => {
	if (req.isSpdy) {
		tplData.browserSync.HOST = req.headers.host;
	}

	res.marko(appTpl, tplData);
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
