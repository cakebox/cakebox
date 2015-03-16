'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options) {
  gulp.task('inject', ['scripts'], function () {
    var injectStyles = gulp.src([
      options.src + '/{app,components}/**/*.css'
    ], { read: false });


    var injectScripts = gulp.src([
      options.src + '/{app,components}/**/*.js',
      '!' + options.src + '/{app,components}/**/*.spec.js',
      '!' + options.src + '/{app,components}/**/*.mock.js'
    ])
    .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'));

    var injectOptions = {
      ignorePath: [options.src, options.tmp + '/serve'],
      addRootSlash: false
    };

    var wiredepOptions = {
      directory: 'bower_components',
      exclude: [/bootstrap\.js/]
    };

    return gulp.src(options.src + '/*.html')
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(wiredepOptions))
      .pipe(gulp.dest(options.tmp + '/serve'));

  });
};
