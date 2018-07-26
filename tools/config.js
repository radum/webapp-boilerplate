const cli = require('./cli');

const isProd = process.env.NODE_ENV === 'production';
const isDebug = !cli.flags.release;
const isVerbose = cli.flags.verbose;
const isAnalyze = cli.flags.analyze;

const config = {
	isProd,
	isDebug,
	isVerbose,
	isAnalyze,
	SENTRY_DSN_URL: process.env.SENTRY_DSN_URL,

	paths: {
		srcPath: 'src',
		buildPath: 'build',
		cacheFolder: '.cache',

		styles: 'src/styles/**/*.scss',
		stylesEntryPoint: 'src/styles/main.scss',
		stylesOutputDest: 'build/static/styles',
		stylesOutputFile: 'main.css',

		scriptsPath: 'src/client',
		scriptsFiles: 'src/client/**/*.js',
		scriptsEntryPoint: 'src/client/main.js',
		scriptsOutputDest: 'build/static/scripts',
		scriptsPublicPath: '/scripts/',

		serverPath: 'src/server',
		serverEntryPoint: 'src/server/server.js',
		serverHtmlPath: 'src/html',
		serverFiles: '{src/server/**/*.js,src/html/**/*.marko}',
		serverOutput: 'build/server',
		serverHtmlOutput: 'build/html',

		sslFilesPath: 'src/ssl',
		sslFilesOutput: 'build/ssl',

		staticAssets: 'src/static',
		staticAssetsOutput: 'build/static',

		images: 'src/static/images/**/*',
		imagesPath: 'src/static/images',
		imagesOutputDest: 'build/static/images'
	},

	taskColor: ['#00a8e8', '#B2DBBF', '#F3FFBD', '#FFD166', '#fe938c', '#88d498', '#9c89b8']
};

module.exports = config;
