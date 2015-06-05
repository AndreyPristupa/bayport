/**
 * Created by Andrey on 31.05.2015.
 */
var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload')

gulp.task('stylus', function() {
    gulp.src('styl/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('css'))
        .pipe(livereload())
})

gulp.task('default', function() {
    livereload.listen()
    gulp.watch('styl/*.styl', ['stylus'])
})