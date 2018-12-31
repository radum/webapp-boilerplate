// const fs = require('fs');
const timestamp = require('time-stamp');
const chalk = require('chalk');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const responseTime = require('response-time');
const lusca = require('lusca');
const helmet = require('helmet');
const PrettyError = require('pretty-error');
const errorhandler = require('errorhandler');
const expressRoutesLogger = require('morgan');
const expressStatusMonitor = require('express-status-monitor');
const serverTiming = require('server-timing');
// TODO: https://www.npmjs.com/package/express-brute, https://github.com/animir/node-rate-limiter-flexible
const rateLimit = require('express-rate-limit');
const mime = require('mime');

const logger = require('../util/logger');
const config = require('../config');
const findEncoding = require('../util/encoding-selection').findEncoding;
const noopServiceWorkerMiddleware = require('../middleware/noop-service-worker-middleware');

// Express App with view engine via PUG
// -----------------------------------------------------------------------------
const app = express();

app.set('view engine', 'pug');
app.set('views', [config.server.paths.htmlTemplates]);

// Express configuration.
// -----------------------------------------------------------------------------

// Trust X-Forwarded-* headers so that when we are behind a reverse proxy,
// our connection information is that of the original client (according to
// the proxy), not of the proxy itself. We need this for HTTPS redirection
// and bot rendering.
app.set('trust proxy', true);

// Disable the "X-Powered-By: Express" HTTP header.
app.set('x-powered-by', false);

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

// Extra (loggers, security)
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

// Add [Server-Timing](https://www.w3.org/TR/server-timing/) to response headers.
app.use(serverTiming());

// Routes
// -----------------------------------------------------------------------------

// Redirect to HTTPS automatically if options is set
if (process.env.HTTPS_REDIRECT === 'true') {
	logger.log('info', 'Redirecting HTTP requests to HTTPS');

	app.use((req, res, next) => {
		if (req.secure) {
			next();
			return;
		}

		res.redirect(301, `https://${req.hostname}${req.url}`);
	});
}

// Return source maps in production only to requests passint then `X-SOURCE-MAP-TOKEN` header token (Sentry for example)
if (config.isProd) {
	app.get(/\.js\.map/, (req, res, next) => {
		const hedSourceMapToken = req.get('X-SOURCE-MAP-TOKEN');
		const envSourceMapToken = process.env['X-SOURCE-MAP-TOKEN'];

		logger.log('debug', `source map request from : ${req.ip} ${req.originalUrl}`);

		if (hedSourceMapToken === undefined || (envSourceMapToken && envSourceMapToken !== hedSourceMapToken)) {
			logger.log('debug', `source map request invalid using token: ${hedSourceMapToken}`);

			res
				.status(401)
				.send('Authentication access token is required to access the source map.');

			return;
		}

		logger.log('debug', `source map request valid using token: ${hedSourceMapToken}`);

		next();
	});
}

// Respond with Brotli files is the browser accepts it (js, css only)
if (process.env.USE_BROTLI === 'true' && config.isProd) {
	logger.log('info', 'Using brotli redirects for JS and CSS files');

	app.get(/\.js$|css$/, (req, res, next) => {
		logger.log('debug', `Brotli redirect for: ${req.url}`);

		// Get browser's' supported encodings
		const acceptEncoding = req.header('accept-encoding');

		const compressionType = findEncoding(acceptEncoding, [{ encodingName: 'br' }]);

		// Check for null first, becuase apps like Sentry for example don't add `accept-encoding` to the request
		if (compressionType !== null && compressionType.encodingName === 'br') {
			// As long as there is any compression available for this file, add the Vary Header (used for caching proxies)
			res.setHeader('Vary', 'Accept-Encoding');

			const type = mime.getType(req.path);
			let search = req.url.split('?').splice(1).join('?');

			if (search !== '') {
				search = '?' + search;
			}

			req.url = req.url + '.br';
			res.setHeader('Content-Encoding', 'br');
			res.setHeader('Content-Type', `${type}; charset=UTF-8`);
		} else {
			logger.log('debug', `Brotli redirect failed: compressionType: ${JSON.stringify(compressionType)}`);
		}

		next();
	});
}

// This service worker file is effectively a 'no-op' that will reset any
// previous service worker registered for the same host:port combination.
// We do this in development to avoid hitting the production cache if
// it used the same host and port.
// https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
if (!config.isProd) {
	app.use(noopServiceWorkerMiddleware());
}

// Register express static for all files within the static folder
app.use('/', express.static(config.server.paths.staticAssets));

// Error handling
// -----------------------------------------------------------------------------

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
	res.status(err.status || 500);

	process.stderr.write(pe.render(err));

	res.render('error', {
		message: err.message,
		error: {}
	});

	next();
});

if (process.env.NODE_ENV === 'development') {
	app.use(errorhandler());
}

module.exports = app;
