/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const browserSync = require('browser-sync').get('browserSyncInstance');
const postcssScss = require('postcss-scss'); // SCSS parser for PostCSS
const CleanCSS = require('clean-css');
const vinylMap = require('vinyl-map');
const postcssConfig = require('./../postcss.config'); // SCSS parser for PostCSS

module.exports = (gulp, plugins, blueprint) => {
	const minify = vinylMap((buff) => {
		return new CleanCSS({
			level: 2,
			sourceMap: true
		}).minify(buff.toString()).styles;
	});

	return gulp.src(blueprint.paths.stylesEntryPoint)
		.pipe(plugins.if(blueprint.isDebug, plugins.sourcemaps.init({ loadMaps: true }))) // Extract the inline sourcemaps
		.pipe(plugins.sass.sync({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.']
		}).on('error', plugins.sass.logError))
		.pipe(plugins.postcss(postcssConfig.plugins, {
			syntax: postcssScss,
			parser: postcssScss
		}))
		.pipe(plugins.autoprefixer())
		.pipe(plugins.if(!blueprint.isDebug, minify))
		.pipe(plugins.if(blueprint.isDebug, plugins.sourcemaps.write('.')))
		.pipe(gulp.dest(blueprint.paths.stylesOutputDest))
		.pipe(browserSync.stream());
};
