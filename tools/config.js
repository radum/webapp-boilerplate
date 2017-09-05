const isProd = process.env.NODE_ENV === 'production';
const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');

const config = {
	isProd,
	isDebug,
	isVerbose,

	paths: {
		buildPath: 'build',

		styles: 'src/styles/**/*.scss',
		stylesEntryPoint: 'src/styles/*.scss',
		stylesOutputDest: 'build/styles',

		scripts: 'src/client/**/*.js',
		scriptsEntryPoint: 'src/client-entry.js',
		scriptsOutputDest: 'build/client/scripts',
		scriptsPublicPath: '/client/scripts/', // Taken from `scriptsOutputDest` and removed build path

		staticAssets: 'src/static',

		images: 'src/static/images/**/*',
		imagesOutputDest: 'build/static/images'
	}
};

module.exports = config;
