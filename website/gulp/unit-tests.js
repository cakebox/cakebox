'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

module.exports = function(options) {
  function runTests (singleRun) {
    var bowerDeps = wiredep({
      directory: 'bower_components',
      exclude: ['bootstrap-sass-official'],
      dependencies: true,
      devDependencies: true
    });

    var testFiles = bowerDeps.js.concat([
      options.src + '/{app,components}/**/*.js'
    ]);

    return gulp.src(testFiles)
      .pipe($.karma({
        configFile: 'karma.conf.js',
        action: (singleRun)? 'run': 'watch'
      }));
  }

  gulp.task('test', ['scripts'], runTests.bind(this, true));
  gulp.task('test:auto', ['scripts'], runTests.bind(this, false));
};
