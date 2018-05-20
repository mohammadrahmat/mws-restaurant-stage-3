let gulp = require('gulp'),
    webp = require('gulp-webp'),
    uglify = require('gulp-uglifyes'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel');

gulp.task('create-webp', () => {
    return gulp.src('img/rest_images/*.jpg')
        .pipe(webp())
        .pipe(gulp.dest('img/rest_images'));
});

gulp.task('generate-minified-css', () => {
    return gulp.src('css/pretty/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('css/ugly/'));
});

gulp.task('generate-minified-js', () => {
    return gulp.src('js/pretty/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('js/ugly/'))
});