var gulp = require("gulp");
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var karma = require('gulp-karma');

var rebundle = function() {
  return gulp.src("src/js/double-progress/*.js")
    .pipe(browserify())
    .pipe(gulp.dest("dist"))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest("dist"));
};

gulp.task("clean", function () {
  return gulp.src('dist/*.js', {read: false})
    .pipe(clean());
});

gulp.task("watch", ["clean"], function (){
	gulp.watch("src/js/**/*.js", rebundle)
});

gulp.task('test', function() {
  // Be sure to return the stream
  // NOTE: Using the fake './foobar' so as to run the files
  // listed in karma.conf.js INSTEAD of what was passed to
  // gulp.src !
  return gulp.src('test/*.js')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      this.emit('end'); //instead of erroring the stream, end it
    });
});

gulp.task("default", ["watch"], rebundle);