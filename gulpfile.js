var gulp = require('gulp');
var path = require('path');
var srcPath = 'app/src';
var destPath = 'app/dest';
var sourceMaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');

gulp.task('src-ts', function () {
    return gulp.src(path.join(srcPath, '**/*.ts'))
        .pipe(sourceMaps.init())
        .pipe(typescript({module: 'commonjs', target: 'ES5'}))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(destPath))
        ;
});

gulp.task('src-js', function () {
    return gulp.src(path.join(srcPath, '**/*.js'))
        .pipe(gulp.dest(destPath))
        ;
});
