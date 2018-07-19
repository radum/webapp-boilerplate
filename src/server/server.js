const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Using `spdy` module until this lands into Express 5.x
// https://github.com/expressjs/express/pull/3390
const http2 = require('spdy');
const http = require('http');
const chalk = require('chalk');

const config = require('./config');

dotenv.config({
	path: config.isProd ? '.env' : '.env.dev'
});

const app = require('./app');

http.createServer(app).listen(app.get('http-port'), () => {
	// If you update the text here update the ./tools/runServer.js RUNNING_REGEXP var also
	console.log('%s Server is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('http-port'), app.get('env'));
});

if (process.env.HTTPS_ENABLED) {
	http2.createServer({
		cert: fs.readFileSync(path.resolve(__dirname, '../ssl/localhost.crt')),
		key: fs.readFileSync(path.resolve(__dirname, '../ssl/localhost.key'))
	}, app).listen(app.get('https-port'), () => {
		// If you update the text here update the ./tools/runServer.js RUNNING_REGEXP var also
		console.log('%s Server is running at https://localhost:%d in %s mode', chalk.green('✓'), app.get('https-port'), app.get('env'));
	});
}
