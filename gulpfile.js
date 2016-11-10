/*jshint asi:true*/

var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var plugins = require('gulp-load-plugins')();
var imagemin = require('imagemin');
var reload = browserSync.reload;


// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

var site = {
    title: "Erika Johnson, Full-Stack Portfolo",
    root: "/"
  };

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
            //.pipe(plugins.imagemin())
            .pipe(gulp.dest('dist/img'))
            .pipe(browserSync.reload({
                stream: true
              }))
});

gulp.task('pages', function() {
    return gulp.src('src/pages/**/*.html')
              .pipe(plugins.data({site: site}))
              .pipe(plugins.htmlmin({collapseWhitespace: true}))
              .pipe(gulp.dest('dist'))
              .pipe(browserSync.reload({
                  stream: true
                }))
});

//Static file not copying
gulp.task('static', function() {
  return gulp.src('src/static/**/*')
            .pipe(gulp.dest('dist/static'));
});

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('src/less/creative.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('src/css/creative.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('src/js/creative.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['src/node_modules/bootstrap/dist/**/*', '!src/**/npm.js', '!src/**/bootstrap-theme.*', '!src/**/*.map'])
        .pipe(gulp.dest('dist/vendor/bootstrap'))

    gulp.src(['src/node_modules/jquery/dist/jquery.js', 'src/node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('dist/vendor/jquery'))

    gulp.src(['src/node_modules/magnific-popup/dist/*'])
        .pipe(gulp.dest('dist/vendor/magnific-popup'))

    gulp.src(['src/node_modules/scrollreveal/dist/*.js'])
        .pipe(gulp.dest('dist/vendor/scrollreveal'))

    gulp.src([
            'src/node_modules/font-awesome/**',
            '!src/node_modules/font-awesome/**/*.map',
            '!src/node_modules/font-awesome/.npmignore',
            '!src/node_modules/font-awesome/*.txt',
            '!src/node_modules/font-awesome/*.md',
            '!src/node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('src/dist/vendor/font-awesome'))
})

gulp.task('default', ['pages', 'static', 'images', 'less', 'minify-css', 'minify-js', 'copy' ]);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('src/less/*.less', ['less']);
    gulp.watch('src/css/*.css', ['minify-css']);
    gulp.watch('src/img/**/*',  [ 'images']);
    gulp.watch('src/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});
