const fs = require('fs');
const path = require('path');
const http = require('http');
// Using `spdy` module until this lands into Express 5.x
// https://github.com/expressjs/express/pull/3390
const http2 = require('spdy');
const dotenv = require('dotenv');
const chalk = require('chalk');

const apiRoutes = require('./api');

// Load .env files based on the rules defined in the docs
if (fs.existsSync(path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}.local`))) { dotenv.load({ path: `.env.${process.env.NODE_ENV}.local` }); }
if (fs.existsSync(path.resolve(process.cwd(), '.env.local'))) { dotenv.load({ path: '.env.local' }); }
dotenv.load({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });
dotenv.load({ path: path.resolve(process.cwd(), '.env') });

// Express app
const app = require('./app');

// Express routes
app.use(apiRoutes);

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
