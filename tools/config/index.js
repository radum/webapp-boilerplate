const loadEnv = require('./../lib/load-env');
const cli = require('./../cli');
const webpackConfig = require('./webpack.config');

// Load .env files based on the rules defined in the docs
loadEnv(process.env.NODE_ENV);

const isProd = process.env.NODE_ENV === 'production';
const isDebug = !cli.flags.release;
const isVerbose = cli.flags.verbose;
const isAnalyze = cli.flags.analyze;

// TODO:Maybe document here what every one of these does?
const config = {
	isProd,
	isDebug,
	isVerbose,
	isAnalyze,
	SENTRY_DSN_URL: process.env.SENTRY_DSN_URL,

	// TODO: Streamline all these values as we have to many.
	paths: {
		srcPath: 'src',
		buildPath: 'build',
		cacheFolder: '.cache',

		staticAssetsOutput: 'build/static',

		styles: 'src/styles/**/*.scss',
		stylesEntryPoint: 'src/styles/main.scss',
		stylesOutputDest: 'build/static/styles',

		scriptsPath: 'src/client',
		scriptsFiles: 'src/client/**/*.js',
		scriptsEntryPoint: 'src/client/main.js',
		scriptsOutputDest: 'build/static/scripts',
		scriptsPublicPath: '/scripts/',

		serverJsFiles: 'src/server/**/*.js',
		serverEntryPoint: 'src/server/server.js',
		serverFiles: '{src/server/**/*.js,src/html/**/*.marko}',

		images: 'src/static/images/**/*',
		imagesPath: 'src/static/images',
		imagesOutputDest: 'build/static/images'
	}
};

exports.config = config;
exports.webpackConfigModern = webpackConfig(config).modernConfig;
exports.webpackConfigLegacy = webpackConfig(config).legacyConfig;
