var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    minifyCss = require('gulp-clean-css');

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.+(sass|scss)')
        .pipe(sass())
        .pipe(autoprefixer(['last 50 versions'], { cascade: true }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('cache', function() {
    return cache.clearAll();
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: true
    })
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('app/sass/**/*.+(sass|scss)', ['sass']);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('app/*.html', browserSync.reload);

});

gulp.task('build', ['clean', 'img', 'sass'], function() {
    var buildHtml = gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist')),
        buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts')),
        buildPhp = gulp.src('app/php/**/*')
        .pipe(gulp.dest('dist/php')),
        buildVideo = gulp.src('app/video/**/*')
        .pipe(gulp.dest('dist/video'));
})
