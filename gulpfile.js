require('es6-promise').polyfill();

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var fs = require('fs');

var paths = {
  js: 'js',
  scss: 'scss',
  buildJs: 'dist/js',
  buildCss: 'dist/css'
};

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: ''
    },
    startPath: 'demo.html'
  });
});

gulp.task('css', function() {
  return gulp.src(paths.scss + '/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass()) // Passes it through a gulp-sass
    .pipe(gulp.dest(paths.buildCss)) // Outputs it in the css folder
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.buildCss)) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

gulp.task('watch', function() {
  gulp.watch(paths.scss + '/*.scss', ['dist']);
  gulp.watch('demo.html', browserSync.reload);
  gulp.watch(paths.js + '/*.js', ['js-style', 'js']);
});

gulp.task('js', function() {
  return gulp.src(paths.buildJs + '/console.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.buildJs))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

gulp.task('dist', function() {
  runSequence('css', 'js-style', 'js');
});

gulp.task('js-style', function() {
  return gulp.src(paths.js + '/console.js')
    .pipe(replace(/{{consoleLogStyles}}/, function(s) {
      var style = fs.readFileSync(paths.buildCss + '/console-style.min.css', 'utf8');
      return style;
    }))
    .pipe(gulp.dest(paths.buildJs));
});

gulp.task('default', function(callback) {
  runSequence('dist', ['browserSync', 'watch'], callback);
});
