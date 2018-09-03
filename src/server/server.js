const fs = require('fs');
const path = require('path');
const http = require('http');
const http2 = require('spdy'); // Using `spdy` until this lands https://github.com/expressjs/express/pull/3390
const chalk = require('chalk');
const loadEnv = require('./util/load-env');

// Load .env files based on the rules defined in the docs
loadEnv(process.env.NODE_ENV);

// Express app
const app = require('./app');
const router = require('./router');

// Express routes
app.use(router);

http.createServer(app).listen(app.get('http-port'), () => {
	// If you update the text here update the ./tools/run-server.js RUNNING_REGEXP var also
	console.log('%s Server is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('http-port'), app.get('env'));
});

if (process.env.HTTPS_ENABLED) {
	http2.createServer({
		cert: fs.readFileSync(path.resolve(__dirname, `../ssl/${process.env.SSL_CERT_FILE_NAME}`)),
		key: fs.readFileSync(path.resolve(__dirname, `../ssl/${process.env.SSL_KEY_FILE_NAME}`))
	}, app).listen(app.get('https-port'), () => {
		// If you update the text here update the ./tools/run-server.js RUNNING_REGEXP var also
		console.log('%s Server is running at https://localhost:%d in %s mode', chalk.green('✓'), app.get('https-port'), app.get('env'));
	});
}
