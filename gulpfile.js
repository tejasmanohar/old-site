var gulp = require('gulp');

var download = require('gulp-download');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var rimraf = require('rimraf');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

gulp.task('clean', function(cb) {
  rimraf('./dist/', cb);
});

gulp.task('copy', function() {
  return gulp.src('dev/assets/img/*')
    .pipe(gulp.dest('./assets/img'));
});

gulp.task('dist-index', ['clean', 'copy'], function() {
  var assets = useref.assets();

  return gulp.src('dev/index.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(rev())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace({
      replaceInExtensions: ['.html']
    }))
    .pipe(gulpif('*.html', minifyHtml()))
    .pipe(gulp.dest('./'));

});

gulp.task('resume', function() {
  download('https://github.com/tejasmanohar/resume/blob/master/resume.pdf?raw=true')
    .pipe(rename('resume.pdf'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['dist-index', 'resume']);
