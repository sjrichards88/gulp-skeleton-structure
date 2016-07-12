// Include gulp and plugins 
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create(),
    onError = function (err) {
        console.log('An error occurred:', gutil.colors.magenta(err.message));
        gutil.beep();
        this.emit('end');
    };

// Start browserSync server
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
		  baseDir: 'dist'
		}
	});
});

// Compile Our Sass
gulp.task('styles', function() {
    return gulp.src('src/styles/main.scss')
    .pipe(plumber({ errorHandler: onError })) // Keep gulp running if there are errors, and send error to console
	.pipe(sourcemaps.init())
    .pipe(sass({ style: 'compressed' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/assets/css'))    
    .pipe(browserSync.reload({ // Reloading with Browser Sync
    	stream: true
    }));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src([
		'src/scripts/vendor/jquery-1.12.3.min.js',
		'src/scripts/vendor/*.js',
		'src/scripts/main.js'
	])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(plumber({ errorHandler: onError })) // Keep gulp running if there are errors, and send error to console
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
    	stream: true
    }));
});

// Optimise images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(plumber({errorHandler: onError}))
    .pipe(imagemin({optimizationLevel: 7, progressive: true}))
    .pipe(gulp.dest('dist/images'));
});

// Watch Files For Changes
gulp.task('watch', ['browserSync'], function() {
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('src/images/**/*', ['images']);
    gulp.watch('dist/**/*.html', browserSync.reload); 
});

// Default Task
gulp.task('default', ['styles', 'scripts', 'images', 'browserSync', 'watch']);