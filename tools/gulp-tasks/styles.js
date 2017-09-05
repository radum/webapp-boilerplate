/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

const postcssScss = require('postcss-scss'); // SCSS parser for PostCSS
const postcssConfig = require('./../postcss.config'); // SCSS parser for PostCSS

module.exports = (gulp, plugins, blueprint) => {
	return gulp.src(blueprint.paths.stylesEntryPoint)
		.pipe(plugins.plumber())
		.pipe(plugins.sourcemaps.init())
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
		.pipe(plugins.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
		.pipe(plugins.if(global.config.isDebug, plugins.sourcemaps.write('.')))
		.pipe(gulp.dest(blueprint.paths.stylesOutputDest))
		.pipe(blueprint.browserSync.stream());
};
