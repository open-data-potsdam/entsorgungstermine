// Include gulp
const gulp = require('gulp');

// Include Our Plugins
const babel = require('gulp-babel');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const webserver = require('gulp-webserver');
const merge = require('merge-stream');
const clean = require('gulp-clean');

let srcPath = 'src/';
let distPath = 'dist/';

// Lint Task
gulp.task('lint', function() {
    return gulp.src(srcPath + 'js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// index.html
gulp.task('index', function() {
    var data = gulp.src(srcPath + '*.html')
        .pipe(gulp.dest(distPath));

    var index = gulp.src(srcPath + 'data/**/*.json')
        .pipe(gulp.dest(distPath + 'data'));

    return merge(data, index);
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(srcPath + 'css/+(*.scss|*.css)')
        .pipe(sass())
        .pipe(gulp.dest(distPath + 'css'));
});

// JS Libs
gulp.task('libs', function() {
    return gulp.src(srcPath + 'js/lib/*.js')
        //.pipe(concat('libs.js'))
        .pipe(gulp.dest(distPath + 'js'))
        //.pipe(rename('libs.js'))
        // .pipe(uglify())
        //.pipe(gulp.dest(distPath + 'js'));
});

// Script
gulp.task('scripts', function() {
    return gulp.src(srcPath + 'js/*.js')
        .pipe(concat('script.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(distPath + 'js'));
        // .pipe(uglify())
        //.pipe(gulp.dest(distPath + 'js'));
});

gulp.task('clean', function() {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(srcPath + '*.html', ['lint', 'scripts']);
    gulp.watch(srcPath + 'js/*.js', ['lint', 'scripts']);
    gulp.watch(srcPath + 'css/+(*.scss|*.css)', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'index', 'sass', 'libs', 'scripts', 'watch']);