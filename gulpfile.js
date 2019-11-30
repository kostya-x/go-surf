const gulp         = require('gulp'),
			sass         = require('gulp-sass'),
			browserSync  = require('browser-sync'),
			cssnano      = require('gulp-cssnano'),
			rename       = require('gulp-rename'),
			rigger       = require('gulp-rigger'),
			sourcemaps   = require('gulp-sourcemaps'),
			htmlmin      = require('gulp-htmlmin'),
			del          = require('del'),
			concat       = require('gulp-concat'),
			uglify       = require('gulp-uglify-es').default,
			imagemin     = require('gulp-imagemin'),
			pngquant     = require('imagemin-pngquant'),
			cache        = require('gulp-cache'),
			autoprefixer = require('gulp-autoprefixer'),
			plumber      = require('gulp-plumber'),
			sassGlob     = require('gulp-sass-glob');

gulp.task('clear', () => {
	return cache.clearAll();
})

gulp.task('clean', async () => {
	return del.sync('build');
});

gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: './build'
		},
		notify: false
	});
});

gulp.task('html', () => {
	return gulp.src('src/**/*.html')
		.pipe(plumber())
		.pipe(rigger())
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass', () => {
	return gulp.src('src/sass/**/*.sass')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(sourcemaps.write())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('css', () => {
	return gulp.src('src/css/*.css')
		.pipe(plumber())
		.pipe(sass())
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', () => {
	return gulp.src('src/js/*.js')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(rigger())
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build/js'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('img', () => {
	return gulp.src('src/img/**/*')
		.pipe(plumber())
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('build/img'));
});

gulp.task('watch', () => {
	gulp.watch('src/**/*.html', gulp.parallel('html'));
	gulp.watch('src/sass/**/*.sass', gulp.parallel('sass', 'css'));
	gulp.watch('src/js/**/*.js', gulp.parallel('scripts'));
	gulp.watch('src/img/**/*.*', gulp.parallel('img'));
});

gulp.task('build', gulp.parallel('clean', 'html', 'css', 'sass', 'img', 'scripts'));
gulp.task('start', gulp.parallel('clean', 'html', 'css', 'sass', 'img', 'scripts', 'browser-sync', 'watch'));
