/**
 * Minify PNG, JPEG, GIF and SVG images with imagemin
 * TODO: The copy taks is doing the copy and then this does it again. This needs to happen only once.
 */
module.exports = (gulp, plugins, blueprint) => {
	return gulp.src(blueprint.paths.images)
		.pipe(plugins.cache(plugins.imagemin()))
		.pipe(gulp.dest(blueprint.paths.imagesOutputDest));
};
