var sync = require('browser-sync');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
//var jshint = require("gulp-jshint");
var connect = require('gulp-connect');
var git = require('gulp-git');
var exec = require('child_process').exec;



// start our node server using nodemon
gulp.task('server-dev', function () {
  exec('npm start');
  nodemon({
    script: './server/server.js',
    ignore: 'node_modules/**/*.js'
  });
});
gulp.task('task', function() {
  exec('npm start', function(err) {
    if(err) {console.log(err);}
  });

});

gulp.task('server-prod', ['task'], function() {
 // git.push('live', 'master', function (err) {
 //    if (err) throw err;
 //  });
 console.log('Running server-prod');
});


gulp.task('upload', function() {
  if(process.argv[2] === '-prod'){
    process.env.NODE_ENV='production';
    gulp.start('server-prod');
  } else {
    process.env.NODE_ENV='development'; 
    gulp.start('server-dev');
  }

});

gulp.task('default', ['upload']);
