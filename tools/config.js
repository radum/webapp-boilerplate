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
		scriptsPublicPath: '/static/scripts/', // Taken from `scriptsOutputDest` and removed build part

		serverPath: 'src/server',
		serverEntryPoint: 'src/server/server.js',
		serverFiles: '{src/server/**/*.js,src/html/**/*.marko}',

		staticAssets: 'src/static',
		staticAssetsOutput: 'build/static',

		images: 'src/static/images/**/*',
		imagesOutputDest: 'build/static/images'
	}
};

module.exports = config;
