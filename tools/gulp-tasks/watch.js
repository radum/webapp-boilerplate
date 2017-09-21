module.exports = (gulp, plugins, blueprint) => {
	gulp.watch(blueprint.paths.stylesEntryPoint, gulp.series('styles'));
};
