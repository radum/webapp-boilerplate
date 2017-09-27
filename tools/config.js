const isProd = process.env.NODE_ENV === 'production';
const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');
const isAnalyze = process.argv.includes('--analyze') || process.argv.includes('--analyse');

const config = {
	isProd,
	isDebug,
	isVerbose,
	isAnalyze,

	paths: {
		buildPath: 'build',

		styles: 'src/styles/**/*.scss',
		stylesEntryPoint: 'src/styles/main.scss',
		stylesOutputDest: 'build/static/styles',

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

		staticAssets: 'src/static',
		staticAssetsOutput: 'build/static',

		images: 'src/static/images/**/*',
		imagesOutputDest: 'build/static/images'
	}
};

module.exports = config;
