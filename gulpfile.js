// 'use strict';
var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
// var watchify = require('watchify');
var reactify = require('reactify'); 
// var concat = require('gulp-concat');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var argv = require('yargs').argv;
var fs = require('fs');

var libs = [
  'react',
  'fluxxor',
  'react-router',
  'moment',
  'socket.io-client'
];

var packageJson = require('./package.json');
var dependencies = Object.keys(packageJson && packageJson.dependencies || {});

gulp.task('app', function() {

	var bundler = browserify({
		entries: ['./js/app.js'],
		transform: [reactify],
		debug: argv.env != 'production'
		})
		.external(dependencies);

	if (argv.env == 'production' || argv.env == 'dev')
	{
		return bundler.bundle()
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(gulp.dest('./build'));
	}
	else
	{
		return bundler.bundle()
			.pipe(source('app.js'))
			.pipe(gulp.dest('./build'));
	}

});

gulp.task('vendor', function() {

	var bundler = browserify({
		debug: argv.env != 'production'
		})
		.require(dependencies);
	
	if (argv.env == 'production' || argv.env == 'dev')
	{
		return bundler.bundle()
			.pipe(source('vendor.js'))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(gulp.dest('./build'));
	}
	else
	{
		return bundler.bundle()
			.pipe(source('vendor.js'))
			.pipe(gulp.dest('./build'));
	}

});

gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      proxies: [{source: '/api', target:'http://127.0.0.1:3001'}]
    }));
});

gulp.task('html', function () {    
	return gulp.src('*.html')
		.pipe(gulp.dest('build'));
});

gulp.task('sass', function () {
	gulp.src('./css/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./build/css'));
});

gulp.task('sass:watch', function () {
	gulp.watch('./css/**/*.scss', ['sass']);
});

gulp.task('watch', function() {
	gulp.watch('./js/**', ['app']);
	gulp.watch('./package.json', ['vendor']);
});

gulp.task('config', function(cb) {

	var socketURL;
	 if (argv.env == 'production') {
	 	socketURL = 'https://admin.tryvelvet.com/';
	 }
	 else if (argv.env == 'dev') {
	 	socketURL = 'http://dev.admin.tryvelvet.com/';
	 }
	 else {
	 	socketURL = 'http://127.0.0.1:8000/';
	 }

	fs.writeFile('./js/VelvetConfig.js', 'var VelvetConfig = {socketURL: "'+socketURL+'"}; module.exports = VelvetConfig;', cb);

});

// 
gulp.task('default', ['config', 'webserver', 'app', 'vendor', 'html', 'sass', 'sass:watch', 'watch']);
gulp.task('build', ['config', 'webserver', 'app', 'vendor', 'html', 'sass']);
gulp.task('build-only', ['config', 'app', 'vendor', 'html', 'sass']);
