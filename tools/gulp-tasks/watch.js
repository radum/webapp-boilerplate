module.exports = (gulp, plugins, blueprint) => {
	gulp.watch(blueprint.paths.styles, gulp.series('styles'));
	gulp.watch(blueprint.paths.serverFiles, gulp.series('run-server-task', 'browser-sync-reload-task'));
};
