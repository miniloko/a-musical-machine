const gulp       = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel      = require('gulp-babel');
const concat     = require('gulp-concat');

gulp.task('default', ['babel', 'copy']);

gulp.task('copy', function() {
	return gulp.src(['./src/index.html', './src/style.css', './node_modules/babel-polyfill/dist/polyfill.min.js'])
	.pipe(gulp.dest('./dist'));
});

gulp.task('babel', function() {
	return gulp.src('src/js/*.js')
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(concat('app.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./dist'))
	.on('error', function(err){
		console.log(err);
	});
});

gulp.task('watch', function() {
	return gulp.watch('./src/*.{js,html,css}', ['default']);
});