var sync = require('browser-sync');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
//var jshint = require("gulp-jshint");
var connect = require('gulp-connect');

var paths = {
  // client  js files and place holder for specs
  scripts: ['client/**/*.js'],
  test: ['specs/**/*.js']
};
//concat uglify and watch the client side code
gulp.task('js-concat-uglify', function(){
  return gulp.src(['client/**/*.js' , 'client/helpers/*.js' ])
    .pipe(concat('concat.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('uglify.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

///jshint task
// gulp.task('jshint', function () {
//     gulp.src('./app/**/*.js') // path to your files
//     .pipe(jshint())
//     .pipe(jshint.reporter('default')); // Dump results
// });

//starting and serving the client side
gulp.task('start', ['serve'], function () {
  sync({
    notify: true,
    injectChanges: true,
    files: paths.scripts ,
    proxy: 'localhost:8080'
  });
});

// start our node server using nodemon
gulp.task('serve', function () {
  nodemon({
    script: './server/server.js',
    ignore: 'node_modules/**/*.js'
  });
});

gulp.task('serveprod', function() {
  connect.server({
    root: ['.', '.tmp'],
    port: process.env.PORT || 8080, 
    livereload: false
  });
});

gulp.task('default', ['start' , 'serveprod']);
