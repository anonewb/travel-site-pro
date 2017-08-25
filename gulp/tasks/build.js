var gulp = require('gulp'),
imagemin = require('gulp-imagemin'),
del = require('del'),
usemin = require('gulp-usemin'),
rev = require('gulp-rev'),
cssnano = require('gulp-cssnano'),
uglify = require('gulp-uglify'),
browserSync = require('browser-sync').create();

gulp.task('previewDist', function() {
	browserSync.init({
		notify: false,
		server: {
			baseDir: "dist"  			//points server to baseDir(db directory) to app folder
		}
	});
});

gulp.task('deleteDistFolder', function() {
	return del("./dist");
});

gulp.task('copyGeneralFiles',['deleteDistFolder'], function() {
	var pathsToCopy = [
		'./app/**/*',
		'!./app/index.html',
		'!./app/assets/images/**',
		'!./app/assets/styles/**',
		'!./app/assets/scripts/**',
		'!./app/temp',
		'!./app/temp/**'
	]

	return gulp.src(pathsToCopy)
		.pipe(gulp.dest("./dist"));
});

gulp.task('optimizeImages', ['deleteDistFolder', 'icons'], function() { //for imgs
	return gulp.src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
		.pipe(imagemin({
			progressive: true, //optimize jpeg imgs even further
			interlaced: true, //for gif
			multipass: true //for svg
		}))
		.pipe(gulp.dest("./dist/assets/images"));
});

gulp.task('usemin',['deleteDistFolder', 'styles', 'scripts'], function() { //for css and js
	return gulp.src("./app/index.html")
		.pipe(usemin({
			css: [function() {return rev()}, function() {return cssnano()}],
			js: [function() {return rev()}, function() {return uglify()}]
		}))
		.pipe(gulp.dest("./dist"));
});

gulp.task('build', ['deleteDistFolder','copyGeneralFiles', 'optimizeImages', 'usemin']);