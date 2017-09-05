module.exports = (gulp, plugins, blueprint) => {
	return gulp.src(blueprint.paths.images)
		.pipe(plugins.cache(plugins.imagemin()))
		.pipe(gulp.dest(blueprint.paths.imagesOutputDest));
};
