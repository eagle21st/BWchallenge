var gulp = require("gulp");
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var karma = require('karma').server;

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

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function(){
    done();
  });
});

gulp.task("default", ["watch"], rebundle);